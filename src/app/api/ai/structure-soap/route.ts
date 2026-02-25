import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: 'Configuração da API da OpenAI ausente no servidor' }, { status: 500 });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Texto não fornecido' }, { status: 400 });
        }

        const prompt = `
            Você é a NurseAI, uma assistente virtual especializada em Enfermagem na Atenção Primária à Saúde (APS).
            Sua tarefa é receber um texto livre (geralmente uma transcrição de voz) e estruturá-lo no modelo SOAP (Subjetivo, Objetivo, Avaliação, Plano).

            Regras:
            1. Subjetivo: Relato do paciente, queixas, histórico.
            2. Objetivo: Dados do exame físico, sinais vitais, achados observáveis.
            3. Avaliação: Hipótese diagnóstica, julgamento clínico.
            4. Plano: Condutas, agendamentos, prescrições, orientações.
            5. Sugira também o CIAP-2 e o CID-10 mais prováveis para o caso.

            Texto raw para processar:
            "${text}"

            Retorne APENAS um objeto JSON com as chaves: subjetivo, objetivo, avaliacao, plano, ciap2_sugestao, cid10_sugestao.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "Você é um assistente de enfermagem especializado em estruturação SOAP." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(response.choices[0].message.content || '{}');
        return NextResponse.json(result);

    } catch (error: any) {
        console.error('SOAP AI Error:', error);
        return NextResponse.json({ error: 'Falha ao processar texto com IA' }, { status: 500 });
    }
}
