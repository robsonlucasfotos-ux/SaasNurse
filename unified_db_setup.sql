-- COLE ISSO NO SQL EDITOR DO SUPABASE E EXECUTE

-- 1. Criação da tabela unificada de pacientes
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT DEFAULT 'Não Informado',
    birth_date DATE,
    phone TEXT,
    address TEXT,
    acs_area TEXT,
    cpf TEXT,
    
    -- Flags e Classificações unificadas
    risk_level TEXT DEFAULT 'Habitual',
    risk_reason TEXT,
    
    is_pregnant BOOLEAN DEFAULT false,
    dum DATE,
    dpp DATE,
    
    is_chronic BOOLEAN DEFAULT false,
    chronic_condition TEXT, -- HAS, DM, HAS e DM
    
    is_child BOOLEAN DEFAULT false,
    
    -- Dados clínicos flexíveis em JSON
    clinical_data JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Criar política de segurança (o usuário só vê e edita os próprios pacientes)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'patients' AND policyname = 'Users can view their own patients'
    ) THEN
        CREATE POLICY "Users can view their own patients" ON public.patients FOR SELECT USING (auth.uid() = user_id);
        CREATE POLICY "Users can insert their own patients" ON public.patients FOR INSERT WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Users can update their own patients" ON public.patients FOR UPDATE USING (auth.uid() = user_id);
        CREATE POLICY "Users can delete their own patients" ON public.patients FOR DELETE USING (auth.uid() = user_id);
    END IF;
END
$$;

-- 2. Migração de dados: Gestantes -> Patients
-- Apenas migramos se a tabela antiga existir
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'pregnant_women') THEN
        INSERT INTO public.patients (id, user_id, name, age, gender, birth_date, phone, risk_level, risk_reason, is_pregnant, dum, dpp, clinical_data, created_at)
        SELECT 
            id, user_id, name, age, 'Feminino' as gender, birth_date, phone, risk_level, risk_reason, true as is_pregnant, dum, dpp, clinical_data, created_at
        FROM public.pregnant_women
        ON CONFLICT (id) DO NOTHING;
    END IF;
END
$$;

-- 3. Migração de dados: Crônicos -> Patients (caso exista a tabela antiga e tenha dados)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'chronic_patients') THEN
        INSERT INTO public.patients (id, user_id, name, age, phone, risk_level, is_chronic, chronic_condition, clinical_data)
        SELECT 
            id, user_id, name, age, phone, risk_level, true as is_chronic, condition as chronic_condition, clinical_data
        FROM public.chronic_patients
        ON CONFLICT (id) DO NOTHING;
    END IF;
END
$$;

-- Opcional: Atualizar pacientes que são hipertensos ou diabéticos pelo clinical_data
UPDATE public.patients
SET is_chronic = true
WHERE clinical_data->>'obs_hipertensao' = 'true'
   OR clinical_data->>'obs_diabetes' = 'true'
   OR chronic_condition IS NOT NULL;
