-- Tabela para Gestantes
CREATE TABLE IF NOT EXISTS public.pregnant_women (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  birth_date DATE,
  phone TEXT,
  risk_level TEXT DEFAULT 'Habitual', -- Habitual, Moderado, Alto
  risk_reason TEXT,
  dum DATE NOT NULL, -- Data da Última Menstruação (Usado para cálculo da Idade Gestacional)
  clinical_data JSONB DEFAULT '{}', -- Checklists de trimestre e observações (CPF, Endereço, etc)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.pregnant_women ENABLE ROW LEVEL SECURITY;

-- Usuários só podem acessar suas próprias gestantes
DROP POLICY IF EXISTS "Usuários gerenciam próprias gestantes" ON public.pregnant_women;
CREATE POLICY "Usuários gerenciam próprias gestantes" 
ON public.pregnant_women FOR ALL USING (auth.uid() = user_id);
