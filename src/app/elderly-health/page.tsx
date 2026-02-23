'use client';

import { ShieldAlert } from 'lucide-react';

export default function ElderlyHealthPage() {
    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h2>Saúde do Idoso</h2>
                <p className="text-muted">Avaliação multidimensional, rastreio de fragilidade e polifarmácia.</p>
            </div>

            <div className="card w-full flex-1">
                <h3 className="flex items-center gap-2 mb-6" style={{ color: 'var(--primary)' }}>
                    <ShieldAlert /> Avaliação Geriátrica Ampla (AGA)
                </h3>

                <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 border rounded" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hover)' }}>
                        <strong>1. Avaliação de Quedas</strong>
                        <p className="mt-2 text-sm text-muted">Investigar ocorrência de quedas no último ano. CIAP-2: A08 (Queda)</p>
                    </div>
                    <div className="p-4 border rounded" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hover)' }}>
                        <strong>2. Polifarmácia</strong>
                        <p className="mt-2 text-sm text-muted">Uso de 5 ou mais medicamentos. Revisar lista de RENAME e interações. CIAP-2: A23 (Risco)</p>
                    </div>
                    <div className="p-4 border rounded" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hover)' }}>
                        <strong>3. Rastreio Cognitivo</strong>
                        <p className="mt-2 text-sm text-muted">Aplicar Mini-Mental (MEEM). Se alterado, encaminhar avaliação médica. CIAP-2: P20 (Memória)</p>
                    </div>
                    <div className="p-4 border rounded" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hover)' }}>
                        <strong>4. Vacinação</strong>
                        <p className="mt-2 text-sm text-muted">Influenza anual, Dupla Adulto (dT) e Pneumocócica (se institucionalizado). CIAP-2: A44</p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                    <button className="btn btn-secondary w-full" onClick={() => window.location.href = '/prescription'}>
                        Gerar Encaminhamento / Renovar Receitas
                    </button>
                </div>
            </div>
        </div>
    );
}
