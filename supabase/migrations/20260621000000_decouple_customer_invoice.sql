-- =========================================================================
-- DATABASE MIGRATION: DECOUPLE CUSTOMER FROM SERVICES/DISCOUNTS
-- =========================================================================

-- 1. Create invoice_line_items table for multi-service invoices
CREATE TABLE IF NOT EXISTS public.invoice_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL,
  unit_price NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  quantity INTEGER NOT NULL DEFAULT 1,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed', 'scholarship')),
  discount_value NUMERIC(14,2) DEFAULT 0.00,
  discount_ref TEXT,
  subtotal NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Add invoice-level discount columns and subtotal to invoices table
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS invoice_discount_type TEXT CHECK (invoice_discount_type IN ('percentage', 'fixed')),
  ADD COLUMN IF NOT EXISTS invoice_discount_value NUMERIC(14,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS invoice_discount_ref TEXT,
  ADD COLUMN IF NOT EXISTS subtotal NUMERIC(14,2) DEFAULT 0.00;

-- 3. Enable RLS and create policies for invoice_line_items
ALTER TABLE public.invoice_line_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view invoice line items" ON public.invoice_line_items;
CREATE POLICY "Members can view invoice line items" ON public.invoice_line_items
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.invoices i 
      WHERE i.id = invoice_line_items.invoice_id 
        AND i.organization_id = public.get_user_organization(auth.uid())
    )
  );

DROP POLICY IF EXISTS "Finance/Admin can insert invoice line items" ON public.invoice_line_items;
CREATE POLICY "Finance/Admin can insert invoice line items" ON public.invoice_line_items
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.invoices i 
      WHERE i.id = invoice_line_items.invoice_id 
        AND i.organization_id = public.get_user_organization(auth.uid())
    )
  );

DROP POLICY IF EXISTS "Finance/Admin can update invoice line items" ON public.invoice_line_items;
CREATE POLICY "Finance/Admin can update invoice line items" ON public.invoice_line_items
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.invoices i 
      WHERE i.id = invoice_line_items.invoice_id 
        AND i.organization_id = public.get_user_organization(auth.uid())
    )
  );

DROP POLICY IF EXISTS "Admin can delete invoice line items" ON public.invoice_line_items;
CREATE POLICY "Admin can delete invoice line items" ON public.invoice_line_items
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.invoices i 
      WHERE i.id = invoice_line_items.invoice_id 
        AND i.organization_id = public.get_user_organization(auth.uid())
        AND public.has_role(auth.uid(), 'admin')
    )
  );

-- 4. Rewrite recalculate_customer_reconciliation function
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
  SELECT COALESCE(SUM(amount_paid), 0.00) INTO total_paid_val 
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

-- 5. Create Trigger function for invoices changes to automatically recalculate reconciliation
CREATE OR REPLACE FUNCTION public.on_invoice_change_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_invoice_change ON public.invoices;
CREATE TRIGGER trg_invoice_change
  AFTER INSERT OR UPDATE OR DELETE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.on_invoice_change_trigger();

-- 6. Drop the old customer trigger that was watching expected_amount on customer
DROP TRIGGER IF EXISTS trg_customer_after_update ON public.customers;
DROP FUNCTION IF EXISTS public.on_customer_after_update_trigger();
