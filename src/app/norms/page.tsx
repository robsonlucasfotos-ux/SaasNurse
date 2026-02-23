'use client';

import { BookOpen, FileText, Scale } from 'lucide-react';

export default function NormsPage() {
    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h2>Biblioteca de Normas (Cofen/MS)</h2>
                <p className="text-muted" style={{ fontSize: '1.1rem' }}>Recursos legais atualizados que garantem o respaldo técnico do enfermeiro na APS.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                <div className="card">
                    <h3 className="flex items-center gap-2 mb-6" style={{ color: 'var(--secondary)' }}>
                        <Scale size={20} /> Resoluções COFEN
                    </h3>

                    <ul className="space-y-4">
                        <li className="p-4 border rounded hover:bg-opacity-50 transition-colors cursor-pointer" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hover)' }}>
                            <div className="flex justify-between items-center">
                                <strong>Lei nº 7.498/1986</strong>
                            </div>
                            <p className="text-sm mt-2 text-muted">Lei do Exercício Profissional. Garante a consulta de enfermagem e a prescrição de medicamentos previamente estabelecidos em programas de saúde pública e rotina aprovada pela instituição de saúde.</p>
                        </li>
                        <li className="p-4 border rounded hover:bg-opacity-50 transition-colors cursor-pointer" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hover)' }}>
                            <div className="flex justify-between items-center">
                                <strong>Resolução COFEN nº 736/2024</strong>
                            </div>
                            <p className="text-sm mt-2 text-muted">Dispõe sobre a implementação do Processo de Enfermagem (PE) que estrutura o raciocínio clínico e documentação do cuidado.</p>
                        </li>
                        <li className="p-4 border rounded hover:bg-opacity-50 transition-colors cursor-pointer" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hover)' }}>
                            <div className="flex justify-between items-center">
                                <strong>Resolução COFEN nº 686/2021</strong>
                            </div>
                            <p className="text-sm mt-2 text-muted">Normatiza a atuação do Enfermeiro em Saúde da Família (Saúde da Mulher, Obstetrícia, ISTs, etc), referendando protocolos de enfermagem na APS.</p>
                        </li>
                        <li className="p-4 border rounded hover:bg-opacity-50 transition-colors cursor-pointer" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hover)' }}>
                            <div className="flex justify-between items-center">
                                <strong>Resolução COFEN nº 311/2007 (Código de Ética)</strong>
                            </div>
                            <p className="text-sm mt-2 text-muted">Garante ao profissional o direito de registrar no prontuário do cliente as informações inerentes e indispensáveis ao processo de cuidar.</p>
                        </li>
                        <li className="p-4 border rounded hover:bg-opacity-50 transition-colors cursor-pointer" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hover)' }}>
                            <div className="flex justify-between items-center">
                                <strong>Resolução COFEN nº 358/2009</strong>
                            </div>
                            <p className="text-sm mt-2 text-muted">Dispõe sobre a Sistematização da Assistência de Enfermagem (SAE) e a implementação do Processo de Enfermagem.</p>
                        </li>
                    </ul>
                </div>

                <div className="card">
                    <h3 className="flex items-center gap-2 mb-6 text-primary">
                        <FileText size={20} /> Ministério da Saúde (MS)
                    </h3>

                    <ul className="space-y-4">
                        <li className="p-4 border rounded hover:bg-opacity-50 transition-colors cursor-pointer" style={{ borderColor: 'var(--border)' }}>
                            <div className="flex justify-between items-center">
                                <strong className="text-primary">Portaria MS nº 2.436/2017 (PNAB)</strong>
                            </div>
                            <p className="text-sm mt-2 text-muted">Aprova a Política Nacional de Atenção Básica, assegurando a autonomia do enfermeiro para consultas, requisição de exames e prescrição de medicamentos.</p>
                        </li>
                        <li className="p-4 border rounded hover:bg-opacity-50 transition-colors cursor-pointer" style={{ borderColor: 'var(--border)' }}>
                            <div className="flex justify-between items-center">
                                <strong className="text-primary">Diretrizes RENAME / CBAF</strong>
                            </div>
                            <p className="text-sm mt-2 text-muted">Regulamenta o acervo de fármacos disponíveis, incluindo o Componente Básico da Assistência Farmacêutica (CBAF) e assegurando o padrão de prescrições pelo enfermeiro de compostos sintomáticos e antimicrobianos preconizados.</p>
                        </li>
                        <li className="p-4 border rounded hover:bg-opacity-50 transition-colors cursor-pointer" style={{ borderColor: 'var(--border)' }}>
                            <div className="flex justify-between items-center">
                                <strong className="text-primary">Diretrizes de Tabulação - CIAP-2</strong>
                            </div>
                            <p className="text-sm mt-2 text-muted">Adoção compulsória da Classificação Internacional da Atenção Primária para registro em Prontuário Eletrônico do paciente estruturado no Método SOAP.</p>
                        </li>
                        <li className="p-4 border rounded hover:bg-opacity-50 transition-colors cursor-pointer" style={{ borderColor: 'var(--border)' }}>
                            <div className="flex justify-between items-center">
                                <strong className="text-primary">PCDT: ISTs (Atenção Integral)</strong>
                            </div>
                            <p className="text-sm mt-2 text-muted">Protocolo Clínico e Diretrizes Terapêuticas autorizando o tratamento precoce e convocação de parcerias para agravos como Sífilis, Cancroide e outras ISTs.</p>
                        </li>
                        <li className="p-4 border rounded hover:bg-opacity-50 transition-colors cursor-pointer" style={{ borderColor: 'var(--border)' }}>
                            <div className="flex justify-between items-center">
                                <strong className="text-primary">Portaria GM/MS nº 5.201/2024</strong>
                            </div>
                            <p className="text-sm mt-2 text-muted">Modernização do arranjo das doenças e agravos sujeitos à notificação compulsória no SINAN (incluindo DART, Violência, EAPV e agravos sazonais).</p>
                        </li>
                    </ul>

                    <div className="mt-8 p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded text-sm text-yellow-800 dark:text-yellow-200">
                        <strong className="flex items-center gap-1 mb-1"><BookOpen size={16} /> Importante:</strong>
                        Lembre-se sempre de consultar o <strong>Protocolo Municipal</strong> da sua cidade. Embora o Cofen e o MS garantam a autonomia geral, a prescrição local é limitada aos fármacos pré-aprovados nas portarias de protocolo da Secretaria Municipal de Saúde gestora.
                    </div>
                </div>
            </div>
        </div>
    );
}
