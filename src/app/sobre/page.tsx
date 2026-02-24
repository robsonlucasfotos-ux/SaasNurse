'use client';

import { ShieldCheck, Stethoscope, Lightbulb, ChevronLeft, Lock, FileText } from 'lucide-react';
import Link from 'next/link';

export default function SobrePage() {
    return (
        <div className="flex flex-col h-full gap-8 pb-20 max-w-2xl mx-auto w-full animate-in fade-in">
            <div className="flex items-center gap-4 border-b pb-4">
                <Link href="/" className="btn btn-ghost p-2 -ml-2 text-muted hover:text-black">
                    <ChevronLeft size={24} />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold">Guia APS</h2>
                    <p className="text-muted text-sm mt-1">LGPD, Privacidade e Propósito</p>
                </div>
            </div>

            <div className="flex flex-col gap-6">

                {/* Foco Assistencial */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-black/5">
                    <div className="flex items-center gap-3 mb-4 text-blue-600">
                        <div className="bg-blue-100 p-2 rounded-xl"><Stethoscope size={24} /></div>
                        <h3 className="font-bold text-lg text-black dark:text-white">Foco 100% Assistencial</h3>
                    </div>
                    <p className="text-muted leading-relaxed text-sm">
                        O <strong>Guia APS</strong> é um hub de suporte à decisão clínica para enfermeiros da Atenção Primária à Saúde,
                        fundamentado nas diretrizes do <strong>Ministério da Saúde</strong> e nas resoluções vigentes do <strong>COFEN</strong>.
                        Nossa missão é puramente assistencial: elevar a qualidade do atendimento, reduzir erros e dar ao profissional
                        de enfermagem a agilidade que a rotina exige.
                    </p>
                </section>

                {/* IA Exclusiva */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-black/5">
                    <div className="flex items-center gap-3 mb-4 text-emerald-600">
                        <div className="bg-emerald-100 p-2 rounded-xl"><Lightbulb size={24} /></div>
                        <h3 className="font-bold text-lg text-black dark:text-white">IA Exclusiva para Saúde</h3>
                    </div>
                    <p className="text-muted leading-relaxed text-sm">
                        O assistente NurseAI é alimentado pela tecnologia <strong>GPT-4o</strong> com instruções restritas ao escopo
                        da APS. Está treinado para responder sobre protocolos clínicos, CIAP-2, Pré-natal, Puericultura,
                        curativos, crônicos e gestão da UBS. Fora desse escopo, a IA recusa resposta automaticamente,
                        garantindo segurança e responsabilidade técnica ao profissional.
                    </p>
                </section>

                {/* LGPD */}
                <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-black/5">
                    <div className="flex items-center gap-3 mb-4 text-purple-600">
                        <div className="bg-purple-100 p-2 rounded-xl"><ShieldCheck size={24} /></div>
                        <h3 className="font-bold text-lg text-black dark:text-white">LGPD — Lei Geral de Proteção de Dados</h3>
                    </div>
                    <p className="text-muted leading-relaxed text-sm mb-4">
                        O Guia APS está em <strong>conformidade integral com a Lei 13.709/2018 (LGPD)</strong>. A plataforma foi
                        arquitetada com isolamento de dados por usuário (Row-Level Security no Supabase), autenticação
                        segura e criptografia em trânsito e em repouso.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                        {[
                            ['Dados de saúde tratados com base em legítimo interesse profissional (Art. 11, II, f)', ''],
                            ['Nenhum dado é vendido, monetizado ou compartilhado com terceiros', ''],
                            ['Cada enfermeiro acessa exclusivamente seus próprios registros (RLS)', ''],
                            ['Dados armazenados em infraestrutura certificada (Supabase / AWS)', ''],
                            ['Direito de exclusão garantido ao usuário a qualquer momento', ''],
                            ['Conformidade com o sigilo ético-profissional (COFEN Res. 564/2017)', ''],
                        ].map(([text], i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3">
                                <Lock size={12} className="mt-0.5 text-purple-500 shrink-0" />
                                <span>{text}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Propósito de Criação — Dedicatória discreta */}
                <section className="mt-2 mb-12 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-5 text-gray-500">
                        <FileText size={16} />
                        <span className="text-xs uppercase tracking-widest font-semibold text-gray-400">Propósito de Criação</span>
                    </div>

                    <blockquote className="text-gray-700 dark:text-gray-300 italic text-sm md:text-base leading-relaxed border-l-4 border-blue-200 dark:border-blue-800 pl-5">
                        Assisti, por muitos anos, minha esposa Valéria chegar em casa exausta — não pelo peso do cansaço,
                        mas pelo peso da responsabilidade. Ela carrega na rotina diária a vida de gestantes, crianças,
                        idosos e famílias inteiras que dependem do seu cuidado. Vi de perto a sua dedicação silenciosa,
                        os protocolos decorados de tanto reler, as orientações cuidadosas, o olhar que enxerga além do
                        sintoma e alcança o ser humano.

                        <br /><br />

                        Esse sistema nasceu do amor que tenho por ela e do respeito que tenho pelo que ela representa.
                        O Guia APS foi construído para que Valéria — e cada enfermeira como ela — possa dedicar ao
                        paciente o que é mais valioso: <strong>tempo, atenção e excelência clínica</strong>. Para que a
                        burocracia seja menor, o acerto seja maior, e o cuidado chegue mais longe.

                        <br /><br />

                        Quando vimos os indicadores da unidade melhorarem, decidimos não guardar isso só para nós.
                        Se uma ferramenta pode transformar uma UBS, ela pode transformar muitas. É por isso que o
                        Guia APS existe hoje como plataforma — para honrar a enfermagem brasileira que, dia após dia,
                        sustenta o SUS com competência e com o coração.
                    </blockquote>

                    <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Robson Sousa <span className="text-gray-400 mx-1">—</span> para Valéria Sousa, e para a enfermagem brasileira.
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Novo Gama, Goiás · 2025</p>
                    </div>
                </section>

            </div>
        </div>
    );
}
