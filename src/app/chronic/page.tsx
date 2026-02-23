'use client';

import { Stethoscope } from 'lucide-react';

export default function ChronicPage() {
    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h2>Hipertensão e Diabetes (Crônicos)</h2>
                <p className="text-muted">Acompanhamento, renovação de receitas e monitoramento de metas.</p>
            </div>

            <div className="card w-full flex-1">
                <h3 className="flex items-center gap-2 mb-6 text-primary">
                    <Stethoscope /> Metas Terapêuticas (MS 2024)
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded" style={{ borderColor: 'var(--border)' }}>
                        <strong>Hipertensão Arterial (HAS)</strong>
                        <ul className="mt-2 text-sm text-muted ml-4">
                            <li>Meta: PA &lt; 140/90 mmHg (geral)</li>
                            <li>Meta: PA &lt; 130/80 mmHg (alto risco CV)</li>
                            <li>CIAP-2: K86 (Hipertensão sem complicação) / K87 (Com complicação)</li>
                        </ul>
                    </div>
                    <div className="p-4 border rounded" style={{ borderColor: 'var(--border)' }}>
                        <strong>Diabetes Mellitus (DM)</strong>
                        <ul className="mt-2 text-sm text-muted ml-4">
                            <li>Meta HbA1c &lt; 7% (maioria dos adultos não gestantes)</li>
                            <li>Glicemia jejum 80-130 mg/dL</li>
                            <li>CIAP-2: T90 (DM Tipo 2) / T89 (DM Tipo 1)</li>
                        </ul>
                    </div>
                </div>

                <h3 className="flex items-center gap-2 mt-8 mb-4">
                    Renovação de Receituário
                </h3>
                <p className="text-muted mb-6 text-sm">
                    A renovação de receitas uso contínuo por enfermeiros é permitida em HAS/DM estabilizados, inscritos em programas, e se previsto em protocolo municipal, por até 6 meses.
                </p>


            </div>
        </div>
    );
}
