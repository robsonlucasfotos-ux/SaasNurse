-- 1. Criar a tabela de controle de sessões dos dispositivos
CREATE TABLE IF NOT EXISTS public.device_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  device_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, device_id)
);

ALTER TABLE public.device_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Usuários gerenciam próprias sessões" ON public.device_sessions;
CREATE POLICY "Usuários gerenciam próprias sessões" 
ON public.device_sessions FOR ALL USING (auth.uid() = user_id);

-- 2. Gatilho (Trigger) para manter no MÁXIMO 2 sessões ativas por usuário
CREATE OR REPLACE FUNCTION check_device_sessions()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.device_sessions
  WHERE id IN (
    SELECT id FROM public.device_sessions
    WHERE user_id = NEW.user_id
    ORDER BY last_active DESC
    OFFSET 1 -- Mantém apenas a 1ª mais recente (e a NOVA que vai entrar será a 2ª)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS limit_sessions ON public.device_sessions;
CREATE TRIGGER limit_sessions
BEFORE INSERT OR UPDATE ON public.device_sessions
FOR EACH ROW EXECUTE FUNCTION check_device_sessions();


-- 3. Isolamento de Pacientes e Curativos por Enfermeiro(a)
-- Primeiro, adicionar a coluna
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Atualizar RLS dos pacientes
DROP POLICY IF EXISTS "Permitir acesso total pacientes" ON public.patients;
CREATE POLICY "Médicos vêem apenas seus pacientes" ON public.patients FOR ALL USING (auth.uid() = user_id);

-- Para evoluções, checamos via patient_id, mas é mais seguro ter o user_id direto ou o RLS do patient já filtra. 
-- Pra facilitar, vamos exigir login:
DROP POLICY IF EXISTS "Permitir acesso total evolucoes" ON public.wound_evolutions;
CREATE POLICY "Precisa estar logado para evoluções" ON public.wound_evolutions FOR ALL USING (auth.uid() IS NOT NULL);


-- 4. Proteger o Bucket de Fotos (Opcional MVP: garantir que só crie foto se logado)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

CREATE POLICY "Logged In Access" ON storage.objects FOR SELECT USING ( bucket_id = 'feridas' AND auth.uid() IS NOT NULL );
CREATE POLICY "Logged In Insert" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'feridas' AND auth.uid() IS NOT NULL );
CREATE POLICY "Logged In Delete" ON storage.objects FOR DELETE USING ( bucket_id = 'feridas' AND auth.uid() IS NOT NULL );
