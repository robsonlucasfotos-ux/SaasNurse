-- 1. Cria a tabela de pacientes
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cpf TEXT UNIQUE,
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Cria a tabela de evoluções fotográficas de feridas (com vínculo ao paciente)
CREATE TABLE public.wound_evolutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  lesion_type TEXT NOT NULL,
  ryb_color TEXT NOT NULL,
  ryb_status TEXT NOT NULL,
  conduct TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Configura a segurança (RLS) para permitir leitura e escrita pública durante o MVP
-- Atenção: Num ambiente de produção restrito, isso deve ser travado para apenas usuários logados.
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wound_evolutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acesso total aos pacientes para MVP" 
ON public.patients FOR ALL USING (true);

CREATE POLICY "Permitir acesso total às evoluções para MVP" 
ON public.wound_evolutions FOR ALL USING (true);

-- 4. Cria o "storage bucket" (O balde de fotos) chamado "feridas" e o torna público
INSERT INTO storage.buckets (id, name, public) 
VALUES ('feridas', 'feridas', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Configura políticas de segurança para permitir qualquer um ver e subir fotos no bucket "feridas"
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'feridas' );

CREATE POLICY "Public Insert" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'feridas' );

CREATE POLICY "Public Delete" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'feridas' );
