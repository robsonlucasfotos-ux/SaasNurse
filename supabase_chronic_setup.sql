-- Tabela de Pacientes Crônicos (Hipertensos e Diabéticos)
CREATE TABLE IF NOT EXISTS chronic_patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL, -- UUID do usuário da clínica (Enfermeiro)
    name TEXT NOT NULL,
    age INTEGER,
    phone TEXT,
    condition TEXT NOT NULL, -- Ex: 'HAS', 'DM', 'HAS e DM'
    risk_level TEXT NOT NULL DEFAULT 'Baixo', -- Ex: 'Baixo', 'Moderado', 'Alto'
    clinical_data JSONB, -- Evoluções, medicamentos, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE chronic_patients ENABLE ROW LEVEL SECURITY;

-- Criar política de segurança: cada usuário só vê/edita os seus próprios pacientes crônicos
CREATE POLICY "Users can manage their own chronic patients"
    ON chronic_patients FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
