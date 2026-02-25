-- Drop the constraint if it limits Risk levels, but it doesn't currently on pregnant_women
-- Adicionando colunas opcionais conforme solicitado pelo usuário
ALTER TABLE public.pregnant_women ADD COLUMN IF NOT EXISTS cpf TEXT;
ALTER TABLE public.pregnant_women ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.pregnant_women ADD COLUMN IF NOT EXISTS acs_area TEXT;
