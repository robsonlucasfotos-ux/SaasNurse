'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { cofenMedications, authorizedExams } from '@/data/cofen-meds';
import { Search, Phone, AlertTriangle, Calculator, CheckCircle, HeartPulse, MessageCircle, Plus, Users, Loader2 } from 'lucide-react';

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
                clinical_data: {
                    cpf: formData.cpf || null,
                    address: formData.address || null,
                    acs_area: formData.acs_area || null,
                },
                risk_level: formData.risk_level,
                risk_reason: formData.risk_level === 'Alto' ? formData.risk_reason : null,
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
    };

    const handleClinicalChange = (key: string, value: any) => {
        setClinicalData((prev: any) => ({ ...prev, [key]: value }));
    };

    const saveClinicalData = async () => {
        if (!selectedPatient) return;
        setIsSavingClinical(true);
        try {
            const { error } = await supabase
                .from('pregnant_women')
                .update({ clinical_data: clinicalData })
                .eq('id', selectedPatient.id);

            if (error) throw error;

            // Update local state to reflect changes instantly without full refetch
            setPatients(patients.map(p => p.id === selectedPatient.id ? { ...p, clinical_data: clinicalData } : p));
            setSelectedPatient(null);
            alert("Acompanhamento salvo com sucesso!");
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
                                                className="flex-1 btn btn-primary flex items-center justify-center gap-2 text-sm py-2 bg-purple-600 hover:bg-purple-700 border-none text-white shadow-sm"
                                            >
                                                <CheckCircle size={16} /> Acompanhar
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
            {/* Modal de Acompanhamento Clínico */}
            {selectedPatient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-primary animate-in fade-in zoom-in-95">
                        <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                            <div>
                                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                    <CheckCircle size={20} />
                                    Acompanhamento Clínico: {selectedPatient.name}
                                </h3>
                                <p className="text-xs text-muted mt-1">
                                    <AlertTriangle size={12} className="inline mr-1 text-warning" />
                                    Prescrição de enfermagem baseada no protocolo de enfermagem conforme nota do Cofen
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedPatient(null)}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <Plus size={20} className="rotate-45" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* 1º Trimestre */}
                            <div className="card p-4 border-pink-100 bg-pink-50/50 dark:bg-pink-900/10">
                                <h4 className="font-semibold text-pink-700 border-b border-pink-200 pb-2 mb-3">1º Trimestre</h4>
                                <div className="space-y-3">
                                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" className="mt-1 accent-pink-600" checked={clinicalData?.t1_exames || false} onChange={e => handleClinicalChange('t1_exames', e.target.checked)} />
                                        <span>Exames / Ecografia</span>
                                    </label>
                                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" className="mt-1 accent-pink-600" checked={clinicalData?.t1_testes || false} onChange={e => handleClinicalChange('t1_testes', e.target.checked)} />
                                        <span>Testes Rápidos</span>
                                    </label>
                                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" className="mt-1 accent-pink-600" checked={clinicalData?.t1_citologico || false} onChange={e => handleClinicalChange('t1_citologico', e.target.checked)} />
                                        <span>Citológico</span>
                                    </label>
                                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" className="mt-1 accent-pink-600" checked={clinicalData?.t1_teste_mae || false} onChange={e => handleClinicalChange('t1_teste_mae', e.target.checked)} />
                                        <span>Teste da Mamãe</span>
                                    </label>
                                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" className="mt-1 accent-pink-600" checked={clinicalData?.t1_vacina || false} onChange={e => handleClinicalChange('t1_vacina', e.target.checked)} />
                                        <span>Atualização Caderneta de Vacina</span>
                                    </label>
                                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" className="mt-1 accent-pink-600" checked={clinicalData?.t1_odonto || false} onChange={e => handleClinicalChange('t1_odonto', e.target.checked)} />
                                        <span>Avaliação Odontológica</span>
                                    </label>

                                    <div className="pt-2 border-t border-pink-200/50">
                                        <p className="text-xs font-semibold text-pink-700 mb-1">Prescrições:</p>
                                        <label className="flex items-start gap-2 text-sm cursor-pointer">
                                            <input type="checkbox" className="mt-0.5 accent-pink-600" checked={clinicalData?.t1_sulfato || false} onChange={e => handleClinicalChange('t1_sulfato', e.target.checked)} />
                                            <span className="text-xs">Sulfato Ferroso</span>
                                        </label>
                                        <label className="flex items-start gap-2 text-sm cursor-pointer">
                                            <input type="checkbox" className="mt-0.5 accent-pink-600" checked={clinicalData?.t1_acido || false} onChange={e => handleClinicalChange('t1_acido', e.target.checked)} />
                                            <span className="text-xs">Ácido Fólico</span>
                                        </label>
                                        <label className="flex items-start gap-2 text-sm cursor-pointer">
                                            <input type="checkbox" className="mt-0.5 accent-pink-600" checked={clinicalData?.t1_meclisina || false} onChange={e => handleClinicalChange('t1_meclisina', e.target.checked)} />
                                            <span className="text-xs">Meclisina</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* 2º Trimestre */}
                            <div className="card p-4 border-purple-100 bg-purple-50/50 dark:bg-purple-900/10">
                                <h4 className="font-semibold text-purple-700 border-b border-purple-200 pb-2 mb-3">2º Trimestre</h4>
                                <div className="space-y-3">
                                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" className="mt-1 accent-purple-600" checked={clinicalData?.t2_exames || false} onChange={e => handleClinicalChange('t2_exames', e.target.checked)} />
                                        <span>Exames / Ecografia</span>
                                    </label>
                                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" className="mt-1 accent-purple-600" checked={clinicalData?.t2_vacina || false} onChange={e => handleClinicalChange('t2_vacina', e.target.checked)} />
                                        <span>Vacina</span>
                                    </label>

                                    <div className="pt-2 border-t border-purple-200/50">
                                        <p className="text-xs font-semibold text-purple-700 mb-1">Prescrições:</p>
                                        <label className="flex items-start gap-2 text-sm cursor-pointer">
                                            <input type="checkbox" className="mt-0.5 accent-purple-600" checked={clinicalData?.t2_sulfato || false} onChange={e => handleClinicalChange('t2_sulfato', e.target.checked)} />
                                            <span className="text-xs">Sulfato Ferroso</span>
                                        </label>
                                        <label className="flex items-start gap-2 text-sm cursor-pointer">
                                            <input type="checkbox" className="mt-0.5 accent-purple-600" checked={clinicalData?.t2_calcio || false} onChange={e => handleClinicalChange('t2_calcio', e.target.checked)} />
                                            <span className="text-xs">Carbonato de Cálcio</span>
                                        </label>
                                        <label className="flex items-start gap-2 text-sm cursor-pointer">
                                            <input type="checkbox" className="mt-0.5 accent-purple-600" checked={clinicalData?.t2_meclisina || false} onChange={e => handleClinicalChange('t2_meclisina', e.target.checked)} />
                                            <span className="text-xs">Meclisina</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* 3º Trimestre */}
                            <div className="card p-4 border-blue-100 bg-blue-50/50 dark:bg-blue-900/10">
                                <h4 className="font-semibold text-blue-700 border-b border-blue-200 pb-2 mb-3">3º Trimestre</h4>
                                <div className="space-y-3">
                                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" className="mt-1 accent-blue-600" checked={clinicalData?.t3_exames || false} onChange={e => handleClinicalChange('t3_exames', e.target.checked)} />
                                        <span>Exames / Ecografia</span>
                                    </label>
                                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" className="mt-1 accent-blue-600" checked={clinicalData?.t3_teste_mae || false} onChange={e => handleClinicalChange('t3_teste_mae', e.target.checked)} />
                                        <span>2ª Coleta do Teste da Mamãe</span>
                                    </label>
                                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" className="mt-1 accent-blue-600" checked={clinicalData?.t3_testes || false} onChange={e => handleClinicalChange('t3_testes', e.target.checked)} />
                                        <span>Testes Rápidos</span>
                                    </label>
                                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" className="mt-1 accent-blue-600" checked={clinicalData?.t3_swab || false} onChange={e => handleClinicalChange('t3_swab', e.target.checked)} />
                                        <span>Swab Anal</span>
                                    </label>
                                    <label className="flex items-start gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" className="mt-1 accent-blue-600" checked={clinicalData?.t3_vacina || false} onChange={e => handleClinicalChange('t3_vacina', e.target.checked)} />
                                        <span>Vacina</span>
                                    </label>

                                    <div className="pt-2 border-t border-blue-200/50">
                                        <p className="text-xs font-semibold text-blue-700 mb-1">Prescrições:</p>
                                        <label className="flex items-start gap-2 text-sm cursor-pointer">
                                            <input type="checkbox" className="mt-0.5 accent-blue-600" checked={clinicalData?.t3_sulfato || false} onChange={e => handleClinicalChange('t3_sulfato', e.target.checked)} />
                                            <span className="text-xs">Sulfato Ferroso</span>
                                        </label>
                                        <label className="flex items-start gap-2 text-sm cursor-pointer">
                                            <input type="checkbox" className="mt-0.5 accent-blue-600" checked={clinicalData?.t3_acido || false} onChange={e => handleClinicalChange('t3_acido', e.target.checked)} />
                                            <span className="text-xs">Ácido Fólico</span>
                                        </label>
                                        <label className="flex items-start gap-2 text-sm cursor-pointer">
                                            <input type="checkbox" className="mt-0.5 accent-blue-600" checked={clinicalData?.t3_meclisina || false} onChange={e => handleClinicalChange('t3_meclisina', e.target.checked)} />
                                            <span className="text-xs">Meclisina</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Observações Gerais */}
                            <div className="md:col-span-3 card p-4 border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20">
                                <h4 className="font-semibold border-b dark:border-gray-700 pb-2 mb-3">Observações Adicionais</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <label className="flex items-center gap-2 text-sm cursor-pointer bg-white dark:bg-gray-800 p-2 border dark:border-gray-700 rounded shadow-sm">
                                        <input type="checkbox" className="accent-red-500" checked={clinicalData?.obs_hipertensao || false} onChange={e => handleClinicalChange('obs_hipertensao', e.target.checked)} />
                                        <span className="font-medium text-red-600 dark:text-red-400">Hipertensão</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer bg-white dark:bg-gray-800 p-2 border dark:border-gray-700 rounded shadow-sm">
                                        <input type="checkbox" className="accent-orange-500" checked={clinicalData?.obs_diabetes || false} onChange={e => handleClinicalChange('obs_diabetes', e.target.checked)} />
                                        <span className="font-medium text-orange-600 dark:text-orange-400">Diabetes Gestacional</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer bg-white dark:bg-gray-800 p-2 border dark:border-gray-700 rounded shadow-sm">
                                        <input type="checkbox" className="accent-yellow-500" checked={clinicalData?.obs_itu || false} onChange={e => handleClinicalChange('obs_itu', e.target.checked)} />
                                        <span className="font-medium text-yellow-600 dark:text-yellow-400">ITU</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer bg-white dark:bg-gray-800 p-2 border dark:border-gray-700 rounded shadow-sm">
                                        <input type="checkbox" className="accent-purple-500" checked={clinicalData?.obs_corrimento || false} onChange={e => handleClinicalChange('obs_corrimento', e.target.checked)} />
                                        <span className="font-medium text-purple-600 dark:text-purple-400">Corrimentos</span>
                                    </label>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-muted ml-1">Notas Clínicas</label>
                                    <textarea
                                        className="form-control"
                                        placeholder="Adicione outras observações, evoluções ou detalhes adicionais sobre o acompanhamento..."
                                        rows={3}
                                        value={clinicalData?.notes || ''}
                                        onChange={e => handleClinicalChange('notes', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedPatient(null)}
                                className="btn btn-outline"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={saveClinicalData}
                                disabled={isSavingClinical}
                                className="btn btn-primary flex items-center gap-2"
                            >
                                {isSavingClinical ? <Loader2 size={16} className="animate-spin" /> : 'Salvar Acompanhamento'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
