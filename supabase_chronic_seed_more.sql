-- ============================================================
-- SEED EXPANDIDO: Mais mulheres e idosos para Demo
-- EXECUTE ESTE SCRIPT NO SUPABASE SQL EDITOR
-- (Apenas insere mais pacientes, não apaga os existentes)
-- ============================================================
DO $$
DECLARE v_user_id UUID;
BEGIN
    SELECT id INTO v_user_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
    IF v_user_id IS NULL THEN RAISE EXCEPTION 'Nenhum usuário encontrado!'; END IF;

    -- Mais Mulheres
    INSERT INTO public.chronic_patients (user_id, name, age, phone, condition, risk_level, last_bp_check, last_hba1c, insulin_expiry_date, medications, observations)
    VALUES
        (v_user_id, 'Sebastiana Cardoso Melo', 72, '61981111111', 'HAS e DM', 'Alto', '2025-10-05', 9.4, '2026-04-01', 'Enalapril 20mg, Insulina NPH 30UI, AAS 100mg', 'Paciente idosa, alto risco. Retorno mensal.'),
        (v_user_id, 'Benedita Sousa Figueiredo', 68, '61982222222', 'HAS', 'Moderado', '2025-12-10', NULL, NULL, 'Losartana 50mg, Atenolol 25mg', 'PA controlada. Nega sintomas.'),
        (v_user_id, 'Gilma Ferreira Vicente', 54, '61983333333', 'DM', 'Baixo', '2026-01-15', 6.5, NULL, 'Metformina 850mg', 'Meta HbA1c atingida. Dieta e exercício.'),
        (v_user_id, 'Neide Aparecida Teixeira', 79, '61984444444', 'HAS e DM', 'Alto', '2025-09-01', 8.8, '2026-03-20', 'Anlodipino 10mg, Metformina 500mg, Glibenclamida 5mg', 'Idosa, polifarmácia. Orientada sobre hipoglicemia.'),
        (v_user_id, 'Tereza Cristina Borges', 61, '61985555555', 'HAS', 'Baixo', '2026-02-10', NULL, NULL, 'Captopril 12.5mg', 'Bem controlada. PA: 125/75.'),
        (v_user_id, 'Mirian Santos Cavalcante', 47, '61986666666', 'DM', 'Moderado', '2025-11-20', 7.9, NULL, 'Metformina 1g, Sitagliptina 100mg', 'HbA1c fora da meta. Reforçar dieta low carb.'),
        (v_user_id, 'Conceição Lima Braga', 83, NULL, 'HAS e DM', 'Alto', '2025-08-20', 10.1, NULL, 'Losartana 100mg, Furosemida 40mg, Insulina Regular', 'Idosa acamada. VD quinzenal pelo ACS.'),
        (v_user_id, 'Rosimeire Campos Pinheiro', 57, '61987777777', 'HAS', 'Moderado', '2025-12-28', NULL, NULL, 'Ramipril 10mg, Hidroclorotiazida 25mg', 'PA: 138/88. Orientada sobre sal.'),

        -- Mais Idosos (homens e mulheres)
        (v_user_id, 'Manoel Augusto Rodrigues', 81, '61988888888', 'HAS', 'Alto', '2025-08-01', NULL, NULL, 'Anlodipino 10mg, Atenolol 100mg, Furosemida 40mg', 'Cardiopata. Controle difícil. Encaminhado ao cardiologista.'),
        (v_user_id, 'Waldomiro José Cunha', 76, '61989999999', 'DM', 'Alto', '2025-11-05', 8.5, '2026-02-28', 'Insulina NPH 25UI, Metformina 500mg', 'Hipoglicemia recorrente noturna. Ajuste de insulina.'),
        (v_user_id, 'Hélio Monteiro Araújo', 69, '61980000001', 'HAS e DM', 'Moderado', '2026-01-08', 7.2, NULL, 'Valsartana 80mg, Glibenclamida 5mg', 'Estável. Retorno em 90 dias.'),
        (v_user_id, 'Iraci Gomes de Oliveira', 74, '61980000002', 'HAS', 'Moderado', '2025-12-15', NULL, NULL, 'Captopril 25mg', 'PA: 140/85. Orientada sobrepeso.'),
        (v_user_id, 'Zilda Marques Tavares', 77, NULL, 'HAS e DM', 'Alto', '2025-07-20', 9.6, '2026-03-05', 'Enalapril 10mg, Insulina NPH 40UI', 'Baixa escolaridade. Familiar responsável pelo controle.'),
        (v_user_id, 'Osvaldo Ferreira Leite', 80, '61980000003', 'DM', 'Alto', '2025-10-01', 11.2, NULL, 'Insulina Regular 10UI, NPH 30UI', 'Diabetes descompensado. Solicitado internamento eletivo.');

    RAISE NOTICE 'Sucesso! Mais pacientes (mulheres + idosos) inseridos para o usuário: %', v_user_id;
END $$;

-- Verificar total:
SELECT condition, COUNT(*) FROM public.chronic_patients GROUP BY condition ORDER BY condition;
