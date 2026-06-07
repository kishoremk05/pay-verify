-- =========================================
-- SERVICES TABLE (Rate Card / Service Catalog)
-- =========================================
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    fee NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_services_organization_id ON public.services(organization_id);

-- Setup Trigger for updated_at
CREATE TRIGGER services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Security Policies
CREATE POLICY "Members can view org services"
ON public.services FOR SELECT TO authenticated
USING (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "Admins can insert org services"
ON public.services FOR INSERT TO authenticated
WITH CHECK (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "Admins can update org services"
ON public.services FOR UPDATE TO authenticated
USING (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "Admins can delete org services"
ON public.services FOR DELETE TO authenticated
USING (organization_id = public.get_user_organization(auth.uid()));

-- =========================================
-- MULTI-CURRENCY SUPPORT
-- =========================================

-- Add currency column to organizations (workspace default)
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'NGN';

-- Add currency column to invoices (per-invoice currency)
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'NGN';
