'use client';

import { useState } from 'react';
import { HeartPulse, CheckCircle, AlertTriangle } from 'lucide-react';

const trimesters = [
    {
        id: 1,
        title: '1º Trimestre (0 a 12 semanas)',
        symptoms: [
            { name: 'Captação Precoce', conduct: 'Gerar pedidos de "Teste da Mamãe" (Toxoplasmose, Chagas, Rubéola, CMV, HIV, Sífilis, Hep B/C). Citopatológico (sem escova endocervical) e Odonto. CIAP-2: W78/W84' },
            { name: 'Náuseas e Vômitos', conduct: 'Orientar fracionamento da dieta. Alertar sobre sonolência com antieméticos. CIAP-2: W05' },
        ],
        prescriptions: [
            { med: 'Ácido Fólico 5mg', posology: '1 comp/dia (preferida profilaxia de 400mcg, usar 5mg se indisponível) até fim do trimestre.', pcdt: true },
            { med: 'Sulfato Ferroso 40mg Fe++', posology: 'Profilaxia: 1 comp/dia (1h antes das refeições com suco cítrico). Evitar laticínios/antiácidos.', pcdt: true },
            { med: 'Meclizina 25mg', posology: '1 comp. de 8/8h (Máx 100mg/dia) se náuseas. Causa sonolência.', pcdt: false },
        ]
    },
    {
        id: 2,
        title: '2º Trimestre (13 a 27 semanas)',
        symptoms: [
            { name: 'Ultrassonografia', conduct: 'USG Morfológica (20-24 semanas) para biometria e avaliação de anomalias.' },
            { name: 'Vacinação (dTpa)', conduct: 'A partir de 20 sem. Imuniza o recém-nascido contra Coqueluche via IgG materna. CIAP-2: A44' },
            { name: 'Sintomas Urinários (ITU)', conduct: 'Urina I e Urocultura. Iniciar Cefalexina ou Nitrofurantoína empírica. Bacteriúria assintomática exige tratamento. CIAP-2: U71' },
            { name: 'Leucorreias / Vaginose', conduct: 'Vaginose (odor de peixe, pH > 4.5): Metronidazol. Candidíase (grumoso, prurido, pH < 4.5): Miconazol/Nistatina. CIAP-2: X14/X72' },
        ],
        prescriptions: [
            { med: 'Carbonato de Cálcio 500mg', posology: '1 a 2 comp/dia (ingerir em horário DIVERSO do Sulfato Ferroso para evitar competição de absorção).', pcdt: true },
            { med: 'Cefalexina 500mg', posology: '1 cap de 6/6h por 7 dias (Em caso de ITU confirmada/suspeita forte).', pcdt: true },
        ]
    },
    {
        id: 3,
        title: '3º Trimestre (28 a 41 semanas)',
        symptoms: [
            { name: 'Swab para Estreptococo B', conduct: 'Coleta vaginal/anal (35-37 sem). Se positivo, indica antibioticoprofilaxia na maternidade (prevenção de sepse neonatal).' },
            { name: 'Rastreio de DHEG', conduct: 'PA >= 140/90, edema e proteinúria = Risco de Pré-Eclâmpsia. Referenciar para Alto Risco. CIAP-2: W81' },
            { name: 'Diabetes Gestacional (DMG)', conduct: 'Avaliar TTOG 75g (24-28 sem). Falha na dieta requer encaminhamento para insulinoterapia. CIAP-2: W85' },
            { name: 'Sinais de Parto / Urgência', conduct: 'DPP (Sangramento escuro + dor + hipertonia): Decúbito lateral esquerdo, acesso calibroso, chamar SAMU. CIAP-2: W92' },
        ],
        prescriptions: [
            { med: 'Sulfato Ferroso 40mg Fe++', posology: 'Manter profilaxia até 3 meses pós-parto.', pcdt: true },
            { med: 'Carbonato de Cálcio 500mg', posology: 'Manter até o parto se alto risco hipertensivo.', pcdt: true },
        ]
    },
    {
        id: 4,
        title: 'Intercorrências e ISTs',
        symptoms: [
            { name: 'Sífilis (Adquirida/Gestacional)', conduct: 'Parceria DEVE ser tratada. Alérgicas à penicilina precisam de dessensibilização hospitalar.' },
            { name: 'Cancroide (Cancro Mole)', conduct: 'Tratar sintomáticos e contactantes. Orientar abstinência até remissão.' },
            { name: 'Herpes Genital', conduct: 'Quadros crônicos recorrentes exigem avaliação médica conjunta.' },
            { name: 'Vaginose Citolítica', conduct: 'Excesso de lactobacilos (pH muito ácido). NÃO usar antibióticos. Orientar ducha com bicarbonato.' },
        ],
        prescriptions: [
            { med: 'Penicilina G Benzatina', posology: 'Sífilis: 2,4 M UI (1,2 M em cada glúteo) dose única ou 7,2 M UI (3 semanas) se tardia.', pcdt: true },
            { med: 'Azitromicina 500mg', posology: 'Cancroide: 1g (2 comprimidos) VO em dose única.', pcdt: true },
            { med: 'Aciclovir 200mg/400mg', posology: 'Herpes (1º ep): 400mg 3x/dia ou 200mg 5x/dia por 7 dias.', pcdt: true },
            { med: 'Ducha de Bicarbonato', posology: '1 a 2 colheres de sopa em 4 xícaras de água morna, 2x semana (Apenas Vaginose Citolítica).', pcdt: false },
        ]
    }
];

export default function PrenatalPage() {
    const [activeTab, setActiveTab] = useState(1);

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2>Pré-natal (Gestantes)</h2>
                    <p className="text-muted">Acompanhamento, queixas e prescrições por trimestre.</p>
                </div>
                <div className="flex flex-wrap gap-2">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <h4>Alertas Clínicos & CIAP-2</h4>
                            <p className="text-muted mt-2 mb-4 text-sm">
                                Utilize os códigos CIAP-2 no Prontuário Eletrônico para amarrar o diagnóstico à conduta. Ex: <strong>W78/W84 (Gravidez)</strong>, <strong>W71/X14 (Infecções Vaginais)</strong>, <strong>W81 (Toxemia/DHEG)</strong> e <strong>W85 (DMG)</strong>.
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
