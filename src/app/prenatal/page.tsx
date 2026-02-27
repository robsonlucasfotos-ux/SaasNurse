'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { cofenMedications, authorizedExams } from '@/data/cofen-meds';
import { Search, Phone, AlertTriangle, Calculator, CheckCircle, HeartPulse, MessageCircle, Plus, Users, Loader2, Baby } from 'lucide-react';
import PrenatalClinicalPanel from '@/components/PrenatalClinicalPanel';

interface PregnantWoman {
    id: string;
    name: string;
    age: number | null;
    birth_date: string | null;
    phone: string | null;
    risk_level: string;
    risk_reason: string | null;
    dum: string;
    dpp?: string | null;
    clinical_data?: any; // JSONB data
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
    const [medQuery, setMedQuery] = useState('');
    const [patientFilterTab, setPatientFilterTab] = useState<'Todas' | 1 | 2 | 3 | 'Cofen'>('Todas');

    // Gestantes state
    const [patients, setPatients] = useState<PregnantWoman[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [stats, setStats] = useState({ trim1: 0, trim2: 0, trim3: 0, total: 0 });

    // Clinical Follow-up Modal State
    const [selectedPatient, setSelectedPatient] = useState<PregnantWoman | null>(null);
    const [clinicalData, setClinicalData] = useState<any>({});
    const [isSavingClinical, setIsSavingClinical] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [newCarePlan, setNewCarePlan] = useState('');

    // Add Patient Form State
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        birth_date: '',
        phone: '',
        cpf: '',
        address: '',
        acs_area: '',
        risk_level: 'Habitual',
        risk_reason: '',
        dum: '',
        dpp: ''
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
        return 3; // Cap at max 3
    };

    const fetchPatients = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('patients')
                .select('*')
                .eq('is_pregnant', true)
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

