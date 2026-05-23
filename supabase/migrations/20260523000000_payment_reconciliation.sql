-- =========================================
-- ALTER TYPES & TABLES
-- =========================================

-- Add 'mismatch' to customer_status enum if not exists
ALTER TYPE public.customer_status ADD VALUE IF NOT EXISTS 'mismatch';

-- Add due_amount to customers table
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS due_amount NUMERIC(14,2) NOT NULL DEFAULT 0.00;

-- Add transaction_id and currency to payments table
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS transaction_id TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'NGN';

-- =========================================
-- RECONCILIATION TRIGGERS & FUNCTIONS
-- =========================================

-- Function to recalculate customer due amount and statuses
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
  -- Get customer's expected amount and organization
  SELECT expected_amount, organization_id INTO cust_expected, org_id 
  FROM public.customers 
  WHERE id = cust_id;
  
  IF NOT FOUND THEN
    RETURN;
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

  -- Update customer due_amount and status
  UPDATE public.customers 
  SET due_amount = calculated_due,
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

-- Trigger function for payments table changes
CREATE OR REPLACE FUNCTION public.on_payment_change_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Prevent recursion using trigger depth check
  IF pg_trigger_depth() > 1 THEN
    RETURN NEW;
  END IF;

  -- If insert or update: recalculate for NEW customer
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.customer_id IS NOT NULL THEN
    PERFORM public.recalculate_customer_reconciliation(NEW.customer_id);
  END IF;

  -- If update and customer changed: recalculate for OLD customer too
  IF TG_OP = 'UPDATE' AND OLD.customer_id IS NOT NULL AND OLD.customer_id != COALESCE(NEW.customer_id, '00000000-0000-0000-0000-000000000000'::uuid) THEN
    PERFORM public.recalculate_customer_reconciliation(OLD.customer_id);
  END IF;

  -- If delete: recalculate for OLD customer
  IF TG_OP = 'DELETE' AND OLD.customer_id IS NOT NULL THEN
    PERFORM public.recalculate_customer_reconciliation(OLD.customer_id);
  END IF;

  -- Handle duplicate status updates for anonymous payments
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.customer_id IS NULL THEN
    UPDATE public.payments p
    SET status = CASE
      WHEN (p.reference IS NOT NULL AND p.reference IN (
              SELECT reference FROM public.payments 
              WHERE reference IS NOT NULL AND organization_id = p.organization_id
              GROUP BY reference HAVING COUNT(*) > 1
            ))
           OR
           (p.transaction_id IS NOT NULL AND p.transaction_id IN (
              SELECT transaction_id FROM public.payments 
              WHERE transaction_id IS NOT NULL AND organization_id = p.organization_id
              GROUP BY transaction_id HAVING COUNT(*) > 1
            )) THEN 'duplicate'::public.payment_status
      ELSE 'paid'::public.payment_status
    END
    WHERE p.id = NEW.id;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Bind trigger to payments table
DROP TRIGGER IF EXISTS trg_payment_change ON public.payments;
CREATE TRIGGER trg_payment_change
AFTER INSERT OR UPDATE OR DELETE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.on_payment_change_trigger();

-- Trigger for customer updates (recalculate if expected_amount changes)
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

  IF OLD.expected_amount != NEW.expected_amount THEN
    PERFORM public.recalculate_customer_reconciliation(NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_customer_after_update ON public.customers;
CREATE TRIGGER trg_customer_after_update
AFTER UPDATE ON public.customers
FOR EACH ROW EXECUTE FUNCTION public.on_customer_after_update_trigger();
