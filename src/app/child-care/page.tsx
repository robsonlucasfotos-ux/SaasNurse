'use client';

import { useState } from 'react';
import { Baby, CheckCircle, AlertTriangle } from 'lucide-react';

const ageMarkers = [
    {
        id: '2m',
        title: '2 Meses',
        symptoms: [
            { name: 'Marcos do Desenvolvimento', conduct: 'Sorriso social voluntário? Sustenta a cabeça brevemente em prono? Fixa/segue objetos em 180 graus?' },
            { name: 'Fase do Leite & Prevenção', conduct: 'Aleitamento Materno Exclusivo (AME). Proibido chás/água. Prevenção Morte Súbita: Orientar decúbito dorsal (barriga para cima) no berço.' },
            { name: 'Antropometria', conduct: 'Aferir Peso, Estatura, Perímetro Cefálico e avaliar Z-score OMS.' },
        ],
        prescriptions: [
            { med: 'Vacinas (Calendário)', posology: 'Pentavalente (1ªD), VIP (1ªD), Pneumo 10V (1ªD), Rotavírus (1ªD).', pcdt: true },
        ]
    },
    {
        id: '4m',
        title: '4 Meses (Até 6m)',
        symptoms: [
            { name: 'Marcos do Desenvolvimento', conduct: 'Rola intencionalmente? Inicia postura sentada com apoio? Emite sons guturais / gargalhadas? Leva objetos à boca?' },
            { name: 'Orientações', conduct: 'Manutenção do AME. Orientar sobre segurança contra quedas (camas/sofás) e aspiração de objetos.' },
        ],
        prescriptions: [
            { med: 'Vacinas (Calendário)', posology: 'Pentavalente (2ªD), VIP (2ªD), Pneumo 10V (2ªD), Rotavírus (2ªD).', pcdt: true },
        ]
    },
    {
        id: '6m',
        title: '6 Meses',
        symptoms: [
            { name: 'Introdução Alimentar', conduct: 'Alimentos devem ser amassados com garfo (NUNCA liquefeitos). Oferta ativa de água potável. Manter AM.' },
            { name: 'Marcos do Desenvolvimento', conduct: 'Senta sem apoio? Transfere objetos de uma mão para a outra?' },
        ],
        prescriptions: [
            { med: 'Vacinas (Calendário)', posology: 'Pentavalente (3ªD), VIP (3ªD).' },
            { med: 'Sulfato Ferroso (Gotas)', posology: 'Profilaxia: 1mg/kg/dia para crianças em AME até o 24º mês.', pcdt: true },
            { med: 'Vitamina A (Megadose)', posology: '100.000 UI, Via Oral, Dose única.', pcdt: true },
        ]
    },
    {
        id: '9m',
        title: '9 Meses (Até 12m)',
        symptoms: [
            { name: 'Marcos do Desenvolvimento', conduct: 'Engatinha? Fica em pé agarrando móveis? Movimento de pinça (indicador e polegar)? Articula dissílabas (ma-ma, pa-pa)?' },
        ],
        prescriptions: [
            { med: 'Vacinas (Calendário)', posology: 'Febre Amarela (Dose Inicial - em áreas recomendadas).', pcdt: true },
        ]
    },
    {
        id: '12m',
        title: '12 a 24 Meses (1 a 2 Anos)',
        symptoms: [
            { name: 'Marcos e Autonomia', conduct: 'Anda com firmeza? Corre/sobe degraus? Frases de 2-3 palavras? Aponta partes do corpo?' },
            { name: 'Orientações Educativas', conduct: 'Escovação supervisionada: pasta com flúor (1000-1500ppm) qtd grão de arroz. Proibido telas/smartphones antes dos 24m.' },
        ],
        prescriptions: [
            { med: '12m: Vacinas', posology: 'Tríplice Viral (1ªD), Pneumo 10V (Reforço), Meningo C (Reforço).', pcdt: true },
            { med: '15m: Vacinas', posology: 'DTP (Reforço), VOP (Reforço oral), Hepatite A, Tetra Viral.', pcdt: true },
            { med: 'Vitamina A (Megadose)', posology: '200.000 UI, Via Oral (Reforço anual até 59m).', pcdt: true },
        ]
    }
];

export default function ChildCarePage() {
    const [activeTab, setActiveTab] = useState('2m');

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2>Puericultura (Acompanhamento CD)</h2>
                    <p className="text-muted">Avaliação do crescimento e desenvolvimento por marcos de idade.</p>
                </div>
                <div className="flex flex-wrap gap-2">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <h4>Mapeamento CIAP-2 Relacionado</h4>
                            <p className="text-muted mt-2 mb-4 text-sm">
                                Códigos pertinentes estruturados no PEC: <strong>-30 (Exame médico completo)</strong>, <strong>-45 (Educação em Saúde/Orientações)</strong>, <strong>-44 (Vacinação preventiva)</strong> e agravos como <strong>D70/D73 (Gastroenterite)</strong>.
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
