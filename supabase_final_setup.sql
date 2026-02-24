-- TABELAS RESTAURADAS COM TODOS OS CAMPOS (Executar tudo junto)

-- 1. Tabela para Gestantes
CREATE TABLE IF NOT EXISTS public.pregnant_women (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  birth_date DATE,
  phone TEXT,
  risk_level TEXT DEFAULT 'Habitual',
  risk_reason TEXT,
  dum DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Garante que colunas que podem estar faltando sejam criadas caso a tabela já exista
DO $$
BEGIN
    BEGIN ALTER TABLE public.pregnant_women ADD COLUMN phone TEXT; EXCEPTION WHEN duplicate_column THEN END;
    BEGIN ALTER TABLE public.pregnant_women ADD COLUMN age INTEGER; EXCEPTION WHEN duplicate_column THEN END;
    BEGIN ALTER TABLE public.pregnant_women ADD COLUMN risk_reason TEXT; EXCEPTION WHEN duplicate_column THEN END;
END $$;

ALTER TABLE public.pregnant_women ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários gerenciam próprias gestantes" ON public.pregnant_women;
CREATE POLICY "Usuários gerenciam próprias gestantes" 
ON public.pregnant_women FOR ALL USING (auth.uid() = user_id);


-- 2. Tabela para Crianças (Puericultura)
CREATE TABLE IF NOT EXISTS public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender TEXT DEFAULT 'Não informado',
  risk_level TEXT DEFAULT 'Baixo' CHECK (risk_level IN ('Baixo', 'Moderado', 'Alto')),
  guardian_name TEXT,
  guardian_phone TEXT,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Garante colunas da evolução e acompanhamento familiar
DO $$
BEGIN
    BEGIN ALTER TABLE public.children ADD COLUMN guardian_name TEXT; EXCEPTION WHEN duplicate_column THEN END;
    BEGIN ALTER TABLE public.children ADD COLUMN guardian_phone TEXT; EXCEPTION WHEN duplicate_column THEN END;
    BEGIN ALTER TABLE public.children ADD COLUMN observations TEXT; EXCEPTION WHEN duplicate_column THEN END;
END $$;

ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own children patients" ON public.children;
CREATE POLICY "Users can manage their own children patients" 
ON public.children FOR ALL USING (auth.uid() = user_id);


-- 3. Tabela para Gestão de Estoque (Post-its)
CREATE TABLE IF NOT EXISTS public.inventory_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  color TEXT DEFAULT '#ffffff',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.inventory_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários gerenciam próprias notas" ON public.inventory_notes;
CREATE POLICY "Usuários gerenciam próprias notas" 
ON public.inventory_notes FOR ALL USING (auth.uid() = user_id);


-- 4. FUNÇÕES DE EVOLUÇÃO AUTOMÁTICA (Para Inteligência Artificial consultar)

-- Função que calcula autonomamente os agrupamentos por Trimestre das Gestantes
-- Baseado na Data da Última Menstruação (DUM) vs Data de Hoje (CURRENT_DATE)
CREATE OR REPLACE FUNCTION get_pregnant_stats(p_user_id UUID)
RETURNS TABLE (
    trimestre_1 BIGINT,
    trimestre_2 BIGINT,
    trimestre_3 BIGINT,
    total BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) FILTER (WHERE (CURRENT_DATE - dum) / 7 <= 12) AS trimestre_1,
        COUNT(*) FILTER (WHERE (CURRENT_DATE - dum) / 7 BETWEEN 13 AND 27) AS trimestre_2,
        COUNT(*) FILTER (WHERE (CURRENT_DATE - dum) / 7 >= 28) AS trimestre_3,
        COUNT(*) AS total
    FROM public.pregnant_women
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Função que calcula autonomamente os estagios de desenvolvimento Crianças
-- Baseado na data de nascimento (birth_date) vs Data de Hoje
CREATE OR REPLACE FUNCTION get_children_stats(p_user_id UUID)
RETURNS TABLE (
    ate_6_meses BIGINT,
    de_6_a_12_meses BIGINT,
    de_1_a_2_anos BIGINT,
    total_criancas BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) FILTER (WHERE (CURRENT_DATE - birth_date) <= 180) AS ate_6_meses,
        COUNT(*) FILTER (WHERE (CURRENT_DATE - birth_date) > 180 AND (CURRENT_DATE - birth_date) <= 365) AS de_6_a_12_meses,
        COUNT(*) FILTER (WHERE (CURRENT_DATE - birth_date) > 365 AND (CURRENT_DATE - birth_date) <= 730) AS de_1_a_2_anos,
        COUNT(*) AS total_criancas
    FROM public.children
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
