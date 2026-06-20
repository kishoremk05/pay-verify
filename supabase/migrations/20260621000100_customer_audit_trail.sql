-- =========================================================================
-- DATABASE MIGRATION: CUSTOMER CHANGE LOG AUDIT TRAIL
-- =========================================================================

-- 1. Create customer_change_log table
CREATE TABLE IF NOT EXISTS public.customer_change_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.customer_change_log ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for customer_change_log
DROP POLICY IF EXISTS "Members can view customer change log" ON public.customer_change_log;
CREATE POLICY "Members can view customer change log" ON public.customer_change_log
  FOR SELECT TO authenticated USING (organization_id = public.get_user_organization(auth.uid()));

DROP POLICY IF EXISTS "Members can insert customer change log" ON public.customer_change_log;
CREATE POLICY "Members can insert customer change log" ON public.customer_change_log
  FOR INSERT TO authenticated WITH CHECK (organization_id = public.get_user_organization(auth.uid()));
