-- Tabela para Gestão de Estoque e Unidade (Estilo Post-its)
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

-- Usuários só podem acessar suas próprias notas
DROP POLICY IF EXISTS "Usuários gerenciam próprias notas" ON public.inventory_notes;
CREATE POLICY "Usuários gerenciam próprias notas" 
ON public.inventory_notes FOR ALL USING (auth.uid() = user_id);

-- Atualiza a data de updated_at na modificação
CREATE OR REPLACE FUNCTION update_inventory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_inventory_updated_at ON public.inventory_notes;
CREATE TRIGGER trg_inventory_updated_at
BEFORE UPDATE ON public.inventory_notes
FOR EACH ROW EXECUTE FUNCTION update_inventory_updated_at();
