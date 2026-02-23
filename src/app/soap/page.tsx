'use client';

import { useState } from 'react';
import { Copy, FileText, Check } from 'lucide-react';

export default function SoapGeneratorPage() {
    const [s, setS] = useState('');
    const [o, setO] = useState('');
    const [a, setA] = useState('');
    const [p, setP] = useState('');
    const [copied, setCopied] = useState(false);

    const generatedSoap = `S (Subjetivo):
${s || 'Nenhum dado informado.'}

O (Objetivo):
${o || 'Nenhum dado informado.'}

A (Avaliação):
${a || 'Nenhum dado informado.'}

P (Plano):
${p || 'Nenhum dado informado.'}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedSoap);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h2>Gerador de SOAP</h2>
                <p className="text-muted">Estruture a evolução clínica para o e-SUS PEC ou prontuário eletrônico.</p>
            </div>

            <div className="grid grid-cols-2 gap-6 h-full flex-1">
                <div className="flex flex-col gap-4 overflow-y-auto">
                    <div className="form-group">
                        <label className="form-label font-bold text-primary">S - Subjetivo (Motivo da consulta, queixas, histórico)</label>
                        <textarea
                            className="form-control"
                            rows={4}
                            value={s}
                            onChange={(e) => setS(e.target.value)}
                            placeholder="Ex: Refere dor ao urinar há 3 dias. Nega febre."
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label font-bold text-primary">O - Objetivo (Exame físico, dados vitais, exames laboratoriais)</label>
                        <textarea
                            className="form-control"
                            rows={4}
                            value={o}
                            onChange={(e) => setO(e.target.value)}
                            placeholder="Ex: PA 120/80, FC 80, T 36.8. Dor à palpação em hipogástrio."
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label font-bold text-primary">A - Avaliação (Impressão diagnóstica, CIAP-2)</label>
                        <textarea
                            className="form-control"
                            rows={3}
                            value={a}
                            onChange={(e) => setA(e.target.value)}
                            placeholder="Ex: ITU não complicada (U71). Gestação de 15 sem (W78)."
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label font-bold text-primary">P - Plano (Conduta médica/enfermagem, prescrições, encaminhamentos)</label>
                        <textarea
                            className="form-control"
                            rows={4}
                            value={p}
                            onChange={(e) => setP(e.target.value)}
                            placeholder="Ex: Prescrito Cefalexina conf. PCDT. Solicito Urocultura. Agendado retorno em 7 dias."
                        />
                    </div>
                </div>

                <div className="card flex flex-col h-full sticky top-24">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
                        <h3 className="flex items-center gap-2 m-0 text-lg">
                            <FileText size={20} />
                            Resultado Final (Preview)
                        </h3>
                        <button
                            className={`btn ${copied ? 'btn-secondary' : 'btn-outline'}`}
                            onClick={copyToClipboard}
                            style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? 'Copiado!' : 'Copiar SOAP'}
                        </button>
                    </div>
                    <pre
                        className="flex-1 bg-gray-50 p-4 rounded text-sm text-gray-800 overflow-y-auto whitespace-pre-wrap font-sans"
                        style={{ backgroundColor: 'var(--surface-hover)', border: '1px solid var(--border)' }}
                    >
                        {generatedSoap}
                    </pre>
                </div>
            </div>
        </div>
    );
}
