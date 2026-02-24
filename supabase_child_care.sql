-- Supabase Schema for Child Care (Puericultura)
-- File: supabase_child_care.sql

CREATE TABLE IF NOT EXISTS public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender TEXT DEFAULT 'Não informado',
  risk_level TEXT DEFAULT 'Baixo' CHECK (risk_level IN ('Baixo', 'Moderado', 'Alto')),
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

-- Política de Acesso (CRUD apenas pro dono da conta/enfermeiro logado)
DROP POLICY IF EXISTS "Users can manage their own children patients" ON public.children;
CREATE POLICY "Users can manage their own children patients" ON public.children
  FOR ALL USING (auth.uid() = user_id);
