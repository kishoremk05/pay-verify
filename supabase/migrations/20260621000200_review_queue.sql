-- =========================================================================
-- DATABASE MIGRATION: PAYMENT VERIFICATION REVIEW QUEUE
-- =========================================================================

-- 1. Add verification columns to payments table
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS confidence_score INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending'
    CHECK (verification_status IN ('auto_verified', 'staff_verified', 'pending', 'rejected')),
  ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;

-- 2. Backfill existing payments to auto_verified
UPDATE public.payments SET verification_status = 'auto_verified' WHERE verification_status IS NULL;

-- 3. Rewrite recalculate_customer_reconciliation function to filter by verification_status
CREATE OR REPLACE FUNCTION public.recalculate_customer_reconciliation(cust_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cust_expected NUMERIC(14,2);
  total_paid_val NUMERIC(14,2);
  calculated_due NUMERIC(14,2);
  new_cust_status public.customer_status;
  org_id UUID;
BEGIN
  -- Get customer organization
  SELECT organization_id INTO org_id 
  FROM public.customers 
  WHERE id = cust_id;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Calculate expected amount as sum of all customer invoices
  SELECT COALESCE(SUM(amount), 0.00) INTO cust_expected
  FROM public.invoices
  WHERE customer_id = cust_id;

  -- 1. Identify duplicates in payments for this customer's organization and update them.
  -- A payment is duplicate if its non-null reference or transaction_id appears more than once in the org.
  UPDATE public.payments p
  SET status = 'duplicate'
  WHERE p.organization_id = org_id AND (
    (p.reference IS NOT NULL AND p.reference IN (
      SELECT reference FROM public.payments 
      WHERE reference IS NOT NULL AND organization_id = org_id
      GROUP BY reference HAVING COUNT(*) > 1
    ))
    OR
    (p.transaction_id IS NOT NULL AND p.transaction_id IN (
      SELECT transaction_id FROM public.payments 
      WHERE transaction_id IS NOT NULL AND organization_id = org_id
      GROUP BY transaction_id HAVING COUNT(*) > 1
    ))
  );

  -- 2. Calculate total paid for non-duplicate payments associated with this customer
  -- Only count auto_verified and staff_verified payments
  SELECT COALESCE(SUM(amount_paid), 0.00) INTO total_paid_val 
  FROM public.payments 
  WHERE customer_id = cust_id 
    AND status != 'duplicate'
    AND (verification_status IS NULL OR verification_status IN ('auto_verified', 'staff_verified'));

  calculated_due := cust_expected - total_paid_val;

  -- Determine customer status
  IF total_paid_val = 0 THEN
    new_cust_status := 'unpaid';
  ELSIF total_paid_val < cust_expected THEN
    new_cust_status := 'partial';
  ELSIF total_paid_val = cust_expected THEN
    new_cust_status := 'paid';
  ELSE
    new_cust_status := 'mismatch'; -- overpaid
  END IF;

  -- Update customer expected_amount, due_amount, and status
  UPDATE public.customers 
  SET expected_amount = cust_expected,
      due_amount = calculated_due,
      status = new_cust_status
  WHERE id = cust_id;

  -- 3. Update non-duplicate payments' statuses to match the reconciliation status
  UPDATE public.payments
  SET status = CASE
    WHEN total_paid_val = 0 THEN 'unpaid'::public.payment_status
    WHEN total_paid_val < cust_expected THEN 'partial'::public.payment_status
    WHEN total_paid_val = cust_expected THEN 'paid'::public.payment_status
    ELSE 'mismatch'::public.payment_status
  END
  WHERE customer_id = cust_id AND status != 'duplicate';

END;
$$;
