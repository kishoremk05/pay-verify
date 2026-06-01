-- =========================================
-- ADD ACCOUNT NUMBER TO CUSTOMERS
-- =========================================
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS account_number TEXT;
