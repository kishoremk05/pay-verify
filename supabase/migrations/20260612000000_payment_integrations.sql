-- =========================================================================
-- MIGRATION: PAYMENT INTEGRATIONS (Provider Management, Paystack, Bank, MoMo)
-- =========================================================================

-- 1. Extend payment_source enum with mobile money providers
ALTER TYPE public.payment_source ADD VALUE IF NOT EXISTS 'mtn_momo';
ALTER TYPE public.payment_source ADD VALUE IF NOT EXISTS 'telecel_cash';
ALTER TYPE public.payment_source ADD VALUE IF NOT EXISTS 'airteltigo';

-- 2. Add provider-specific and third-party payer columns to payments table
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS bank_name TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS mobile_number TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS paid_by_name TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS paid_by_phone TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS relationship TEXT;

-- 3. Create payment_providers table
CREATE TABLE IF NOT EXISTS public.payment_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  provider_type TEXT NOT NULL CHECK (provider_type IN ('paystack', 'bank_transfer', 'mtn_momo', 'telecel_cash', 'airteltigo')),
  provider_name TEXT NOT NULL,
  credentials_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_providers ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_payment_providers_org ON public.payment_providers(organization_id);
CREATE INDEX IF NOT EXISTS idx_payment_providers_type ON public.payment_providers(organization_id, provider_type);

CREATE TRIGGER payment_providers_updated_at
BEFORE UPDATE ON public.payment_providers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for payment_providers
CREATE POLICY "Members can view org payment providers"
  ON public.payment_providers FOR SELECT TO authenticated
  USING (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "Admins can insert payment providers"
  ON public.payment_providers FOR INSERT TO authenticated
  WITH CHECK (
    organization_id = public.get_user_organization(auth.uid())
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update payment providers"
  ON public.payment_providers FOR UPDATE TO authenticated
  USING (
    organization_id = public.get_user_organization(auth.uid())
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete payment providers"
  ON public.payment_providers FOR DELETE TO authenticated
  USING (
    organization_id = public.get_user_organization(auth.uid())
    AND public.has_role(auth.uid(), 'admin')
  );

-- 4. Create paystack_transactions cache table
CREATE TABLE IF NOT EXISTS public.paystack_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  paystack_id BIGINT NOT NULL,
  reference TEXT NOT NULL,
  amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'NGN',
  customer_email TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  status TEXT NOT NULL DEFAULT 'success',
  channel TEXT,
  paid_at TIMESTAMPTZ,
  metadata JSONB,
  reconciled BOOLEAN NOT NULL DEFAULT false,
  linked_payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, paystack_id)
);

ALTER TABLE public.paystack_transactions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_paystack_txn_org ON public.paystack_transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_paystack_txn_ref ON public.paystack_transactions(reference);
CREATE INDEX IF NOT EXISTS idx_paystack_txn_email ON public.paystack_transactions(customer_email);

-- RLS Policies for paystack_transactions
CREATE POLICY "Members can view org paystack transactions"
  ON public.paystack_transactions FOR SELECT TO authenticated
  USING (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "System can insert paystack transactions"
  ON public.paystack_transactions FOR INSERT TO authenticated
  WITH CHECK (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "System can update paystack transactions"
  ON public.paystack_transactions FOR UPDATE TO authenticated
  USING (organization_id = public.get_user_organization(auth.uid()));
