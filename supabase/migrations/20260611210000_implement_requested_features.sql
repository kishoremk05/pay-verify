-- =========================================================================
-- DATABASE MIGRATION: IMPLEMENT REQUESTED ENHANCEMENTS
-- =========================================================================

-- 1. Add new columns to public.customers table
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS customer_status TEXT NOT NULL DEFAULT 'Active';
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS discount_eligible BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed', 'scholarship'));
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS discount_value NUMERIC(14,2) DEFAULT 0.00;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS discount_ref TEXT;

-- 2. Update the payment reconciliation trigger function to support discount structures
CREATE OR REPLACE FUNCTION public.recalculate_customer_reconciliation(cust_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cust_expected NUMERIC(14,2);
  cust_discount_eligible BOOLEAN;
  cust_discount_type TEXT;
  cust_discount_value NUMERIC(14,2);
  final_expected NUMERIC(14,2);
  total_paid_val NUMERIC(14,2);
  calculated_due NUMERIC(14,2);
  new_cust_status public.customer_status;
  org_id UUID;
BEGIN
  -- Get customer's expected amount, discount details and organization
  SELECT expected_amount, discount_eligible, discount_type, discount_value, organization_id 
  INTO cust_expected, cust_discount_eligible, cust_discount_type, cust_discount_value, org_id 
  FROM public.customers 
  WHERE id = cust_id;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Calculate Final Expected Fee based on discount eligibility and type
  IF cust_discount_eligible = TRUE THEN
    IF cust_discount_type = 'percentage' THEN
      final_expected := cust_expected - (cust_expected * COALESCE(cust_discount_value, 0) / 100);
    ELSIF cust_discount_type = 'fixed' THEN
      final_expected := cust_expected - COALESCE(cust_discount_value, 0);
    ELSIF cust_discount_type = 'scholarship' THEN
      final_expected := 0;
    ELSE
      final_expected := cust_expected;
    END IF;
  ELSE
    final_expected := cust_expected;
  END IF;

  -- Prevent final expected from being negative
  IF final_expected < 0 THEN
    final_expected := 0;
  END IF;

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
  SELECT COALESCE(SUM(amount_paid), 0) INTO total_paid_val 
  FROM public.payments 
  WHERE customer_id = cust_id AND status != 'duplicate';

  calculated_due := final_expected - total_paid_val;

  -- Determine customer status
  IF total_paid_val = 0 THEN
    new_cust_status := 'unpaid';
  ELSIF total_paid_val < final_expected THEN
    new_cust_status := 'partial';
  ELSIF total_paid_val = final_expected THEN
    new_cust_status := 'paid';
  ELSE
    new_cust_status := 'mismatch'; -- overpaid
  END IF;

  -- Update customer due_amount and status
  UPDATE public.customers 
  SET due_amount = calculated_due,
      status = new_cust_status
  WHERE id = cust_id;

  -- 3. Update non-duplicate payments' statuses to match the reconciliation status
  UPDATE public.payments
  SET status = CASE
    WHEN total_paid_val = 0 THEN 'unpaid'::public.payment_status
    WHEN total_paid_val < final_expected THEN 'partial'::public.payment_status
    WHEN total_paid_val = final_expected THEN 'paid'::public.payment_status
    ELSE 'mismatch'::public.payment_status
  END
  WHERE customer_id = cust_id AND status != 'duplicate';

END;
$$;

-- 3. Update the customer trigger function to handle discount changes
CREATE OR REPLACE FUNCTION public.on_customer_after_update_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF pg_trigger_depth() > 1 THEN
    RETURN NEW;
  END IF;

  -- Recalculate if expected_amount or discount details changed
  IF OLD.expected_amount != NEW.expected_amount 
     OR OLD.discount_eligible != NEW.discount_eligible 
     OR COALESCE(OLD.discount_type, '') != COALESCE(NEW.discount_type, '') 
     OR COALESCE(OLD.discount_value, 0) != COALESCE(NEW.discount_value, 0) THEN
    PERFORM public.recalculate_customer_reconciliation(NEW.id);
  END IF;
  RETURN NEW;
END;
$$;