    const handleConcludePregnancy = async (patientId: string, outcome: string, currentClinicalData: any) => {
        setIsLoading(true);
        try {
            const updatedData = {
                ...(currentClinicalData || {}),
                pregnancy_outcome: outcome,
                pregnancy_end_date: new Date().toISOString()
            };

            const { error } = await supabase
                .from('patients')
                .update({
                    is_pregnant: false,
                    clinical_data: updatedData
                })
                .eq('id', patientId);

            if (error) throw error;

            alert(`Gestação encerrada com sucesso! Desfecho: ${outcome}`);
            fetchPatients();
        } catch (error) {
            console.error("Erro ao finalizar gestação:", error);
            alert("Não foi possível finalizar a gestação.");
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) throw new Error("Usuário não logado");

            const { error } = await supabase.from('patients').insert([{
                user_id: userData.user.id,
                name: formData.name,
                age: formData.age ? parseInt(formData.age) : null,
                gender: 'Feminino',
                birth_date: formData.birth_date || null,
                phone: formData.phone || null,
                clinical_data: {
                    cpf: formData.cpf || null,
                    address: formData.address || null,
                    acs_area: formData.acs_area || null,
                },
                risk_level: formData.risk_level,
                risk_reason: formData.risk_level === 'Alto' ? formData.risk_reason : null,
                is_pregnant: true,
                dum: formData.dum,
                dpp: formData.dpp || null
            }]);

            if (error) throw error;

            setFormData({ name: '', age: '', birth_date: '', phone: '', cpf: '', address: '', acs_area: '', risk_level: 'Habitual', risk_reason: '', dum: '', dpp: '' });
            setShowForm(false);
            fetchPatients();

        } catch (error) {
            console.error("Erro ao salvar gestante:", error);
            alert("Não foi possível salvar os dados da gestante.");
        } finally {
            setIsSaving(false);
        }
    };

    const openClinicalModal = (patient: PregnantWoman) => {
        setSelectedPatient(patient);
        setClinicalData(patient.clinical_data || {});
        setNewNote('');
        setNewCarePlan('');
    };

    const handleClinicalChange = (key: string, value: any) => {
        setClinicalData((prev: any) => ({ ...prev, [key]: value }));
    };

    const saveClinicalData = async () => {
        if (!selectedPatient) return;
        setIsSavingClinical(true);
        try {
            let updatedClinicalData = { ...clinicalData };

            if (newNote.trim() !== '' || newCarePlan.trim() !== '') {
                const followUps = updatedClinicalData.followUps || [];
                updatedClinicalData.followUps = [
                    {
                        date: new Date().toISOString(),
                        text: newNote,
                        carePlan: newCarePlan
                    },
                    ...followUps
                ];
            }

            const { error } = await supabase
                .from('patients')
                .update({ clinical_data: updatedClinicalData })
                .eq('id', selectedPatient.id);

            if (error) throw error;

            // Atualiza local + limpa campos (fica aberto — estilo Google Keep)
            setPatients(patients.map(p => p.id === selectedPatient.id ? { ...p, clinical_data: updatedClinicalData } : p));
            setClinicalData(updatedClinicalData);
            setNewNote('');
            setNewCarePlan('');
        } catch (error) {
            console.error("Erro ao salvar acompanhamento:", error);
            alert("Não foi possível salvar o acompanhamento.");
        } finally {
            setIsSavingClinical(false);
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
                            <span className="text-[10px] text-muted ml-1 flex items-center gap-1"><Calculator size={10} /> O trimestre será calculado automaticamente</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-muted ml-1">DPP (Data Provável do Parto)</label>
                            <input type="date" className="form-control font-medium text-emerald-700" value={formData.dpp} onChange={e => setFormData({ ...formData, dpp: e.target.value })} />
                            <span className="text-[10px] text-muted ml-1 flex items-center gap-1">Opcional, porém importante</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-muted ml-1">Idade (Opcional)</label>
                            <input type="number" className="form-control" value={formData.age} onChange={e => setFormData({ ...formData, age: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-muted ml-1">Telefone (Opcional)</label>
                            <input type="tel" className="form-control" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-muted ml-1">CPF (Opcional)</label>
                            <input type="text" className="form-control" value={formData.cpf} onChange={e => setFormData({ ...formData, cpf: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-muted ml-1">Endereço (Opcional)</label>
                            <input type="text" className="form-control" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-xs font-semibold text-muted ml-1">Microárea / ACS (Opcional)</label>
                            <input type="text" className="form-control" value={formData.acs_area} onChange={e => setFormData({ ...formData, acs_area: e.target.value })} />
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
                            {(['Todas', 1, 2, 3, 'Cofen'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setPatientFilterTab(tab)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${patientFilterTab === tab ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                                >
                                    {tab === 'Todas' ? 'Todas' : tab === 'Cofen' ? 'Prescrições Enfermeiro (801/26)' : `${tab}º Trimestre`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {patientFilterTab === 'Cofen' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                            <div className="relative mb-6">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar por medicação, sintoma ou necessidade (Ex: Sífilis, Amoxicilina, ITU...)"
                                    className="form-control pl-10 h-12 text-base shadow-sm focus:border-green-500"
                                    value={medQuery}
                                    onChange={(e) => setMedQuery(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {cofenMedications.filter(m =>
                                    m.name.toLowerCase().includes(medQuery.toLowerCase()) ||
                                    m.category.toLowerCase().includes(medQuery.toLowerCase()) ||
                                    m.indication.toLowerCase().includes(medQuery.toLowerCase())
                                ).map((m, idx) => (
                                    <div key={idx} className="p-4 border rounded-xl bg-green-50/30 dark:bg-green-900/10 border-green-100 dark:border-green-900/30 transition-all hover:shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-100 px-2 py-0.5 rounded">
                                                {m.category}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-gray-800 dark:text-gray-100">{m.name}</h4>
                                        <p className="text-sm text-green-700 dark:text-green-400 font-semibold mt-1">{m.dosage}</p>
                                        <p className="text-xs text-muted mt-2 leading-relaxed"><strong>Indicação:</strong> {m.indication}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t dark:border-gray-800">
                                <h4 className="font-bold text-primary flex items-center gap-2 mb-4">
                                    <CheckCircle size={18} /> Exames que o Enfermeiro pode solicitar (2026)
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {authorizedExams.map((ex, idx) => (
                                        <div key={idx} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800/40">
                                            <strong className="text-xs block mb-1 text-gray-500">{ex.type}</strong>
                                            <p className="text-sm">{ex.items}</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-6 text-[10px] text-muted italic p-3 border rounded bg-gray-50 dark:bg-gray-800/30">
                                    Fonte: Resolução Cofen nº 801/2026 e 802/2026. A prescrição deve estar fundamentada em protocolo local e Processo de Enfermagem.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
                                    <div key={p.id} className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex flex-col gap-3 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                        <div className={`absolute top-0 left-0 w-1 h-full ${p.risk_level === 'Alto' ? 'bg-red-500' : p.risk_level === 'Moderado' ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                                        <div className="flex justify-between items-start pl-2">
                                            <div className="flex-1 pr-2">
                                                <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg leading-tight">{p.name}</h4>
                                                <span className="text-sm text-muted">{p.age ? `${p.age} anos` : 'Idade não informada'}</span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${p.risk_level === 'Alto' ? 'bg-red-100 text-red-700' : p.risk_level === 'Moderado' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                                {p.risk_level}
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-1 pl-2">
                                            <div className="flex flex-col gap-0.5 mb-1">
                                                <div className="flex items-center gap-2">
                                                    <Calculator size={14} className="text-primary/70" />
                                                    <span className="text-primary font-semibold text-sm">
                                                        {weeks ? `${weeks} semanas (${months} meses)` : 'DUM não informada'}
                                                    </span>
                                                </div>
                                                {p.dpp && (
                                                    <div className="flex items-center gap-2 ml-5">
                                                        <span className="text-xs text-muted font-medium bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                                                            DPP: {new Date(p.dpp).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                                        </span>
                                                    </div>
                                                )}
                                                {p.dum && !p.dpp && (
                                                    <div className="flex items-center gap-2 ml-5">
                                                        <span className="text-xs text-muted font-medium bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                                                            DUM: {new Date(p.dum).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className="text-muted" />
                                                <span className="text-sm text-muted flex-1">
                                                    {p.phone || 'Sem telefone cadastrado'}
                                                </span>
                                                {p.phone ? (
                                                    <a
                                                        href={`https://wa.me/55${p.phone.replace(/\D/g, '')}?text=Olá ${encodeURIComponent(p.name.split(' ')[0])}, aqui é a enfermagem do Posto de Saúde. Tudo bem?`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center w-8 h-8 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-sm transition-colors flex-shrink-0"
                                                        title="Chamar no WhatsApp"
                                                    >
                                                        <MessageCircle size={15} />
                                                    </a>
                                                ) : null}
                                            </div>
                                        </div>

                                        {p.risk_level === 'Alto' && p.risk_reason && (
                                            <div className="bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 text-xs p-2 rounded-lg border border-red-100 dark:border-red-900/30 mt-1 ml-2">
                                                <strong className="opacity-80 block mb-0.5">Motivo Alto Risco:</strong>
                                                {p.risk_reason}
                                            </div>
                                        )}

                                        <div className="mt-auto pt-3 border-t dark:border-gray-800 flex gap-2 pl-2">
                                            <button
                                                onClick={() => openClinicalModal(p)}
                                                className="flex-1 btn flex items-center justify-center gap-2 text-sm py-2 border-none text-white shadow-sm transition-all bg-purple-600 hover:bg-purple-700 btn-primary"
                                            >
                                                <CheckCircle size={16} /> Acompanhar
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm(`Deseja registrar o parto ou encerramento da gestação para ${p.name}? A paciente não aparecerá mais nesta lista, mas continuará salva na "Saúde da Mulher".`)) {
                                                        const outcome = window.prompt("Digite o desfecho (ex: 'Parto Normal', 'Cesárea' ou 'Aborto'):", "Parto");
                                                        if (outcome) handleConcludePregnancy(p.id, outcome, p.clinical_data);
                                                    }
                                                }}
                                                className="p-2 border border-pink-200 dark:border-pink-900/50 text-pink-600 dark:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg transition-colors flex items-center justify-center bg-white dark:bg-gray-800"
                                                title="Finalizar Gestação (Parto/Aborto)"
                                            >
                                                <Baby size={18} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

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

            {/* Modal de Acompanhamento Clínico — Renderizado no ROOT para position:fixed funcionar */}
            {selectedPatient && (
                <PrenatalClinicalPanel
                    patient={selectedPatient}
                    clinicalData={clinicalData}
                    handleClinicalChange={handleClinicalChange}
                    newNote={newNote}
                    setNewNote={setNewNote}
                    newCarePlan={newCarePlan}
                    setNewCarePlan={setNewCarePlan}
                    saveClinicalData={saveClinicalData}
                    isSavingClinical={isSavingClinical}
                    onClose={() => setSelectedPatient(null)}
                    onConcludePregnancy={handleConcludePregnancy}
                />
            )}
        </div>
    );
}
