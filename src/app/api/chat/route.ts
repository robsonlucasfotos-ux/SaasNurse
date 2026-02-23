import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const maxDuration = 60; // Standard GPT-4 response can take time
export const dynamic = 'force-dynamic';
// we will return a mock response or a helpful error.
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

const SYSTEM_PROMPT = `Você é uma mentora técnica em enfermagem de APS. Responda dúvidas baseadas estritamente em protocolos do Ministério da Saúde e Resoluções do Cofen.
REGRA DE SEGURANÇA: Se a pergunta não for sobre saúde/enfermagem, responda EXATAMENTE com a seguinte frase: "Sou um modelo consultivo treinado exclusivamente para questões de enfermagem. Não estou autorizado a responder sobre outros temas."`;

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
