'use client';

import { useState } from 'react';
import { Save, FileText, BookOpen, PenTool } from 'lucide-react';

export default function SoapEvolution() {
    const [soap, setSoap] = useState({
        subjetivo: '',
        objetivo: '',
        avaliacao: '',
        plano: ''
    });

    const handleSave = () => {
        alert('Evolução SOAP salva com sucesso (Simulação local)!');
    };

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2>Evolução Clínica (Metodologia SOAP)</h2>
                    <p className="text-muted">Registro estruturado conforme Cadernos de Atenção Básica.</p>
                </div>
                <button className="btn btn-primary flex items-center gap-2" onClick={handleSave}>
                    <Save size={18} /> Salvar Evolução
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                <div className="flex flex-col gap-6">
                    <div className="flex-1 flex flex-col">
                        <label className="flex items-center gap-2 mb-2 font-bold text-sm">
                            <PenTool size={16} className="text-primary" /> SUBJETIVO (Queixas, História, Sentimentos)
                        </label>
                        <textarea
                            className="flex-1 p-3 border rounded resize-none focus:ring-2 ring-primary border-primary outline-none text-sm"
                            placeholder="Descreva o que o paciente relata..."
                            value={soap.subjetivo}
                            onChange={(e) => setSoap({ ...soap, subjetivo: e.target.value })}
                        />
                    </div>
                    <div className="flex-1 flex flex-col">
                        <label className="flex items-center gap-2 mb-2 font-bold text-sm">
                            <BookOpen size={16} className="text-primary" /> OBJETIVO (Exame Físico, Sinais Vitais, Exames)
                        </label>
                        <textarea
                            className="flex-1 p-3 border rounded resize-none focus:ring-2 ring-primary border-primary outline-none text-sm"
                            placeholder="Descreva os achados do exame físico..."
                            value={soap.objetivo}
                            onChange={(e) => setSoap({ ...soap, objetivo: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex-1 flex flex-col">
                        <label className="flex items-center gap-2 mb-2 font-bold text-sm">
                            <FileText size={16} className="text-primary" /> AVALIAÇÃO (Hipótese Diagnóstica / CIAP-2)
                        </label>
                        <textarea
                            className="flex-1 p-3 border rounded resize-none focus:ring-2 ring-primary border-primary outline-none text-sm"
                            placeholder="Impressão diagnóstica e codificação CIAP-2..."
                            value={soap.avaliacao}
                            onChange={(e) => setSoap({ ...soap, avaliacao: e.target.value })}
                        />
                    </div>
                    <div className="flex-1 flex flex-col">
                        <label className="flex items-center gap-2 mb-2 font-bold text-sm">
                            <Save size={16} className="text-primary" /> PLANO (Condutas, Medicamentos, Encaminhamentos)
                        </label>
                        <textarea
                            className="flex-1 p-3 border rounded resize-none focus:ring-2 ring-primary border-primary outline-none text-sm"
                            placeholder="Descreva o plano terapêutico e orientações..."
                            value={soap.plano}
                            onChange={(e) => setSoap({ ...soap, plano: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Respaldo Jurídico Rodapé Automático */}
            <div className="mt-4 p-3 bg-surface rounded-lg border text-[10px] text-muted text-center italic">
                Documento gerado eletronicamente em conformidade com a Lei 7.498/86 e Decreto 94.406/87.
                Responsabilidade técnica do Enfermeiro identificado no COREN-UF correspondente.
            </div>
        </div>
    );
}
