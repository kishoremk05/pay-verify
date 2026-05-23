-- =========================================
-- ENUMS
-- =========================================
CREATE TYPE public.app_role AS ENUM ('admin', 'member');
CREATE TYPE public.payment_status AS ENUM ('paid', 'partial', 'unpaid', 'duplicate', 'mismatch');
CREATE TYPE public.payment_source AS ENUM ('paystack', 'bank', 'cash', 'manual');
CREATE TYPE public.customer_status AS ENUM ('paid', 'partial', 'unpaid');

-- =========================================
-- UTILITIES
-- =========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================
-- ORGANIZATIONS
-- =========================================
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- PROFILES
-- =========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_profiles_organization_id ON public.profiles(organization_id);

CREATE TRIGGER profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- USER ROLES
-- =========================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, organization_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_organization_id ON public.user_roles(organization_id);

-- =========================================
-- SECURITY DEFINER HELPERS
-- =========================================
CREATE OR REPLACE FUNCTION public.get_user_organization(_user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM public.profiles WHERE id = _user_id LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- =========================================
-- CUSTOMERS
-- =========================================
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  service TEXT,
  expected_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  status public.customer_status NOT NULL DEFAULT 'unpaid',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_customers_organization_id ON public.customers(organization_id);

CREATE TRIGGER customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- PAYMENTS
-- =========================================
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  amount_paid NUMERIC(14,2) NOT NULL DEFAULT 0,
  payment_method TEXT,
  reference TEXT,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  status public.payment_status NOT NULL DEFAULT 'unpaid',
  source public.payment_source NOT NULL DEFAULT 'manual',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_payments_organization_id ON public.payments(organization_id);
CREATE INDEX idx_payments_customer_id ON public.payments(customer_id);
CREATE INDEX idx_payments_reference ON public.payments(reference);

CREATE TRIGGER payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- AUTO-CREATE ORG + PROFILE + ADMIN ROLE ON SIGNUP
-- =========================================
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
BEGIN
  org_name := COALESCE(NEW.raw_user_meta_data->>'organization_name', 'My Organization');
  full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));

  INSERT INTO public.organizations (name) VALUES (org_name)
  RETURNING id INTO new_org_id;

  INSERT INTO public.profiles (id, organization_id, full_name)
  VALUES (NEW.id, new_org_id, full_name);

  INSERT INTO public.user_roles (user_id, organization_id, role)
  VALUES (NEW.id, new_org_id, 'admin');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================
-- RLS POLICIES
-- =========================================

-- ORGANIZATIONS
CREATE POLICY "Members can view their organization"
ON public.organizations FOR SELECT TO authenticated
USING (id = public.get_user_organization(auth.uid()));

CREATE POLICY "Admins can update their organization"
ON public.organizations FOR UPDATE TO authenticated
USING (id = public.get_user_organization(auth.uid()) AND public.has_role(auth.uid(), 'admin'));

-- PROFILES
CREATE POLICY "Members can view profiles in their organization"
ON public.profiles FOR SELECT TO authenticated
USING (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid());

-- USER ROLES
CREATE POLICY "Members can view roles in their organization"
ON public.user_roles FOR SELECT TO authenticated
USING (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "Admins can insert roles in their organization"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (organization_id = public.get_user_organization(auth.uid()) AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles in their organization"
ON public.user_roles FOR UPDATE TO authenticated
USING (organization_id = public.get_user_organization(auth.uid()) AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles in their organization"
ON public.user_roles FOR DELETE TO authenticated
USING (organization_id = public.get_user_organization(auth.uid()) AND public.has_role(auth.uid(), 'admin'));

-- CUSTOMERS
CREATE POLICY "Members can view org customers"
ON public.customers FOR SELECT TO authenticated
USING (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "Members can insert org customers"
ON public.customers FOR INSERT TO authenticated
WITH CHECK (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "Members can update org customers"
ON public.customers FOR UPDATE TO authenticated
USING (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "Members can delete org customers"
ON public.customers FOR DELETE TO authenticated
USING (organization_id = public.get_user_organization(auth.uid()));

-- PAYMENTS
CREATE POLICY "Members can view org payments"
ON public.payments FOR SELECT TO authenticated
USING (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "Members can insert org payments"
ON public.payments FOR INSERT TO authenticated
WITH CHECK (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "Members can update org payments"
ON public.payments FOR UPDATE TO authenticated
USING (organization_id = public.get_user_organization(auth.uid()));

CREATE POLICY "Members can delete org payments"
ON public.payments FOR DELETE TO authenticated
USING (organization_id = public.get_user_organization(auth.uid()));