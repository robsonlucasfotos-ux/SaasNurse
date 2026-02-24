import { NextResponse, type NextRequest } from 'next/server';
import OpenAI from 'openai';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { ciap2Database } from '@/data/ciap2';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const ciap2Context = ciap2Database.map(c => `${c.code}: ${c.name} (${c.category})`).join('\n');

const BASE_PROMPT = `Você é o "NurseAI", um assistente de suporte à decisão clínica para Enfermeiros da Atenção Primária à Saúde (APS) no Brasil, treinado com dados oficiais (MS, COFEN, CIAP-2).

REGRAS:
1. Responda APENAS dúvidas sobre saúde, enfermagem, gestão clínica ou APS.
2. Se perguntado sobre assuntos fora desse escopo, responda: "Sou um modelo consultivo treinado exclusivamente para a Atenção Primária em Saúde. Não estou autorizado a responder sobre esse tema."
3. Sempre que possível, cite o código CIAP-2 correspondente utilizando a seguinte base de dados CIAP-2:
${ciap2Context}
4. Seja direto, objetivo e técnico.

CONTEXTO DA CLÍNICA DO USUÁRIO (dados em tempo real):
---
`;

export async function POST(req: NextRequest) {
    // 1. Parse do body
    let message: string;
    try {
        const body = await req.json();
        message = (body?.message || '').trim();
        if (!message) {
            return NextResponse.json({ error: 'Mensagem é obrigatória.' }, { status: 400 });
        }
    } catch {
        return NextResponse.json({ error: 'Body inválido.' }, { status: 400 });
    }

    // 2. Buscar contexto Supabase (RAG) — falha silenciosa
    let dbContext = 'Dados do banco não disponíveis nesta sessão.';
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll(); },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch { /* ignorar em Server Components */ }
                    }
                }
            }
        );

        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const [resPregnant, resChildren, resInventory] = await Promise.allSettled([
                supabase.rpc('get_pregnant_stats', { p_user_id: user.id }),
                supabase.rpc('get_children_stats', { p_user_id: user.id }),
                supabase.from('inventory_notes').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
            ]);

            const pStats = resPregnant.status === 'fulfilled' && resPregnant.value.data ? resPregnant.value.data[0] : null;
            const cStats = resChildren.status === 'fulfilled' && resChildren.value.data ? resChildren.value.data[0] : null;

            const pregnant_str = pStats ? `Total: ${pStats.total}. (1º Tri: ${pStats.trimestre_1}, 2º Tri: ${pStats.trimestre_2}, 3º Tri: ${pStats.trimestre_3})` : '0';
            const children_str = cStats ? `Total: ${cStats.total_criancas}. (Até 6 meses: ${cStats.ate_6_meses}, 6 a 12 meses: ${cStats.de_6_a_12_meses}, 1 a 2 anos: ${cStats.de_1_a_2_anos})` : '0';
            const inventory = resInventory.status === 'fulfilled' ? (resInventory.value.count ?? 0) : 0;

            dbContext = `
- Enfermeiro ID: ${user.id}
- Gestantes no Pré-natal: ${pregnant_str}
- Crianças na Puericultura: ${children_str}
- Notas de Estoque/Almoxarifado: ${inventory}
`;
        } else {
            dbContext = 'Usuário não autenticado — dados da clínica indisponíveis.';
        }
    } catch (ragErr) {
        console.error('[NurseAI] Erro RAG:', ragErr);
    }

    // 3. Chamar a OpenAI — sem pré-validação da chave (deixar a própria lib lidar com erros de autenticação)
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: BASE_PROMPT + dbContext },
                { role: 'user', content: message }
            ],
            temperature: 0.3,
            max_tokens: 1024,
        });

        const reply = completion.choices[0]?.message?.content?.trim()
            || 'Não foi possível gerar uma resposta no momento.';

        return NextResponse.json({ reply });

    } catch (err: any) {
        console.error('[NurseAI] Erro OpenAI:', err?.status, err?.message);

        let userMessage = 'Ocorreu um erro temporário. Tente novamente em instantes.';
        if (err?.status === 401) userMessage = 'Chave de API inválida. Contate o administrador.';
        if (err?.status === 429) userMessage = 'Limite de uso atingido. Aguarde alguns segundos e tente novamente.';

        return NextResponse.json({ reply: userMessage });
    }
}
