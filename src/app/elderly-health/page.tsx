'use client';

import { Activity, ClipboardList } from 'lucide-react';

export default function ElderlyHealthPage() {
    return (
        <div className="flex flex-col h-full gap-6">
            <div>
                <h2>Saúde do Idoso</h2>
                <p className="text-muted">Protocolo de Avaliação Multidimensional e Imunossenescência.</p>
            </div>

            <div className="card">
                <h3 className="flex items-center gap-2 mb-6" style={{ color: 'var(--primary)' }}>
                    <ClipboardList size={22} /> Avaliação Geriátrica Ampla (AGA)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 border rounded bg-surface">
                        <h4 className="flex items-center gap-2 mb-2"><Activity size={18} /> Equilíbrio e Marcha</h4>
                        <p className="text-sm text-muted">Aferir risco de quedas via Timed Up and Go (TUG). Revisar segurança doméstica. CIAP-2: A04</p>
                    </div>
                    <div className="p-4 border rounded bg-surface">
                        <h4 className="flex items-center gap-2 mb-2"><Activity size={18} /> Rastreio Cognitivo e Crônicos</h4>
                        <p className="text-sm text-muted">Aplicar Mini-Mental. Monitorar PA e Glicemia. CIAP-2: P70 (Demência), P20 (Memória) e T90 (DM2).</p>
                    </div>
                    <div className="p-4 border rounded bg-surface">
                        <h4 className="flex items-center gap-2 mb-2"><Activity size={18} /> Vacinação e Imunossenescência</h4>
                        <p className="text-sm text-muted">Verificar e aplicar: Influenza (anual), Pneumocócica 23, Hepatite B e dT (Dupla Adulto).</p>
                    </div>
                </div>
            </div>

            {/* Respaldo Jurídico Footer */}
            <div className="mt-auto border-t pt-4 text-center text-xs text-muted">
                <p>Baseado na Lei 7.498/86 e Decreto 94.406/87. Consulte sempre os Manuais do MS e Protocolos Municipais.</p>
            </div>
        </div>
    );
}
