-- =========================================================================
-- DATABASE MIGRATION: PAYVERIFY ENHANCEMENTS (PHASE 2)
-- =========================================================================

-- 1. AI Reconciliation Insights table
CREATE TABLE IF NOT EXISTS public.ai_reconciliation_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
  summary TEXT,
  discrepancy_score NUMERIC(5,2) DEFAULT 0.00,
  detected_issues JSONB DEFAULT '[]'::JSONB,
  audit_recommendation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Organization Billing Settings table
CREATE TABLE IF NOT EXISTS public.organization_billing_settings (
  organization_id UUID PRIMARY KEY REFERENCES public.organizations(id) ON DELETE CASCADE,
  platform_fee_percent NUMERIC(5,2) DEFAULT 0.00,
  transaction_fee_fixed NUMERIC(14,2) DEFAULT 0.00,
  monthly_invoice_quota INTEGER DEFAULT 50,
  payout_reconciliation_limit NUMERIC(14,2) DEFAULT 1000000.00,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Subscription Plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  price_monthly NUMERIC(14,2) NOT NULL,
  invoice_limit INTEGER NOT NULL,
  payout_limit NUMERIC(14,2) NOT NULL,
  features TEXT[] DEFAULT '{}'::TEXT[]
);

-- Seed basic subscription plans if they don't exist
INSERT INTO public.subscription_plans (name, price_monthly, invoice_limit, payout_limit, features)
VALUES 
  ('Starter', 0.00, 50, 100000.00, ARRAY['Standard CSV matching', 'Email support']),
  ('Growth', 15000.00, 500, 2000000.00, ARRAY['Automated API sync', 'Duplicate shield', 'Priority support']),
  ('Enterprise', 150000.00, 999999, 999999999.00, ARRAY['Unlimited volume', 'Dedicated database node', 'Custom SLA'])
ON CONFLICT (name) DO NOTHING;

-- 4. Organization Subscriptions table
CREATE TABLE IF NOT EXISTS public.organization_subscriptions (
  organization_id UUID PRIMARY KEY REFERENCES public.organizations(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled')),
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '1 month',
  usage_invoices_count INTEGER DEFAULT 0,
  usage_reconciled_volume NUMERIC(14,2) DEFAULT 0.00,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Automation Rules table
CREATE TABLE IF NOT EXISTS public.automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- e.g., 'payment_mismatch', 'overdue_invoice'
  action_type TEXT NOT NULL, -- e.g., 'send_email_reminder', 'auto_flag_discrepancy'
  enabled BOOLEAN DEFAULT TRUE,
  configuration JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
