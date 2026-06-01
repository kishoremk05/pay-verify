-- =========================================
-- REFUND WORKFLOW SCHEMA EXTENSIONS
-- =========================================

-- 1. Create alerts table
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- 'overpayment', 'mismatch', 'duplicate'
  amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  message TEXT NOT NULL,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on alerts
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for alerts
DROP POLICY IF EXISTS "Members can view org alerts" ON public.alerts;
CREATE POLICY "Members can view org alerts" ON public.alerts
  FOR SELECT TO authenticated USING (organization_id = public.get_user_organization(auth.uid()));

DROP POLICY IF EXISTS "System can insert alerts" ON public.alerts;
CREATE POLICY "System can insert alerts" ON public.alerts
  FOR INSERT TO authenticated WITH CHECK (organization_id = public.get_user_organization(auth.uid()));

DROP POLICY IF EXISTS "Admins/Managers can update alerts" ON public.alerts;
CREATE POLICY "Admins/Managers can update alerts" ON public.alerts
  FOR UPDATE TO authenticated USING (organization_id = public.get_user_organization(auth.uid()));

-- 2. Modify refunds table to support status, invoice_id, and track processing steps
ALTER TABLE public.refunds ADD COLUMN IF NOT EXISTS invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL;
ALTER TABLE public.refunds ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'; -- 'pending', 'approved', 'rejected', 'completed'
ALTER TABLE public.refunds ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.refunds ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE public.refunds ADD COLUMN IF NOT EXISTS rejected_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.refunds ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;
ALTER TABLE public.refunds ADD COLUMN IF NOT EXISTS completed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.refunds ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
ALTER TABLE public.refunds ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- 3. Replace/upgrade trg_refund_inserted_audit
DROP TRIGGER IF EXISTS trg_refund_inserted_audit ON public.refunds;

CREATE OR REPLACE FUNCTION public.on_refund_status_change_audit()
RETURNS TRIGGER AS $$
DECLARE
  cust_name TEXT;
  perf_by_name TEXT;
BEGIN
  -- Get customer name
  SELECT name INTO cust_name FROM public.customers WHERE id = NEW.customer_id;
  
  -- Handle INSERT: Newly created pending request
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.audit_logs (organization_id, action_type, action_description, performed_by, related_record_id)
    VALUES (
      NEW.organization_id,
      'refund_created',
      'Refund request of ₦' || NEW.refund_amount || ' initiated for customer ' || COALESCE(cust_name, 'Unknown') || ' (Pending Approval). Reason: ' || NEW.reason,
      NEW.processed_by,
      NEW.id
    );
  END IF;

  -- Handle UPDATE: Status changes
  IF (TG_OP = 'UPDATE') THEN
    IF (OLD.status != NEW.status) THEN
      -- Get user name who changed status
      SELECT full_name INTO perf_by_name FROM public.profiles WHERE id = COALESCE(NEW.completed_by, NEW.approved_by, NEW.rejected_by);
      
      IF (NEW.status = 'approved') THEN
        INSERT INTO public.audit_logs (organization_id, action_type, action_description, performed_by, related_record_id)
        VALUES (
          NEW.organization_id,
          'refund_approved',
          'Refund of ₦' || NEW.refund_amount || ' for ' || COALESCE(cust_name, 'Unknown') || ' was APPROVED by ' || COALESCE(perf_by_name, 'Staff') || '.',
          NEW.approved_by,
          NEW.id
        );
      ELSIF (NEW.status = 'rejected') THEN
        INSERT INTO public.audit_logs (organization_id, action_type, action_description, performed_by, related_record_id)
        VALUES (
          NEW.organization_id,
          'refund_rejected',
          'Refund of ₦' || NEW.refund_amount || ' for ' || COALESCE(cust_name, 'Unknown') || ' was REJECTED by ' || COALESCE(perf_by_name, 'Staff') || '.',
          NEW.rejected_by,
          NEW.id
        );
      ELSIF (NEW.status = 'completed') THEN
        INSERT INTO public.audit_logs (organization_id, action_type, action_description, performed_by, related_record_id)
        VALUES (
          NEW.organization_id,
          'refund_completed',
          'Refund of ₦' || NEW.refund_amount || ' for ' || COALESCE(cust_name, 'Unknown') || ' was marked as COMPLETED (paid out) by ' || COALESCE(perf_by_name, 'Staff') || '.',
          NEW.completed_by,
          NEW.id
        );
        
        -- Automatically update the customer''s due amount by adding back the refunded amount (only when fully completed!)
        UPDATE public.customers
        SET due_amount = due_amount + NEW.refund_amount
        WHERE id = NEW.customer_id;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_refund_status_change_audit
  AFTER INSERT OR UPDATE ON public.refunds
  FOR EACH ROW
  EXECUTE FUNCTION public.on_refund_status_change_audit();
