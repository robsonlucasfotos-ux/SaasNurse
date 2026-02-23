import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const maxDuration = 60; // Standard GPT-4 response can take time
export const dynamic = 'force-dynamic';
// we will return a mock response or a helpful error.
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

const SYSTEM_PROMPT = `Você é o "NurseAI", um assistente de suporte à decisão clínica para Enfermeiros da Atenção Primária à Saúde (APS) no Brasil.
Sua inteligência é baseada exclusivamente nos Protocolos do Ministério da Saúde, Cadernos de Atenção Básica, PCDTs e Resoluções do COFEN (Conselho Federal de Enfermagem).

REGRAS RÍGIDAS:
1. Responda dúvidas baseadas estritamente em protocolos técnicos e na Lei do Exercício Profissional da Enfermagem (Lei 7.498/86).
2. Se a pergunta não for sobre saúde, clínica, enfermagem ou gestão do SUS, responda EXATAMENTE: "Sou um modelo consultivo treinado exclusivamente para questões de saúde e enfermagem. Não estou autorizado a responder sobre outros temas."
3. Mencione, quando apropriado, que você utiliza tecnologia avançada da OpenAI para processamento de linguagem natural aplicada à saúde.
4. Sempre que possível, cite o CIAP-2 correspondente à queixa ou agravo.`;

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        if (!process.env.OPENAI_API_KEY) {
            // Return a simulated response if no API key is provided for demonstration
            return NextResponse.json({
                reply: "Parece que a chave da API da OpenAI não está configurada no ambiente. Para funcionar plenamente, adicione a OPENAI_API_KEY no arquivo .env.local.\n\nSimulação de resposta: " + (message.toLowerCase().includes('enfermagem') || message.toLowerCase().includes('saúde') || message.toLowerCase().includes('ciap') || message.toLowerCase().includes('paciente') ? "De acordo com os cadernos de Atenção Básica, o correto é realizar a avaliação integral do paciente e registrar as condutas (CIAP-2)." : "Sou um modelo consultivo treinado exclusivamente para questões de enfermagem. Não estou autorizado a responder sobre outros temas.")
            });
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o', // or gpt-4-turbo
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: message }
            ],
            temperature: 0.2, // Low temperature for more deterministic, protocol-based answers
        });

        const reply = completion.choices[0]?.message?.content || 'Não foi possível gerar uma resposta.';

        return NextResponse.json({ reply });
    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Erro ao processar a requisição.' }, { status: 500 });
    }
}
