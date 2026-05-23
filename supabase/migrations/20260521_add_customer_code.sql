-- Add customer_code column to customers table
ALTER TABLE public.customers ADD COLUMN customer_code TEXT;

-- Unique per organization (allows different orgs to reuse same codes)
CREATE UNIQUE INDEX idx_customers_code_org 
  ON public.customers(organization_id, customer_code) 
  WHERE customer_code IS NOT NULL;
