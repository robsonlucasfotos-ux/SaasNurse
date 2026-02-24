-- Supabase Schema for WhatsApp Reminders (Evolution API Integration)
-- File: supabase_whatsapp_reminders.sql

CREATE TABLE IF NOT EXISTS public.whatsapp_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  message TEXT NOT NULL,
  send_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.whatsapp_reminders ENABLE ROW LEVEL SECURITY;

-- Política de Acesso (CRUD apenas pro dono da conta/enfermeiro logado)
DROP POLICY IF EXISTS "Users can manage their own reminders" ON public.whatsapp_reminders;
CREATE POLICY "Users can manage their own reminders" ON public.whatsapp_reminders
  FOR ALL USING (auth.uid() = user_id);

-- Para permitir que um processo Server-Side Cron Job acesse todos os pendentes, é preciso estar
-- usando a SUPABASE_SERVICE_ROLE_KEY no node.js (que cruza o RLS automaticamente). Não há necessidade de policy pública.
