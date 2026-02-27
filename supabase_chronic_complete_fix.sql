-- ============================================================
-- PASSO 1: RECRIAR A TABELA (Drop seguro + Create completo)
-- ============================================================
DROP TABLE IF EXISTS chronic_patients CASCADE;

CREATE TABLE public.chronic_patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age INTEGER,
    phone TEXT,
    condition TEXT NOT NULL DEFAULT 'HAS',
    risk_level TEXT NOT NULL DEFAULT 'Baixo',
    last_bp_check DATE,
    last_hba1c NUMERIC(4,1),
    last_hba1c_date DATE,
    insulin_expiry_date DATE,
    medications TEXT,
    observations TEXT,
    clinical_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ============================================================
-- PASSO 2: HABILITAR RLS + POLITICA CORRETA
-- ============================================================
ALTER TABLE public.chronic_patients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own chronic patients" ON public.chronic_patients;
CREATE POLICY "Users can manage their own chronic patients"
    ON public.chronic_patients FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- PASSO 3: INSERIR PACIENTES DE DEMONSTRAÇÃO
-- ATENÇÃO: Substitua o UUID abaixo pelo seu user_id real.
-- Para encontrá-lo: Auth > Users > copie o ID do seu usuário
-- ============================================================
-- Descubra seu user_id rodando: SELECT id FROM auth.users LIMIT 5;

DO $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Pega o primeiro usuário da tabela auth.users automaticamente
    SELECT id INTO v_user_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Nenhum usuário encontrado em auth.users. Faça login primeiro!';
    END IF;

    INSERT INTO public.chronic_patients 
        (user_id, name, age, phone, condition, risk_level, last_bp_check, last_hba1c, insulin_expiry_date, medications, observations)
    VALUES
        (v_user_id, 'João da Silva Santos', 62, '61981234567', 'HAS', 'Moderado', '2025-12-01', NULL, NULL, 'Losartana 50mg, Hidroclorotiazida 25mg', 'Nega cefaleia. PA em controle.'),
        (v_user_id, 'Maria das Graças Oliveira', 58, '61987654321', 'DM', 'Alto', '2025-11-15', 8.2, '2026-01-10', 'Metformina 850mg, Insulina NPH 20UI', 'HbA1c acima da meta. Encaminhada ao endocrinologista.'),
        (v_user_id, 'Antônio Carlos Pereira', 71, '61991234567', 'HAS e DM', 'Alto', '2025-10-20', 7.8, '2026-03-15', 'Enalapril 10mg, Metformina 1g, AAS 100mg', 'Paciente aderente. Orientado sobre dieta.'),
        (v_user_id, 'Francisca Lima Souza', 55, '61992345678', 'HAS', 'Baixo', '2026-01-05', NULL, NULL, 'Captopril 25mg', 'Bem controlada. PA: 130/80 mmHg.'),
        (v_user_id, 'José Roberto Alves', 67, '61993456789', 'DM', 'Moderado', '2025-09-10', 9.1, NULL, 'Glibenclamida 5mg, Metformina 500mg', 'Dificuldade de adesão. Acompanhando mensalmente.'),
        (v_user_id, 'Ana Paula Ferreira', 49, '61994567890', 'HAS e DM', 'Moderado', '2026-01-20', 6.8, NULL, 'Losartana 100mg, Metformina 850mg', 'Ótima adesão. Meta glicêmica atingida.'),
        (v_user_id, 'Carlos Eduardo Martins', 73, '61995678901', 'HAS', 'Alto', '2025-08-15', NULL, NULL, 'Anlodipino 5mg, Atenolol 50mg, Furosemida 40mg', 'Alto risco cardiovascular. IC compensada.'),
        (v_user_id, 'Raimunda Nascimento Costa', 61, NULL, 'DM', 'Baixo', '2026-02-01', 6.2, '2026-03-30', NULL, 'Controlada com dieta e exercício. Redução da medicação.'),
        (v_user_id, 'Pedro Henrique Barbosa', 56, '61996789012', 'HAS e DM', 'Alto', NULL, 8.9, NULL, 'Valsartana 160mg, Insulina Regular, NPH', 'PA descontrolada. Revisão da medicação necessária.'),
        (v_user_id, 'Luzia Aparecida Rocha', 66, '61997890123', 'HAS', 'Moderado', '2025-12-20', NULL, NULL, 'Ramipril 10mg', 'Edema leve. PA: 145/90. Ajustar dose.');

    RAISE NOTICE 'Sucesso! 10 pacientes crônicos inseridos para o usuário: %', v_user_id;
END $$;

-- Verificar resultado:
SELECT name, condition, risk_level, last_bp_check FROM public.chronic_patients ORDER BY name;
