ALTER TABLE public.pregnant_women ADD COLUMN IF NOT EXISTS clinical_data JSONB DEFAULT '{}'::jsonb;
