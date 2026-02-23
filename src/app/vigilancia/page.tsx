'use client';

import { AlertTriangle, ExternalLink, FileText, Clock } from 'lucide-react';
import { ciap2Database } from '@/data/ciap2';

export default function VigilanciaPage() {
    const notificacoes = ciap2Database.filter(c => c.isNotificacaoCompulsoria);

    return (
        <div className="flex flex-col h-full gap-6">
            <div>
                <h2>Vigilância Epidemiológica</h2>
                <p className="text-muted">Monitoramento de agravos e Notificações Compulsórias (Portaria 5201/2024).</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="card border-l-4 border-red-500">
                    <h3 className="flex items-center gap-2 mb-4 text-red-600">
                        <AlertTriangle size={20} /> Atenção aos Prazos de Notificação
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded bg-red-50 border border-red-100">
                            <h4 className="flex items-center gap-2 text-red-800 mb-1">
                                <Clock size={16} /> Notificação Imediata (24h)
                            </h4>
                            <p className="text-xs text-red-700">Dengue com óbito, Zika em gestante, Violência Sexual, Acidente Biológico Grave.</p>
                        </div>
                        <div className="p-4 rounded bg-orange-50 border border-orange-100">
                            <h4 className="flex items-center gap-2 text-orange-800 mb-1">
                                <Clock size={16} /> Notificação Semanal
                            </h4>
                            <p className="text-xs text-orange-700">Dengue clássica, Acidentes de trabalho leves, Doenças exantemáticas em geral.</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3>Lista de Agravos Monitorados</h3>
                    <div className="mt-4 overflow-hidden border rounded">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-surface text-muted">
                                <tr>
                                    <th className="p-3">CIAP-2</th>
                                    <th className="p-3">Agravo / Doença</th>
                                    <th className="p-3">Prazo</th>
                                    <th className="p-3 text-right">Ficha SINAN</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {notificacoes.map((n, idx) => (
                                    <tr key={idx} className="hover:bg-surface-hover">
                                        <td className="p-3 font-mono font-bold">{n.code}</td>
                                        <td className="p-3">{n.name}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${n.prazoNotificacao === 'IMEDIATA' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {n.prazoNotificacao}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right">
                                            {n.linkFichaSinan ? (
                                                <a
                                                    href={n.linkFichaSinan}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1 text-primary hover:underline"
                                                >
                                                    <FileText size={14} /> Abrir <ExternalLink size={12} />
                                                </a>
                                            ) : (
                                                <span className="text-muted italic text-xs">Ficha no e-SUS</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="mt-auto p-4 bg-muted rounded flex items-start gap-3">
                <AlertTriangle className="text-warning shrink-0" size={20} />
                <div className="text-xs">
                    <p className="font-bold">Nota Técnica:</p>
                    <p>O registro no e-SUS PEC não substitui, em casos específicos de surtos ou agravos imediatos, a comunicação às autoridades sanitárias locais por telefone ou e-mail institucional.</p>
                </div>
            </div>
        </div>
    );
}
