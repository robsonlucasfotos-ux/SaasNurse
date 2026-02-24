-- Previne Brasil Updates
-- Adapting the database to track the 7 key health indicators.

-- 1. Update Pregnant Women Table
ALTER TABLE public.pregnant_women 
ADD COLUMN IF NOT EXISTS consultation_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS has_hiv_syphilis_exams BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_dental_consultation BOOLEAN DEFAULT false;

-- 2. Update Children Table
ALTER TABLE public.children
ADD COLUMN IF NOT EXISTS polio_vax_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS penta_vax_count INTEGER DEFAULT 0;

-- 3. Create Cytopathology Table (KPI 4)
CREATE TABLE IF NOT EXISTS public.cytopathology (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age INTEGER,
    last_exam_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cytopathology ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own cytopathology records"
ON public.cytopathology FOR ALL USING (auth.uid() = user_id);

-- 4. RPC for Previne Brasil Stats
CREATE OR REPLACE FUNCTION get_previne_brasil_stats(uid UUID)
RETURNS JSON AS $$
DECLARE
    -- KPI 1, 2, 3 (Prenatal)
    total_pregnant INTEGER;
    kpi1_count INTEGER; -- 6+ consults
    kpi2_count INTEGER; -- exams
    kpi3_count INTEGER; -- dental
    
    -- KPI 4 (Cyto)
    total_women_target INTEGER;
    kpi4_count INTEGER;
    
    -- KPI 5 (Vax)
    total_children_target INTEGER;
    kpi5_count INTEGER;
    
    -- KPI 6 (HAS)
    total_has INTEGER;
    kpi6_count INTEGER;
    
    -- KPI 7 (DM)
    total_dm INTEGER;
    kpi7_count INTEGER;
BEGIN
    -- Prenatal
    SELECT count(*) INTO total_pregnant FROM pregnant_women WHERE user_id = uid;
    SELECT count(*) INTO kpi1_count FROM pregnant_women WHERE user_id = uid AND consultation_count >= 6;
    SELECT count(*) INTO kpi2_count FROM pregnant_women WHERE user_id = uid AND has_hiv_syphilis_exams = true;
    SELECT count(*) INTO kpi3_count FROM pregnant_women WHERE user_id = uid AND has_dental_consultation = true;

    -- Cyto (target age 25-64)
    SELECT count(*) INTO total_women_target FROM cytopathology WHERE user_id = uid AND age >= 25 AND age <= 64;
    SELECT count(*) INTO kpi4_count FROM cytopathology WHERE user_id = uid AND age >= 25 AND age <= 64 AND last_exam_date >= (CURRENT_DATE - interval '3 years');

    -- Vax (Children < 1 year)
    SELECT count(*) INTO total_children_target FROM children WHERE user_id = uid AND birth_date >= (CURRENT_DATE - interval '1 year');
    SELECT count(*) INTO kpi5_count FROM children WHERE user_id = uid AND birth_date >= (CURRENT_DATE - interval '1 year') AND polio_vax_count >= 3 AND penta_vax_count >= 3;

    -- HAS
    SELECT count(*) INTO total_has FROM chronic_patients WHERE user_id = uid AND (condition = 'HAS' OR condition = 'HAS e DM');
    SELECT count(*) INTO kpi6_count FROM chronic_patients WHERE user_id = uid AND (condition = 'HAS' OR condition = 'HAS e DM') AND last_bp_check >= (CURRENT_DATE - interval '6 months');

    -- DM
    SELECT count(*) INTO total_dm FROM chronic_patients WHERE user_id = uid AND (condition = 'DM' OR condition = 'HAS e DM');
    SELECT count(*) INTO kpi7_count FROM chronic_patients WHERE user_id = uid AND (condition = 'DM' OR condition = 'HAS e DM') AND last_hba1c_date >= (CURRENT_DATE - interval '6 months');

    RETURN json_build_object(
        'kpi1', json_build_object('numerator', kpi1_count, 'denominator', total_pregnant),
        'kpi2', json_build_object('numerator', kpi2_count, 'denominator', total_pregnant),
        'kpi3', json_build_object('numerator', kpi3_count, 'denominator', total_pregnant),
        'kpi4', json_build_object('numerator', kpi4_count, 'denominator', total_women_target),
        'kpi5', json_build_object('numerator', kpi5_count, 'denominator', total_children_target),
        'kpi6', json_build_object('numerator', kpi6_count, 'denominator', total_has),
        'kpi7', json_build_object('numerator', kpi7_count, 'denominator', total_dm)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
