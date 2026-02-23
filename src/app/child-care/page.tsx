'use client';

import { useState } from 'react';
import { Baby, CheckCircle, AlertTriangle } from 'lucide-react';

const ageMarkers = [
    {
        id: '15d',
        title: '15 dias a 1 mês',
        symptoms: [
            { name: 'Icterícia Fisiológica', conduct: 'Avaliar zonas de Kramer. Estimular AM em livre demanda. Banho de sol. CIAP-2: A93' },
            { name: 'Cólica do Lactente', conduct: 'Massagem (Shantala), compressa morna. Tranquilizar a mãe. CIAP-2: D01' },
        ],
        prescriptions: [
            { med: 'Vitamina D (Colecalciferol)', posology: '400 UI/dia a partir da 1ª semana de vida.', pcdt: true },
        ]
    },
    {
        id: '6m',
        title: '6 Meses',
        symptoms: [
            { name: 'Introdução Alimentar', conduct: 'Orientar papa principal, frutas. Não liquidificar, amassar. Manter AM. CIAP-2: T03' },
            { name: 'Assaduras (Dermatite de Fraldas)', conduct: 'Higiene com água e algodão, secar bem, uso de pomada de barreira (Óxido de Zinco). CIAP-2: S82' },
        ],
        prescriptions: [
            { med: 'Sulfato Ferroso (Gotas)', posology: 'Profilaxia: 1mg/kg/dia se fatores de risco. (Sempre avaliar termo/peso).', pcdt: true },
            { med: 'Vitamina A (Megadose)', posology: '100.000 UI, Via Oral, Dose única.', pcdt: true },
        ]
    },
    {
        id: '12m',
        title: '12 Meses (1 Ano)',
        symptoms: [
            { name: 'Infecção Respiratória Alta (Resfriado)', conduct: 'Lavagem nasal com SF 0,9%. Repouso. Hidratação. Sinal de alerta: taquipneia. CIAP-2: R74' },
            { name: 'Parasitoses (Prevenção)', conduct: 'Higiene das mãos, lavar alimentos, água tratada. CIAP-2: D96' },
        ],
        prescriptions: [
            { med: 'Vitamina A (Megadose)', posology: '200.000 UI, Via Oral, Dose única (reforço anual).', pcdt: true },
            { med: 'Albendazol 400mg/10ml', posology: 'Suspensão a partir de 1 ano para profilaxia local, se indicado e protocolo municipal vigente.', pcdt: true },
        ]
    }
];

export default function ChildCarePage() {
    const [activeTab, setActiveTab] = useState('15d');

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2>Puericultura (Acompanhamento CD)</h2>
                    <p className="text-muted">Avaliação do crescimento e desenvolvimento por marcos de idade.</p>
                </div>
                <div className="flex gap-2">
                    {ageMarkers.map(m => (
                        <button
                            key={m.id}
                            className={`btn ${activeTab === m.id ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setActiveTab(m.id)}
                        >
                            {m.title}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card w-full flex-1">
                {ageMarkers.filter(m => m.id === activeTab).map(m => (
                    <div key={m.id} className="animate-fade-in">
                        <h3 className="flex items-center gap-2 mb-6">
                            <Baby color="var(--primary)" />
                            Condutas - {m.title}
                        </h3>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <h4 className="flex items-center gap-2 mb-4 text-warning">
                                    <AlertTriangle size={18} /> Intercorrências & Orientações
                                </h4>
                                <div className="flex flex-col gap-4">
                                    {m.symptoms.map((s, idx) => (
                                        <div key={idx} className="p-4 border rounded" style={{ borderColor: 'var(--border)' }}>
                                            <strong>{s.name}</strong>
                                            <p className="text-muted mt-2" style={{ fontSize: '0.9rem' }}>{s.conduct}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="flex items-center gap-2 mb-4" style={{ color: 'var(--secondary)' }}>
                                    <CheckCircle size={18} /> Prescrições de Rotina (PCDT / RENAME)
                                </h4>
                                <div className="flex flex-col gap-4">
                                    {m.prescriptions.map((p, idx) => (
                                        <div key={idx} className="p-4 border rounded" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
                                            <strong>{p.med}</strong>
                                            <p className="text-muted mt-2" style={{ fontSize: '0.9rem' }}>{p.posology}</p>
                                            {p.pcdt && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mt-2 inline-block">Conforme Caderno de Atenção Básica</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                            <h4>Alertas CIAP-2 Relacionados</h4>
                            <p className="text-muted mt-2 mb-4 text-sm">
                                Utilize estes códigos no e-SUS PEC: <strong>A98 (Medicina Preventiva)</strong>, <strong>T07 (Ganho de peso)</strong>, <strong>D70 (Diarreia/Inf.)</strong>.
                            </p>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
