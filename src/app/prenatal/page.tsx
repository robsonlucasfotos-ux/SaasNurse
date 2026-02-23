'use client';

import { useState } from 'react';
import { HeartPulse, CheckCircle, AlertTriangle } from 'lucide-react';

const trimesters = [
    {
        id: 1,
        title: '1º Trimestre (Até 13 semanas)',
        symptoms: [
            { name: 'Náuseas e Vômitos', conduct: 'Orientar fracionamento da dieta. Se necessário, prescrever Metoclopramida (se protocolo local permitir). CIAP-2: W05' },
            { name: 'Dor Lombar', conduct: 'Orientar postura, calor local. CIAP-2: W71/L03' },
        ],
        prescriptions: [
            { med: 'Ácido Fólico 5mg', posology: '1 comp. via oral, 1x ao dia.', pcdt: true },
            { med: 'Sulfato Ferroso 40mg Fe++', posology: 'Profilaxia: 1 comp/dia. Anemia: 1 a 2 comp, 2 a 3x/dia.', pcdt: true },
        ]
    },
    {
        id: 2,
        title: '2º Trimestre (14 a 27 semanas)',
        symptoms: [
            { name: 'Pirose (Azia)', conduct: 'Medidas dietéticas. Evitar deitar após refeições. CIAP-2: W05/D03' },
            { name: 'Infecção do Trato Urinário (ITU)', conduct: 'Solicitar Urina I e Urocultura. Iniciar esquema empírico conf. PCDT (ex: Cefalexina). CIAP-2: U71' },
        ],
        prescriptions: [
            { med: 'Sulfato Ferroso 40mg Fe++', posology: 'Manter profilaxia 1 comp/dia se Hb > 11.', pcdt: true },
        ]
    },
    {
        id: 3,
        title: '3º Trimestre (28 a 41 semanas)',
        symptoms: [
            { name: 'Edema de MMII', conduct: 'Aferir PA. Se PA normal, orientar repouso em DLE. Se PA > 140/90, suspeita de DHEG. CIAP-2: W81' },
            { name: 'Sinais de Trabalho de Parto', conduct: 'Avaliar contrações, perda de líquido, sangramentos. Encaminhar para maternidade se ativo. CIAP-2: W92' },
        ],
        prescriptions: [
            { med: 'Sulfato Ferroso 40mg Fe++', posology: 'Manter profilaxia. Suspender Ácido Fólico (se ainda não suspenso).', pcdt: true },
        ]
    }
];

export default function PrenatalPage() {
    const [activeTab, setActiveTab] = useState(1);

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2>Pré-natal (Gestantes)</h2>
                    <p className="text-muted">Acompanhamento, queixas e prescrições por trimestre.</p>
                </div>
                <div className="flex gap-2">
                    {trimesters.map(t => (
                        <button
                            key={t.id}
                            className={`btn ${activeTab === t.id ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setActiveTab(t.id)}
                        >
                            {t.title}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card w-full flex-1">
                {trimesters.filter(t => t.id === activeTab).map(t => (
                    <div key={t.id} className="animate-fade-in">
                        <h3 className="flex items-center gap-2 mb-6">
                            <HeartPulse color="var(--primary)" />
                            Condutas - {t.title}
                        </h3>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <h4 className="flex items-center gap-2 mb-4 text-warning">
                                    <AlertTriangle size={18} /> Queixas Comuns e Manejo
                                </h4>
                                <div className="flex flex-col gap-4">
                                    {t.symptoms.map((s, idx) => (
                                        <div key={idx} className="p-4 border rounded" style={{ borderColor: 'var(--border)' }}>
                                            <strong>{s.name}</strong>
                                            <p className="text-muted mt-2" style={{ fontSize: '0.9rem' }}>{s.conduct}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="flex items-center gap-2 mb-4" style={{ color: 'var(--secondary)' }}>
                                    <CheckCircle size={18} /> Prescrições de Rotina (RENAME)
                                </h4>
                                <div className="flex flex-col gap-4">
                                    {t.prescriptions.map((p, idx) => (
                                        <div key={idx} className="p-4 border rounded" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
                                            <strong>{p.med}</strong>
                                            <p className="text-muted mt-2" style={{ fontSize: '0.9rem' }}>{p.posology}</p>
                                            {p.pcdt && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mt-2 inline-block">Conforme Caderno AB N° 32</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                            <h4>Alertas CIAP-2 Relacionados</h4>
                            <p className="text-muted mt-2 mb-4 text-sm">
                                Utilize estes códigos no e-SUS PEC: <strong>W78 (Gravidez)</strong>, <strong>W71 (Infecções)</strong>, <strong>W81 (Toxemia/DHEG)</strong>.
                            </p>
                            <button className="btn btn-secondary w-full" onClick={() => window.location.href = '/prescription'}>
                                Gerar Receita / Exames para esta Paciente
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
