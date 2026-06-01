-- Extend app_role enum values (run outside transaction blocks if needed, but safe here)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'finance_staff';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'viewer';

-- Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'partial', 'overpaid', 'refunded'
  due_date DATE,
  generated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Refunds Table
CREATE TABLE IF NOT EXISTS public.refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  refund_amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  reason TEXT NOT NULL,
  processed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- System Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- e.g., 'invoice_creation', 'payment_import', 'refund_processed', 'staff_invite'
  action_description TEXT NOT NULL,
  performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  related_record_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- In-App & System Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- 'mismatch', 'duplicate', 'refund_alert', 'reminder'
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Team Invitations Table
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role public.app_role NOT NULL DEFAULT 'member',
  token TEXT NOT NULL UNIQUE,
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- -----------------
-- INVOICES POLICIES
-- -----------------
CREATE POLICY "Members can view org invoices" ON public.invoices
  FOR SELECT TO authenticated USING (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "Finance/Admin can insert invoices" ON public.invoices
  FOR INSERT TO authenticated WITH CHECK (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "Finance/Admin can update invoices" ON public.invoices
  FOR UPDATE TO authenticated USING (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "Admin can delete invoices" ON public.invoices
  FOR DELETE TO authenticated USING (
    organization_id = public.get_user_organization(auth.uid()) AND 
    public.has_role(auth.uid(), 'admin')
  );

-- -----------------
-- REFUNDS POLICIES
-- -----------------
CREATE POLICY "Members can view org refunds" ON public.refunds
  FOR SELECT TO authenticated USING (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "Finance/Admin can insert refunds" ON public.refunds
  FOR INSERT TO authenticated WITH CHECK (organization_id = public.get_user_organization(auth.uid()));

-- -------------------
-- AUDIT LOGS POLICIES
-- -------------------
CREATE POLICY "Members can view org audit logs" ON public.audit_logs
  FOR SELECT TO authenticated USING (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT TO authenticated WITH CHECK (organization_id = public.get_user_organization(auth.uid()));

-- ----------------------
-- NOTIFICATIONS POLICIES
-- ----------------------
CREATE POLICY "Members can view org notifications" ON public.notifications
  FOR SELECT TO authenticated USING (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "Members can update org notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "System can insert notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (organization_id = public.get_user_organization(auth.uid()));

-- --------------------
-- INVITATIONS POLICIES
-- --------------------
CREATE POLICY "Members can view org invitations" ON public.invitations
  FOR SELECT TO authenticated USING (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "Admins/Managers can create invitations" ON public.invitations
  FOR INSERT TO authenticated WITH CHECK (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "Admins/Managers can delete invitations" ON public.invitations
  FOR DELETE TO authenticated USING (organization_id = public.get_user_organization(auth.uid()));

-- ----------------------------------------------------
-- AUTOMATION TRIGGER: PAYMENT RECONCILIATION ALERTS
-- ----------------------------------------------------
CREATE OR REPLACE FUNCTION public.on_payment_reconciliation_alert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'duplicate' THEN
    INSERT INTO public.notifications (organization_id, title, message, type)
    VALUES (
      NEW.organization_id,
      'Duplicate Payment Flagged',
      'A payment reference (' || COALESCE(NEW.reference, 'N/A') || ') with amount ' || NEW.amount_paid || ' has been flagged as a duplicate transaction.',
      'duplicate'
    );
  ELSIF NEW.status = 'mismatch' THEN
    INSERT INTO public.notifications (organization_id, title, message, type)
    VALUES (
      NEW.organization_id,
      'Payment Mismatch Detected',
      'A payment of ' || NEW.amount_paid || ' was flagged as mismatch. Please review expected vs received amounts.',
      'mismatch'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_payment_reconciliation_alert
  AFTER INSERT OR UPDATE OF status ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.on_payment_reconciliation_alert();

-- ----------------------------------------------------
-- AUTOMATION TRIGGER: REFUNDS AUDIT
-- ----------------------------------------------------
CREATE OR REPLACE FUNCTION public.on_refund_inserted_audit()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (organization_id, action_type, action_description, performed_by, related_record_id)
  VALUES (
    NEW.organization_id,
    'refund_processed',
    'A refund of ₦' || NEW.refund_amount || ' was processed for a payment.',
    NEW.processed_by,
    NEW.id
  );
  
  -- Automatically update the customer''s due amount by adding back the refunded amount
  UPDATE public.customers
  SET due_amount = due_amount + NEW.refund_amount
  WHERE id = NEW.customer_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER trg_refund_inserted_audit
  AFTER INSERT ON public.refunds
  FOR EACH ROW
  EXECUTE FUNCTION public.on_refund_inserted_audit();

-- ----------------------------------------------------
-- OVERRIDE AUTH USER CREATED TRIGGER TO SUPPORT INVITES
-- ----------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_org_id UUID;
  org_name TEXT;
  full_name TEXT;
  meta_org_id_text TEXT;
  invited_role_text TEXT;
BEGIN
  full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));
  meta_org_id_text := NEW.raw_user_meta_data->>'organization_id';
  invited_role_text := NEW.raw_user_meta_data->>'invited_role';

  IF meta_org_id_text IS NOT NULL AND meta_org_id_text != '' THEN
    new_org_id := meta_org_id_text::UUID;
    
    INSERT INTO public.profiles (id, organization_id, full_name)
    VALUES (NEW.id, new_org_id, full_name);

    INSERT INTO public.user_roles (user_id, organization_id, role)
    VALUES (NEW.id, new_org_id, COALESCE(invited_role_text, 'viewer')::public.app_role);
  ELSE
    org_name := COALESCE(NEW.raw_user_meta_data->>'organization_name', 'My Organization');
    
    INSERT INTO public.organizations (name) VALUES (org_name)
    RETURNING id INTO new_org_id;

    INSERT INTO public.profiles (id, organization_id, full_name)
    VALUES (NEW.id, new_org_id, full_name);

    INSERT INTO public.user_roles (user_id, organization_id, role)
    VALUES (NEW.id, new_org_id, 'admin'::public.app_role);
  END IF;

  RETURN NEW;
END;
$$;

