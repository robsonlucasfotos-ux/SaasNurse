-- Adicionar colunas de responsável na tabela children (Puericultura)
-- Execute isso no Supabase SQL Editor:

ALTER TABLE children
  ADD COLUMN IF NOT EXISTS guardian_name TEXT,
  ADD COLUMN IF NOT EXISTS guardian_phone TEXT;
