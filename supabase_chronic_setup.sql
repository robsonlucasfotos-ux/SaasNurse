-- Final SQL for Chronic Patients (HAS/DM)
-- This schema handles Hiperdia monitoring, insulin alerts, and BP check tracking.

-- 1. Create Chronic Patients Table
CREATE TABLE IF NOT EXISTS public.chronic_patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age INTEGER,
    phone TEXT,
    condition TEXT CHECK (condition IN ('HAS', 'DM', 'HAS e DM')),
    risk_level TEXT CHECK (risk_level IN ('Baixo', 'Moderado', 'Alto')),
    last_bp_check DATE,
    last_hba1c NUMERIC,
    last_hba1c_date DATE,
    insulin_expiry_date DATE,
    medications TEXT,
    observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. RLS (Row Level Security)
ALTER TABLE public.chronic_patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own chronic patients"
ON public.chronic_patients
FOR ALL
USING (auth.uid() = user_id);

-- 3. RPC for Chronic Metrics
CREATE OR REPLACE FUNCTION get_chronic_stats(uid UUID)
RETURNS JSON AS $$
DECLARE
    total INTEGER;
    has_count INTEGER;
    dm_count INTEGER;
    both_count INTEGER;
    insulin_expiry_soon INTEGER;
    bp_overdue INTEGER;
BEGIN
    SELECT count(*) INTO total FROM chronic_patients WHERE user_id = uid;
    SELECT count(*) INTO has_count FROM chronic_patients WHERE user_id = uid AND condition = 'HAS';
    SELECT count(*) INTO dm_count FROM chronic_patients WHERE user_id = uid AND condition = 'DM';
    SELECT count(*) INTO both_count FROM chronic_patients WHERE user_id = uid AND condition = 'HAS e DM';
    
    -- Insulin expiring in next 15 days
    SELECT count(*) INTO insulin_expiry_soon 
    FROM chronic_patients 
    WHERE user_id = uid 
    AND insulin_expiry_date IS NOT NULL 
    AND insulin_expiry_date <= (CURRENT_DATE + interval '15 days');

    -- BP Check overdue (> 3 months)
    SELECT count(*) INTO bp_overdue 
    FROM chronic_patients 
    WHERE user_id = uid 
    AND last_bp_check IS NOT NULL 
    AND last_bp_check <= (CURRENT_DATE - interval '3 months');

    RETURN json_build_object(
        'total', total,
        'has', has_count,
        'dm', dm_count,
        'both', both_count,
        'insulin_alert', insulin_expiry_soon,
        'bp_alert', bp_overdue
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
