'use client';

import { useState, useEffect } from 'react';
import { HeartPulse, CheckCircle, AlertTriangle, Plus, Users, Calculator, Loader2, MessageCircle, Calendar, ExternalLink } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface PregnantWoman {
    id: string;
    name: string;
    age: number | null;
    birth_date: string | null;
    phone: string | null;
    risk_level: string;
    risk_reason: string | null;
    dum: string;
    created_at: string;
}

const trimestersData = [
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
    }
];

export default function PrenatalPage() {
    const supabase = createClient();
    const [activeTab, setActiveTab] = useState(1);
    const [patientFilterTab, setPatientFilterTab] = useState<'Todas' | 1 | 2 | 3>('Todas');

    // Gestantes state
    const [patients, setPatients] = useState<PregnantWoman[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [stats, setStats] = useState({ trim1: 0, trim2: 0, trim3: 0, total: 0 });

    // Add Patient Form State
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        birth_date: '',
        phone: '',
        risk_level: 'Habitual',
        risk_reason: '',
        dum: ''
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const calculateTrimester = (dumStr: string): 1 | 2 | 3 | null => {
        if (!dumStr) return null;
        const dumDate = new Date(dumStr);
        const diffTime = Math.abs(Date.now() - dumDate.getTime());
        const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));

        if (diffWeeks <= 12) return 1;
        if (diffWeeks >= 13 && diffWeeks <= 27) return 2;
        return 3;
    };

    const fetchPatients = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('pregnant_women')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) {
                setPatients(data);

                // Obter contagem calculando as idades gestacionais agora no front end (pode ser feito no backend também, mas front é okay para MVP)
                let c1 = 0, c2 = 0, c3 = 0;
                data.forEach(p => {
                    const tri = calculateTrimester(p.dum);
                    if (tri === 1) c1++;
                    if (tri === 2) c2++;
                    if (tri === 3) c3++;
                });

                setStats({ trim1: c1, trim2: c2, trim3: c3, total: data.length });
            }
        } catch (error) {
            console.error('Erro ao listar gestantes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) throw new Error("Usuário não logado");

            const { error } = await supabase.from('pregnant_women').insert([{
                user_id: userData.user.id,
                name: formData.name,
                age: formData.age ? parseInt(formData.age) : null,
                birth_date: formData.birth_date || null,
                phone: formData.phone || null,
                risk_level: formData.risk_level,
                risk_reason: formData.risk_level === 'Alto' ? formData.risk_reason : null,
                dum: formData.dum
            }]);

            if (error) throw error;

            setFormData({ name: '', age: '', birth_date: '', phone: '', risk_level: 'Habitual', risk_reason: '', dum: '' });
            setShowForm(false);
            fetchPatients();

        } catch (error) {
            console.error("Erro ao salvar gestante:", error);
            alert("Não foi possível salvar os dados da gestante.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleScheduleWhatsApp = async (patient: PregnantWoman) => {
        if (!patient.phone) {
            alert('Esta paciente não possui telefone cadastrado.');
            return;
        }

        const dateStr = prompt('Data para disparo da mensagem (DD/MM/AAAA):', new Date().toLocaleDateString('pt-BR'));
        if (!dateStr) return;

        // Converter DD/MM/AAAA para YYYY-MM-DD
        const parts = dateStr.split('/');
        if (parts.length !== 3) {
            alert('Formato de data inválido. Use DD/MM/AAAA.');
            return;
        }
        const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

        const defaultMessage = `Olá ${patient.name.split(' ')[0]}, aqui é do Posto de Saúde. Lembramos que você tem consulta ou exame agendado conosco.`;
        const customMessage = prompt('Digite a mensagem a ser enviada no WhatsApp:', defaultMessage);

        if (!customMessage) return;

        try {
            const res = await fetch('/api/whatsapp-reminder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientName: patient.name,
                    phone: patient.phone,
                    message: customMessage,
                    date: formattedDate
                })
            });
            const data = await res.json();
            if (data.success) {
                alert('Mensagem programada com sucesso na fila do WhatsApp!');
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            console.error(error);
            alert(`Falha ao programar WhatsApp: ${error.message}`);
        }
    };

    return (
        <div className="flex flex-col h-full gap-6 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <HeartPulse color="var(--primary)" />
                        Pré-natal
                    </h2>
                    <p className="text-muted text-sm mt-1">Visão Geral, Cadastros e Condutas</p>
                </div>
            </div>

            {/* Dashboard Inteligente */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card bg-pink-50 dark:bg-pink-900/10 border-pink-100 flex flex-col justify-between p-4">
                    <span className="text-pink-600 font-medium text-sm">1º Trimestre</span>
                    <span className="text-3xl font-bold text-pink-700">{isLoading ? '-' : stats.trim1}</span>
                    <span className="text-xs text-pink-500 mt-1">Até 12 semanas</span>
                </div>
                <div className="card bg-purple-50 dark:bg-purple-900/10 border-purple-100 flex flex-col justify-between p-4">
                    <span className="text-purple-600 font-medium text-sm">2º Trimestre</span>
                    <span className="text-3xl font-bold text-purple-700">{isLoading ? '-' : stats.trim2}</span>
                    <span className="text-xs text-purple-500 mt-1">13 a 27 semanas</span>
                </div>
                <div className="card bg-blue-50 dark:bg-blue-900/10 border-blue-100 flex flex-col justify-between p-4">
                    <span className="text-blue-600 font-medium text-sm">3º Trimestre</span>
                    <span className="text-3xl font-bold text-blue-700">{isLoading ? '-' : stats.trim3}</span>
                    <span className="text-xs text-blue-500 mt-1">A partir de 28 sem.</span>
                </div>
                <div className="card bg-green-50 dark:bg-green-900/10 border-green-100 flex flex-col justify-between p-4">
                    <span className="text-green-600 font-medium text-sm">Total Na Unidade</span>
                    <span className="text-3xl font-bold text-green-700">{isLoading ? '-' : stats.total}</span>
                    <span className="text-xs text-green-500 mt-1">Gestantes ativas</span>
                </div>
            </div>

            {/* Ações (Adicionar Gestante) */}
            <div className="flex justify-between items-center">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Plus size={18} /> {showForm ? 'Fechar Formulário' : 'Nova Gestante'}
                </button>
            </div>

            {showForm && (
                <div className="card animate-in fade-in slide-in-from-top-4 border-primary">
                    <h3 className="mb-4 text-emerald-700 font-semibold flex items-center gap-2">
                        <Users size={18} /> Triagem de Gestante
                    </h3>
                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-muted ml-1">Nome Completo *</label>
                            <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-muted ml-1">DUM (Data Última Menstruação) *</label>
                            <input type="date" className="form-control font-medium text-emerald-700" required value={formData.dum} onChange={e => setFormData({ ...formData, dum: e.target.value })} />
                            <span className="text-[10px] text-muted ml-1 flex items-center gap-1"><Calculator size={10} /> O trimestre será calculado automaticamente em tempo real</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-muted ml-1">Idade (Opcional)</label>
                            <input type="number" className="form-control" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-muted ml-1">Telefone (Opcional)</label>
                            <input type="tel" className="form-control" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-xs font-semibold text-muted ml-1">Classificação de Risco</label>
                            <select className="form-control" value={formData.risk_level} onChange={e => setFormData({ ...formData, risk_level: e.target.value })}>
                                <option value="Habitual">Risco Habitual (Baixo)</option>
                                <option value="Moderado">Risco Moderado</option>
                                <option value="Alto">Alto Risco</option>
                            </select>
                        </div>
                        {formData.risk_level === 'Alto' && (
                            <div className="flex flex-col gap-1 md:col-span-2">
                                <label className="text-xs font-semibold text-red-500 ml-1">Motivo do Alto Risco *</label>
                                <textarea className="form-control border-red-300" required placeholder="Ex: Hipertensão prévia, DMG, Placenta Prévia..." rows={2} value={formData.risk_reason || ''} onChange={e => setFormData({ ...formData, risk_reason: e.target.value })} />
                            </div>
                        )}
                        <div className="md:col-span-2 flex justify-end mt-2">
                            <button type="submit" disabled={isSaving} className="btn bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2">
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Salvar Prontuário'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Listagem de Pacientes Acompanhadas */}
            {!isLoading && patients.length > 0 && (
                <div className="card w-full mt-2 border-primary">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <h3 className="text-primary font-semibold flex items-center gap-2">
                            <Users size={18} /> Gestantes Acompanhadas ({patients.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {(['Todas', 1, 2, 3] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setPatientFilterTab(tab)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${patientFilterTab === tab ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                                >
                                    {tab === 'Todas' ? 'Todas' : `${tab}º Trimestre`}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="border-b dark:border-gray-700 text-sm font-semibold text-muted">
                                    <th className="p-3">Nome</th>
                                    <th className="p-3">Gestação (DUM)</th>
                                    <th className="p-3">Risco</th>
                                    <th className="p-3">Contato</th>
                                    <th className="p-3 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.filter(p => {
                                    if (patientFilterTab === 'Todas') return true;
                                    const tri = calculateTrimester(p.dum);
                                    return tri === patientFilterTab;
                                }).map(p => {
                                    const dumDate = p.dum ? new Date(p.dum) : null;
                                    const diffTime = dumDate ? Math.abs(Date.now() - dumDate.getTime()) : 0;
                                    const weeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
                                    const months = Math.floor(weeks / 4.34524);

                                    return (
                                        <tr key={p.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{p.name} {p.age ? `(${p.age}a)` : ''}</td>
                                            <td className="p-3 text-primary font-semibold">
                                                {weeks ? (
                                                    <div className="flex flex-col">
                                                        <span>{weeks} semanas</span>
                                                        <span className="text-xs text-muted font-normal">({months} {months === 1 ? 'mês' : 'meses'})</span>
                                                    </div>
                                                ) : 'N/A'}
                                            </td>
                                            <td className="p-3">
                                                <div className="flex flex-col items-start gap-1">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold w-fit ${p.risk_level === 'Alto' ? 'bg-red-100 text-red-700 border border-red-200' :
                                                        p.risk_level === 'Moderado' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                                                            'bg-green-100 text-green-700 border border-green-200'
                                                        }`}>
                                                        {p.risk_level}
                                                    </span>
                                                    {p.risk_level === 'Alto' && p.risk_reason && (
                                                        <span className="text-[10px] text-red-600 leading-tight max-w-[150px]" title={p.risk_reason}>
                                                            <strong className="opacity-80">Motivo:</strong> {p.risk_reason}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3 text-muted">{p.phone || '-'}</td>
                                            <td className="p-3 text-center flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleScheduleWhatsApp(p)}
                                                    className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                                    title={`Agendar Lembrete WhatsApp para ${p.name}`}
                                                >
                                                    <MessageCircle size={16} />
                                                </button>
                                                {p.phone && (
                                                    <a
                                                        href={`https://wa.me/55${p.phone.replace(/\D/g, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                                        title={`Abrir WhatsApp de ${p.name}`}
                                                    >
                                                        <ExternalLink size={16} />
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Biblioteca de Tratamentos */}
            <div className="mt-4 pt-4 border-t">
                <h3 className="mb-4">Protocolos por Trimestre</h3>

                <div className="flex flex-wrap gap-2 mb-4">
                    {trimestersData.map(t => (
                        <button
                            key={t.id}
                            className={`btn ${activeTab === t.id ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setActiveTab(t.id)}
                        >
                            {t.title}
                        </button>
                    ))}
                </div>

                <div className="card w-full">
                    {trimestersData.filter(t => t.id === activeTab).map(t => (
                        <div key={t.id} className="animate-in fade-in">
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
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
