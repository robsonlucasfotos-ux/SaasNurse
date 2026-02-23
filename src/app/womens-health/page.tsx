'use client';

import { Activity } from 'lucide-react';

export default function WomensHealthPage() {
    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h2>Saúde da Mulher</h2>
                <p className="text-muted">Protocolos de ISTs, Planejamento Familiar e Climatério.</p>
            </div>

            <div className="card w-full flex-1">
                <h3 className="flex items-center gap-2 mb-6 text-primary">
                    <Activity /> Planejamento Familiar
                </h3>
                <p className="text-muted mb-4">
                    Orientações sobre métodos contraceptivos disponíveis na APS.
                </p>
                <ul className="mb-6 ml-4 text-muted">
                    <li><strong>Anticoncepcional Oral Comb. (Microvlar):</strong> 1 comp/dia. CIAP-2: W11</li>
                    <li><strong>Anticoncepcional Injetável (Mesigyna/Noregyna):</strong> Mensal. CIAP-2: W11</li>
                    <li><strong>DIU de Cobre:</strong> Inserção por enfermeiro capacitado. CIAP-2: W12</li>
                </ul>

                <h3 className="flex items-center gap-2 mb-6 mt-8" style={{ color: 'var(--danger)' }}>
                    <Activity /> Rastreio e Tratamento de ISTs (PCDT)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded" style={{ borderColor: 'var(--border)' }}>
                        <strong>Sífilis (VDRL Reagente)</strong>
                        <p className="mt-2 text-sm text-muted">Penicilina G Benzatina 2.400.000 UI IM (1.2 bi em cada glúteo). Repetir conforme fase (1, 2 ou 3 doses). CIAP-2: X70</p>
                    </div>
                    <div className="p-4 border rounded" style={{ borderColor: 'var(--border)' }}>
                        <strong>Tricomoníase / Vaginose</strong>
                        <p className="mt-2 text-sm text-muted">Metronidazol 500mg 12/12h por 7 dias. Ou creme vaginal. CIAP-2: X14</p>
                    </div>
                </div>


            </div>
        </div>
    );
}
