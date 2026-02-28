'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { cofenMedications } from '@/data/cofen-meds';
import { Search, AlertTriangle, Calculator, CheckCircle, HeartPulse, MessageCircle, Plus, Users, Loader2, Baby, Pencil, Save, X, Stethoscope } from 'lucide-react';
import PrenatalClinicalPanel from '@/components/PrenatalClinicalPanel';
import ModalPortal from '@/components/ModalPortal';

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
    clinical_data?: any;
    user_id?: string;
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

    const [patients, setPatients] = useState<PregnantWoman[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [stats, setStats] = useState({ trim1: 0, trim2: 0, trim3: 0, total: 0 });

    // Edit Patient State
    const [editingPatient, setEditingPatient] = useState<PregnantWoman | null>(null);
    const [editForm, setEditForm] = useState<Partial<PregnantWoman>>({});
    const [isSavingEdit, setIsSavingEdit] = useState(false);

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

    // Scroll lock when modal is open
    useEffect(() => {
        if (selectedPatient || editingPatient) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [selectedPatient, editingPatient]);

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
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) { setIsLoading(false); return; }

            const { data, error } = await supabase
                .from('pregnant_women')           // ← correct table
                .select('*')
                .eq('user_id', userData.user.id)
                .order('name', { ascending: true });

            if (error) throw error;
            if (data) {
                setPatients(data);
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
        if (!window.confirm(`Confirmar encerramento da gestação? Desfecho: "${outcome}"`)) return;
        setIsLoading(true);
        try {
            const updatedData = {
                ...(currentClinicalData || {}),
                pregnancy_outcome: outcome,
                pregnancy_end_date: new Date().toISOString()
            };

            // Mark as no longer pregnant (keeps record for Saúde da Mulher)
            const { error } = await supabase
                .from('pregnant_women')
                .update({
                    is_pregnant: false,
                    clinical_data: updatedData
                })
                .eq('id', patientId);

            if (error) throw error;
            setSelectedPatient(null);
            alert(`Gestação encerrada! Desfecho: ${outcome}. A paciente foi movida para Saúde da Mulher.`);
            fetchPatients();
        } catch (error) {
            console.error('Erro ao finalizar gestação:', error);
            alert('Não foi possível finalizar a gestação.');
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) throw new Error('Usuário não logado');

            const { error } = await supabase.from('pregnant_women').insert([{
                user_id: userData.user.id,
                name: formData.name,
                age: formData.age ? parseInt(formData.age) : null,
                phone: formData.phone || null,
                risk_level: formData.risk_level,
                risk_reason: formData.risk_level === 'Alto' ? formData.risk_reason : null,
                is_pregnant: true,
                dum: formData.dum,
                dpp: formData.dpp || null,
                clinical_data: {
                    cpf: formData.cpf || null,
                    address: formData.address || null,
                    acs_area: formData.acs_area || null,
                }
            }]);

            if (error) throw error;
            setFormData({ name: '', age: '', birth_date: '', phone: '', cpf: '', address: '', acs_area: '', risk_level: 'Habitual', risk_reason: '', dum: '', dpp: '' });
            setShowForm(false);
            fetchPatients();
        } catch (error: any) {
            console.error('Erro ao salvar gestante:', error);
            alert('Não foi possível salvar: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const openClinicalModal = (patient: PregnantWoman) => {
        console.log('Opening Clinical Modal for:', patient.name);
        setEditingPatient(null);
        setClinicalData(patient.clinical_data || {});
        setNewNote('');
        setNewCarePlan('');
        setSelectedPatient(patient);
    };

    function openEditModal(patient: PregnantWoman) {
        setSelectedPatient(null);
        setEditForm({ ...patient });
        setEditingPatient(patient);
    }

    async function handleSaveEdit() {
        if (!editingPatient) return;
        setIsSavingEdit(true);
        try {
            const { error } = await supabase
                .from('pregnant_women')
                .update({
                    name: editForm.name,
                    age: editForm.age,
                    phone: editForm.phone || null,
                    risk_level: editForm.risk_level,
                    risk_reason: editForm.risk_reason || null,
                    dum: editForm.dum,
                    dpp: editForm.dpp || null,
                })
                .eq('id', editingPatient.id);
            if (error) throw error;
            setPatients(prev => prev.map(p => p.id === editingPatient.id ? { ...p, ...editForm } as PregnantWoman : p));
            setEditingPatient(null);
        } catch (err) {
            alert('Erro ao salvar: ' + (err as any)?.message);
        } finally {
            setIsSavingEdit(false);
        }
    }

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
                .from('pregnant_women')
                .update({ clinical_data: updatedClinicalData })
                .eq('id', selectedPatient.id);

            if (error) throw error;

            setPatients(patients.map(p => p.id === selectedPatient.id ? { ...p, clinical_data: updatedClinicalData } : p));
            setSelectedPatient(prev => prev ? { ...prev, clinical_data: updatedClinicalData } : prev);
            setClinicalData(updatedClinicalData);
            setNewNote('');
            setNewCarePlan('');
        } catch (error) {
            console.error('Erro ao salvar acompanhamento:', error);
            alert('Não foi possível salvar o acompanhamento.');
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

            {/* Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/10 dark:to-pink-900/20 border-pink-200 flex flex-col justify-between p-5 shadow-sm">
                    <span className="text-pink-600 font-black text-[10px] uppercase tracking-widest">1º Trimestre</span>
                    <span className="text-4xl font-black text-pink-700 my-2">{isLoading ? '-' : stats.trim1}</span>
                    <span className="text-[10px] font-bold text-pink-400 uppercase">Até 12 semanas</span>
                </div>
                <div className="card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/10 dark:to-purple-900/20 border-purple-200 flex flex-col justify-between p-5 shadow-sm">
                    <span className="text-purple-600 font-black text-[10px] uppercase tracking-widest">2º Trimestre</span>
                    <span className="text-4xl font-black text-purple-700 my-2">{isLoading ? '-' : stats.trim2}</span>
                    <span className="text-[10px] font-bold text-purple-400 uppercase">13 a 27 semanas</span>
                </div>
                <div className="card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-900/20 border-blue-200 flex flex-col justify-between p-5 shadow-sm">
                    <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest">3º Trimestre</span>
                    <span className="text-4xl font-black text-blue-700 my-2">{isLoading ? '-' : stats.total - stats.trim1 - stats.trim2}</span>
                    <span className="text-[10px] font-bold text-blue-400 uppercase">Parto Próximo</span>
                </div>
                <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/10 dark:to-emerald-900/20 border-emerald-200 flex flex-col justify-between p-5 shadow-sm">
                    <span className="text-emerald-600 font-black text-[10px] uppercase tracking-widest">Total Ativo</span>
                    <span className="text-4xl font-black text-emerald-700 my-2">{isLoading ? '-' : stats.total}</span>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">Gestantes</span>
                </div>
            </div>

            {/* Botão Nova Gestante */}
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
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Salvar Gestante'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Listagem de Pacientes */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 size={32} className="animate-spin text-primary" />
                </div>
            ) : patients.length === 0 ? (
                <div className="card text-center py-12 border-dashed">
                    <Baby size={48} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-semibold">Nenhuma gestante cadastrada ainda.</p>
                    <p className="text-sm text-gray-400 mt-1">Clique em "Nova Gestante" para começar.</p>
                </div>
            ) : (
                <div className="card w-full mt-2 border-primary overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <h3 className="text-gray-900 font-black text-xl flex items-center gap-2">
                                <Users size={24} className="text-primary" />
                                Monitoramento de Gestantes
                            </h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                                {patients.length} pacientes em acompanhamento ativo
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {(['Todas', 1, 2, 3, 'Cofen'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setPatientFilterTab(tab)}
                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${patientFilterTab === tab
                                        ? 'bg-primary text-white shadow-lg shadow-blue-200'
                                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                        }`}
                                >
                                    {tab === 'Todas' ? 'Todas' : tab === 'Cofen' ? 'Prescrições 801/26' : `${tab}º Trimestre`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {patientFilterTab === 'Cofen' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-2">
                            <div className="relative mb-6">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Buscar por medicação ou indicação..."
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-gray-800"
                                    value={medQuery}
                                    onChange={(e) => setMedQuery(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {cofenMedications.filter(m =>
                                    m.name.toLowerCase().includes(medQuery.toLowerCase()) ||
                                    m.category.toLowerCase().includes(medQuery.toLowerCase()) ||
                                    m.indication.toLowerCase().includes(medQuery.toLowerCase())
                                ).map((m, idx) => (
                                    <div key={idx} className="p-6 border-2 border-emerald-50 rounded-3xl bg-emerald-50/10 hover:border-emerald-200 transition-all group">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 px-2 py-1 rounded-lg">
                                                {m.category}
                                            </span>
                                        </div>
                                        <h4 className="font-black text-gray-900 group-hover:text-emerald-700 transition-colors">{m.name}</h4>
                                        <p className="text-[10px] font-black text-emerald-600 mt-1 uppercase tracking-tighter">{m.dosage}</p>
                                        <div className="mt-4 pt-4 border-t border-emerald-50">
                                            <p className="text-xs text-gray-500 font-bold leading-relaxed">Indicação: <span className="text-gray-900">{m.indication}</span></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {patients.filter(p => {
                                if (patientFilterTab === 'Todas') return true;
                                return calculateTrimester(p.dum) === patientFilterTab;
                            }).map(p => {
                                const dumDate = p.dum ? new Date(p.dum) : null;
                                const diffTime = dumDate ? Math.abs(Date.now() - dumDate.getTime()) : 0;
                                const weeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
                                const trimester = calculateTrimester(p.dum);
                                const riskColor = p.risk_level === 'Alto' ? 'red' : p.risk_level === 'Moderado' ? 'orange' : 'emerald';

                                return (
                                    <div
                                        key={p.id}
                                        className="group border-2 border-gray-50 rounded-[2.5rem] p-6 flex flex-col bg-white hover:border-pink-300 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300 relative"
                                    >
                                        <div className={`absolute top-6 left-0 w-1.5 h-12 rounded-r-full bg-${riskColor}-500 shadow-[2px_0_10px_rgba(0,0,0,0.1)]`}></div>

                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-black text-gray-900 text-xl leading-tight truncate group-hover:text-primary transition-colors">{p.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{p.age ? `${p.age} Anos` : 'Idade N/I'}</span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest text-${riskColor}-600`}>Risco {p.risk_level}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-gray-50 rounded-3xl mb-4 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Status Gestacional</span>
                                                <span className="text-xs font-black text-primary uppercase italic">{weeks}ª Semana</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{ width: `${Math.min((weeks / 40) * 100, 100)}%` }}></div>
                                            </div>
                                            <div className="flex justify-between items-center pt-1">
                                                <span className="text-[10px] font-bold text-gray-500">DUM: {p.dum ? new Date(p.dum).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/I'}</span>
                                                <span className="text-[10px] font-bold text-pink-500 uppercase">DPP: {p.dpp ? new Date(p.dpp).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/I'}</span>
                                            </div>
                                        </div>

                                        {p.phone && (
                                            <a
                                                href={`https://wa.me/55${p.phone.replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex items-center gap-2 text-emerald-600 font-bold text-xs mb-4 hover:bg-emerald-50 p-2 rounded-xl transition-colors w-fit relative z-10"
                                            >
                                                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                                                    <MessageCircle size={14} />
                                                </div>
                                                {p.phone}
                                            </a>
                                        )}

                                        <div className="mt-auto flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openClinicalModal(p);
                                                }}
                                                className="flex-1 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-gray-200 active:scale-95 transition-all flex items-center justify-center gap-2 relative z-10"
                                            >
                                                <Stethoscope size={16} /> Avaliar Paciente
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openEditModal(p);
                                                }}
                                                className="p-4 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-2xl transition-all active:scale-90 relative z-10"
                                                title="Editar Paciente"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Clinical Follow-up Modal */}
            {selectedPatient && (
                <PrenatalClinicalPanel
                    patient={selectedPatient}
                    clinicalData={clinicalData}
                    handleClinicalChange={(key: string, val: any) => setClinicalData((prev: any) => ({ ...prev, [key]: val }))}
                    newNote={newNote}
                    setNewNote={setNewNote}
                    newCarePlan={newCarePlan}
                    setNewCarePlan={setNewCarePlan}
                    saveClinicalData={saveClinicalData}
                    isSavingClinical={isSavingClinical}
                    onClose={() => setSelectedPatient(null)}
                    onConcludePregnancy={handleConcludePregnancy}
                    trimestersData={trimestersData}
                    cofenMedications={cofenMedications}
                />
            )}

            {/* Edit Patient Modal */}
            {editingPatient && (
                <ModalPortal>
                    <div className="modal-overlay">
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col border" style={{ borderColor: '#fde68a', zIndex: 9999 }}>
                            <div className="p-4 border-b flex justify-between items-center" style={{ background: '#fffbeb' }}>
                                <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: '#92400e' }}>
                                    <Pencil size={18} /> Editar: {editingPatient.name}
                                </h3>
                                <button onClick={() => setEditingPatient(null)} className="p-2 rounded-full hover:bg-amber-100 transition-colors">
                                    <X size={18} style={{ color: '#b45309' }} />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nome Completo *</label>
                                        <input type="text" className="form-control" value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Idade</label>
                                        <input type="number" className="form-control" value={editForm.age || ''} onChange={e => setEditForm({ ...editForm, age: parseInt(e.target.value) || null })} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Telefone / WhatsApp</label>
                                        <input type="tel" className="form-control" value={editForm.phone || ''} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">DUM (Última Menstruação)</label>
                                        <input type="date" className="form-control" value={editForm.dum || ''} onChange={e => setEditForm({ ...editForm, dum: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">DPP (Data Provável do Parto)</label>
                                        <input type="date" className="form-control" value={editForm.dpp || ''} onChange={e => setEditForm({ ...editForm, dpp: e.target.value })} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Classificação de Risco</label>
                                        <select className="form-control" value={editForm.risk_level || 'Habitual'} onChange={e => setEditForm({ ...editForm, risk_level: e.target.value })}>
                                            <option value="Habitual">Risco Habitual (Baixo)</option>
                                            <option value="Moderado">Risco Moderado</option>
                                            <option value="Alto">Alto Risco</option>
                                        </select>
                                    </div>
                                    {editForm.risk_level === 'Alto' && (
                                        <div className="md:col-span-2">
                                            <label className="block text-[10px] font-bold text-red-500 uppercase mb-1">Motivo do Alto Risco</label>
                                            <textarea className="form-control border-red-300" rows={2} value={editForm.risk_reason || ''} onChange={e => setEditForm({ ...editForm, risk_reason: e.target.value })} />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-4 border-t bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
                                <button onClick={() => setEditingPatient(null)} className="btn btn-outline">Cancelar</button>
                                <button onClick={handleSaveEdit} disabled={isSavingEdit} className="btn flex items-center gap-2" style={{ background: '#f59e0b', color: 'white', border: 'none' }}>
                                    {isSavingEdit ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Salvar</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}

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
                    onConcludePregnancy={(patientId: string, outcome: string, clinicalDataObj: any) => handleConcludePregnancy(patientId, outcome, clinicalDataObj)}
                    trimestersData={trimestersData}
                    cofenMedications={cofenMedications}
                />
            )}
        </div>
    );
}
