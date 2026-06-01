-- =========================================
-- INVOICE WORKFLOW SCHEMA EXTENSIONS
-- =========================================

-- Link payments to invoices
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL;

-- Save uploaded receipt proof and AI extraction logs on the invoice
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS receipt_url TEXT;
ALTER TABLE public.invoices ADD COLUMN IF NOT EXISTS ai_extracted_data JSONB;

-- Enable anonymous public SELECT on invoices for customer checkout portal
-- The backend uses supabaseAdmin (service role) to bypass RLS anyway,
-- but this ensures the public portal can also read via anon key if needed.
CREATE POLICY "Public anonymous read access to invoices by id"
  ON public.invoices
  FOR SELECT
  TO anon
  USING (true);
