import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Este endpoint recebe a ordem de agendamento do App Frontend
export async function POST(req: Request) {
    try {
        const { patientName, phone, message, date } = await req.json();

        if (!phone || !message || !date) {
            return NextResponse.json({ error: 'Faltam dados obrigatórios' }, { status: 400 });
        }

        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll() },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch (error) {
                            // Ignora set em server side
                        }
                    }
                }
            }
        );

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        // Salva na fila do Supabase para disparo
        const { error: dbError } = await supabase.from('whatsapp_reminders').insert({
            user_id: user.id,
            patient_name: patientName || 'Paciente',
            patient_phone: phone.replace(/\D/g, ''), // Somente números
            message: message,
            send_date: date,
            status: 'pending'
        });

        if (dbError) throw dbError;

        return NextResponse.json({ success: true, message: 'Lembrete de WhatsApp salvo em fila com sucesso.' });

    } catch (error: any) {
        console.error('Erro ao agendar lembrete:', error.message);
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
}
