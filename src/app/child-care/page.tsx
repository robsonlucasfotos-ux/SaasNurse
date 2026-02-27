'use client';

import { useState, useEffect } from 'react';
import { Baby, AlertCircle, Info, Plus, CalendarDays, Loader2, Users, CheckCircle, AlertTriangle, MessageCircle, Activity, Pencil, Save, X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import ModalPortal from '@/components/ModalPortal';

interface Child {
    id: string;
    name: string;
    birth_date: string;
    gender: string;
    risk_level: string;
    guardian_name: string | null;
    guardian_phone: string | null;
    observations: string | null;
    clinical_data?: any; // JSONB
    created_at: string;
}

const childMilestones = [
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
            { name: 'Orientações Educativas', conduct: 'Escovação supervisio nada: pasta com flúor (1000-1500ppm) qtd grão de arroz. Proibido telas/smartphones antes dos 24m.' },
        ],
        prescriptions: [
            { med: '12m: Vacinas', posology: 'Tríplice Viral (1ªD), Pneumo 10V (Reforço), Meningo C (Reforço).', pcdt: true },
            { med: '15m: Vacinas', posology: 'DTP (Reforço), VOP (Reforço oral), Hepatite A, Tetra Viral.', pcdt: true },
            { med: 'Vitamina A (Megadose)', posology: '200.000 UI, Via Oral (Reforço anual até 59m).', pcdt: true },
        ]
    }
];

export default function ChildCare() {
    const supabase = createClient();
    const [activeTab, setActiveTab] = useState('2m'); // Changed to string to match childMilestones IDs

    const [children, setChildren] = useState<Child[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Edit Modal State
    const [editingChild, setEditingChild] = useState<Child | null>(null);
    const [editForm, setEditForm] = useState<Partial<Child>>({});
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    // Clinical Follow-up Modal State
    const [selectedPatient, setSelectedPatient] = useState<Child | null>(null);
    const [clinicalData, setClinicalData] = useState<any>({});
    const [isSavingClinical, setIsSavingClinical] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [newCarePlan, setNewCarePlan] = useState('');

    // Scroll lock for modals
    useEffect(() => {
        if (editingChild || selectedPatient) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
    }, [editingChild, selectedPatient]);

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        birth_date: '',
        gender: 'Masculino',
        risk_level: 'Baixo',
        guardian_name: '',
        guardian_phone: '',
        observations: ''
    });

    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('children')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setChildren(data);
        } catch (error) {
            console.error('Erro ao listar puericultura:', error);
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

            const { error } = await supabase.from('children').insert([{
                user_id: userData.user.id,
                name: formData.name,
                birth_date: formData.birth_date,
                gender: formData.gender,
                risk_level: formData.risk_level,
                guardian_name: formData.guardian_name || null,
                guardian_phone: formData.guardian_phone || null,
                observations: formData.observations || null
            }]);

            if (error) throw error;

            setFormData({ name: '', birth_date: '', gender: 'Masculino', risk_level: 'Baixo', guardian_name: '', guardian_phone: '', observations: '' });
            setShowForm(false);
            fetchChildren();
        } catch (error) {
            console.error("Erro ao salvar criança:", error);
            alert("Não foi possível salvar os dados do recém-nascido.");
        } finally {
            setIsSaving(false);
        }
    };

    const openClinicalModal = (patient: Child) => {
        setSelectedPatient(patient);
        setClinicalData(patient.clinical_data || {});
        setNewNote('');
        setNewCarePlan('');
        setEditingChild(null);
    };

    function openEditModal(child: Child) {
        setEditingChild(child);
        setEditForm({ ...child });
        setSelectedPatient(null);
    }

    async function handleSaveEdit() {
        if (!editingChild) return;
        setIsSavingEdit(true);
        try {
            const { error } = await supabase
                .from('children')
                .update({
                    name: editForm.name,
                    birth_date: editForm.birth_date,
                    gender: editForm.gender,
                    risk_level: editForm.risk_level,
                    guardian_name: editForm.guardian_name || null,
                    guardian_phone: editForm.guardian_phone || null,
                    observations: editForm.observations || null,
                })
                .eq('id', editingChild.id);
            if (error) throw error;
            setChildren(prev => prev.map(c => c.id === editingChild.id ? { ...c, ...editForm } as Child : c));
            setEditingChild(null);
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
                    { date: new Date().toISOString(), text: newNote, carePlan: newCarePlan },
                    ...followUps
                ];
            }
            const { error } = await supabase
                .from('children')
                .update({ clinical_data: updatedClinicalData })
                .eq('id', selectedPatient.id);
            if (error) throw error;
            // Google Keep: fica aberto, limpa campos, atualiza lista
            setChildren(children.map(p => p.id === selectedPatient.id ? { ...p, clinical_data: updatedClinicalData } : p));
            setClinicalData(updatedClinicalData);
            setNewNote('');
            setNewCarePlan('');
        } catch (error) {
            alert('Não foi possível salvar o acompanhamento.');
        } finally {
            setIsSavingClinical(false);
        }
    };

    const getAgeInMonthsDetails = (birthStr: string) => {
        const birth = new Date(birthStr);
        const today = new Date();
        let months = (today.getFullYear() - birth.getFullYear()) * 12;
        months -= birth.getMonth();
        months += today.getMonth();

        let display = '';
        if (months < 1) display = '< 1 mês';
        else if (months < 12) display = `${months} meses`;
        else {
            const years = Math.floor(months / 12);
            const remainingMonths = months % 12;
            display = `${years} ano(s)${remainingMonths > 0 ? ` e ${remainingMonths} mês(es)` : ''}`;
        }

        return { months, display };
    };

    return (
        <div className="flex flex-col h-full gap-6 pb-20">
            <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-2xl shadow-lg text-white">
                <div>
                    <h2 className="text-3xl font-extrabold flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                            <Baby size={32} className="text-white" />
                        </div>
                        Puericultura
                    </h2>
                    <p className="text-blue-100 text-sm mt-2 font-medium opacity-90">Crescimento, Desenvolvimento e Aleitamento Materno Exclusivo.</p>
                </div>
                <div className="hidden md:flex gap-4">
                    <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 backdrop-blur-sm">
                        <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">Total de Crianças</p>
                        <p className="text-2xl font-bold">{children.length}</p>
                    </div>
                </div>
            </div>

            {/* Ações (Adicionar Criança) */}
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex flex-col">
                    <h3 className="font-bold flex items-center gap-2 text-blue-700 dark:text-blue-300 text-lg">
                        <Users size={22} className="text-blue-500" /> Triagem Ativa
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Cadastre novos nascimentos para acompanhamento preventivo.</span>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`btn flex items-center gap-2 px-6 py-3 font-bold rounded-xl transition-all duration-300 ${showForm ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none'}`}
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />} {showForm ? 'Fechar' : 'Nova Criança'}
                </button>
            </div>

            {showForm && (
                <div className="card animate-in fade-in slide-in-from-top-4 border-blue-200 shadow-sm">
                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-xs font-semibold text-muted ml-1">Nome da Criança *</label>
                            <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-muted ml-1">Data de Nascimento *</label>
                            <input type="date" className="form-control font-medium text-blue-700" required value={formData.birth_date} onChange={e => setFormData({ ...formData, birth_date: e.target.value })} />
                            <span className="text-[10px] text-muted ml-1 flex items-center gap-1"><CalendarDays size={10} /> O sistema recalculará a idade em tempo real</span>
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-xs font-semibold text-muted ml-1">Nome do Responsável (Mãe/Pai/Tutor) *</label>
                            <input type="text" className="form-control" placeholder="Ex: Maria da Silva" required value={formData.guardian_name} onChange={e => setFormData({ ...formData, guardian_name: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-muted ml-1">Telefone do Responsável</label>
                            <input type="tel" className="form-control" placeholder="(61) 9xxxx-xxxx" value={formData.guardian_phone} onChange={e => setFormData({ ...formData, guardian_phone: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-muted ml-1">Sexo biológico</label>
                            <select className="form-control" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Não informado">Outro / Não informado</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-muted ml-1">Risco Familiar / Clínico</label>
                            <select className="form-control" value={formData.risk_level} onChange={e => setFormData({ ...formData, risk_level: e.target.value })}>
                                <option value="Baixo">Baixo (Habitual)</option>
                                <option value="Moderado">Moderado</option>
                                <option value="Alto">Alto Risco</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-xs font-semibold text-muted ml-1">Observações (Ex: Prematuridade, Comorbidade Mãe)</label>
                            <textarea className="form-control" placeholder="Contexto de Atenção Básica..." rows={2} value={formData.observations} onChange={e => setFormData({ ...formData, observations: e.target.value })} />
                        </div>

                        <div className="md:col-span-2 flex justify-end mt-2">
                            <button type="submit" disabled={isSaving} className="btn bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Cadastrar Puericultura'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Listagem de Crianças Inteligente */}
            {!isLoading && children.length > 0 && (
                <div className="card w-full border-blue-200">
                    <h3 className="mb-4 text-blue-800 dark:text-blue-300 font-bold flex items-center gap-2 text-lg">
                        <div className="bg-blue-100 dark:bg-blue-900/40 p-1.5 rounded-lg">
                            <Baby size={20} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        Crianças do Módulo ({children.length})
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="border-b dark:border-gray-700 text-sm font-semibold text-muted">
                                    <th className="p-3">Nome da Criança</th>
                                    <th className="p-3">Idade Exata (Automático)</th>
                                    <th className="p-3">Atributos / Risco</th>
                                    <th className="p-3">Responsável / WhatsApp</th>
                                    <th className="p-3 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {children.map(c => {
                                    const age = getAgeInMonthsDetails(c.birth_date);

                                    // Determinar cor do badge da idade baseado nos meses de vida
                                    let ageColor = 'bg-gray-100 text-gray-700'; // Default
                                    if (age.months < 6) ageColor = 'bg-pink-100 text-pink-700';
                                    else if (age.months < 12) ageColor = 'bg-orange-100 text-orange-700';
                                    else if (age.months < 24) ageColor = 'bg-blue-100 text-blue-700';


                                    return (
                                        <tr key={c.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{c.name}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded text-xs font-bold w-fit ${ageColor}`}>
                                                    {age.display}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold w-fit ${c.risk_level === 'Alto' ? 'bg-red-100 text-red-700 border border-red-200' :
                                                        c.risk_level === 'Moderado' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                                            'bg-green-100 text-green-700'
                                                        }`}>
                                                        {c.risk_level}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-muted text-sm max-w-[150px] truncate">
                                                {c.guardian_name || '-'}
                                                {c.guardian_phone && (
                                                    <a
                                                        href={`https://wa.me/55${c.guardian_phone.replace(/\D/g, '')}?text=Olá ${encodeURIComponent((c.guardian_name || 'responsável').split(' ')[0])}, aqui é a enfermagem da UBS.`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 mt-0.5 text-[10px] text-[#25D366] hover:underline font-semibold"
                                                        title="Chamar no WhatsApp"
                                                    >
                                                        <MessageCircle size={10} /> {c.guardian_phone}
                                                    </a>
                                                )}
                                            </td>
                                            <td className="p-3 text-center flex justify-center gap-2">
                                                {c.guardian_phone ? (
                                                    <a
                                                        href={`https://wa.me/55${c.guardian_phone.replace(/\D/g, '')}?text=Olá ${encodeURIComponent((c.guardian_name || 'responsável').split(' ')[0])}, aqui é a enfermagem da UBS. Gostaria de falar sobre ${encodeURIComponent(c.name)}.`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg transition-colors"
                                                        title={`WhatsApp de ${c.guardian_name}`}
                                                    >
                                                        <MessageCircle size={16} />
                                                    </a>
                                                ) : (
                                                    <button disabled className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed" title="Sem telefone">
                                                        <MessageCircle size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => openEditModal(c)}
                                                    className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                                                    title="Editar dados da criança"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={() => openClinicalModal(c)}
                                                    className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-1"
                                                    title="Acompanhamento Clínico / Prontuário"
                                                >
                                                    <CheckCircle size={14} /> <span className="text-[10px] uppercase font-bold hidden md:inline">Acompanhar</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Protocolos Literários CD */}
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
                        <div className="bg-purple-100 dark:bg-purple-900/40 p-2 rounded-lg">
                            <Activity size={20} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        Protocolos Literários CD
                    </h2>
                    <p className="text-muted text-sm mt-1">Avaliação do crescimento e desenvolvimento por marcos de idade.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {childMilestones.map(m => (
                        <button
                            key={m.id}
                            className={`btn px-4 py-2 font-bold rounded-xl transition-all duration-300 ${activeTab === m.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 dark:shadow-none' : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100'}`}
                            onClick={() => setActiveTab(m.id)}
                        >
                            {m.title}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card w-full flex-1">
                {childMilestones.filter((m: any) => m.id === activeTab).map((m: any) => (
                    <div key={m.id} className="animate-fade-in">
                        <h3 className="flex items-center gap-2 mb-8 text-xl font-bold text-gray-800 dark:text-gray-100">
                            <div className="bg-blue-100 dark:bg-blue-900/40 p-2 rounded-lg text-blue-600">
                                <Plus size={24} />
                            </div>
                            Condutas: {m.title}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="flex items-center gap-2 font-semibold text-primary mb-3">
                                    <CheckCircle size={16} /> Avaliação Clínica
                                </h4>
                                <ul className="space-y-3">
                                    {m.symptoms.map((s: any, idx: number) => (
                                        <div key={idx} className="p-4 border rounded" style={{ borderColor: 'var(--border)' }}>
                                            <strong>{s.name}</strong>
                                            <p className="text-muted mt-2" style={{ fontSize: '0.9rem' }}>{s.conduct}</p>
                                        </div>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="flex items-center gap-2 mb-4" style={{ color: 'var(--secondary)' }}>
                                    <CheckCircle size={18} /> Prescrições de Rotina (PCDT / RENAME)
                                </h4>
                                <div className="flex flex-col gap-4">
                                    {m.prescriptions.map((p: any, idx: number) => (
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

            {/* Modal de Edição da Criança */}
            {editingChild && (
                <ModalPortal>
                    <div className="modal-overlay">
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col border" style={{ borderColor: '#fde68a', zIndex: 9999 }}>
                            <div className="p-4 border-b flex justify-between items-center" style={{ background: '#fffbeb' }}>
                                <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: '#92400e' }}>
                                    <Pencil size={18} /> Editar: {editingChild.name}
                                </h3>
                                <button onClick={() => setEditingChild(null)} className="p-2 rounded-full hover:bg-amber-100 transition-colors"><X size={18} style={{ color: '#b45309' }} /></button>
                            </div>
                            <div className="p-6 overflow-y-auto flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nome da Criança *</label>
                                        <input type="text" className="form-control" value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Data de Nascimento</label>
                                        <input type="date" className="form-control" value={editForm.birth_date || ''} onChange={e => setEditForm({ ...editForm, birth_date: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Sexo Biológico</label>
                                        <select className="form-control" value={editForm.gender || 'Masculino'} onChange={e => setEditForm({ ...editForm, gender: e.target.value })}>
                                            <option value="Masculino">Masculino</option>
                                            <option value="Feminino">Feminino</option>
                                            <option value="Não informado">Não informado</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Risco Clínico</label>
                                        <select className="form-control" value={editForm.risk_level || 'Baixo'} onChange={e => setEditForm({ ...editForm, risk_level: e.target.value })}>
                                            <option value="Baixo">Baixo (Habitual)</option>
                                            <option value="Moderado">Moderado</option>
                                            <option value="Alto">Alto Risco</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Responsável</label>
                                        <input type="text" className="form-control" value={editForm.guardian_name || ''} onChange={e => setEditForm({ ...editForm, guardian_name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Telefone do Responsável</label>
                                        <input type="tel" className="form-control" value={editForm.guardian_phone || ''} onChange={e => setEditForm({ ...editForm, guardian_phone: e.target.value })} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Observações</label>
                                        <textarea className="form-control" rows={3} value={editForm.observations || ''} onChange={e => setEditForm({ ...editForm, observations: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-t bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
                                <button onClick={() => setEditingChild(null)} className="btn btn-outline">Cancelar</button>
                                <button onClick={handleSaveEdit} disabled={isSavingEdit} className="btn flex items-center gap-2" style={{ background: '#f59e0b', color: 'white', border: 'none' }}>
                                    {isSavingEdit ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Salvar</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}

            {/* Modal de Acompanhamento Clínico */}
            {selectedPatient && (
                <ModalPortal>
                    <div className="modal-overlay">
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-primary" style={{ zIndex: 9999 }}>
                            <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                                <div>
                                    <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                        <CheckCircle size={20} /> Prontuário: {selectedPatient.name}
                                    </h3>
                                    <p className="text-xs text-muted mt-1">
                                        <AlertTriangle size={12} className="inline mr-1 text-warning" />
                                        Prescrição de enfermagem baseada no protocolo local
                                    </p>
                                </div>
                                <button onClick={() => setSelectedPatient(null)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
                                <div className="card p-4 border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20">
                                    <h4 className="font-semibold border-b dark:border-gray-700 pb-2 mb-3 flex items-center gap-2">
                                        <Activity size={16} className="text-primary" /> Histórico ({clinicalData?.followUps?.length || 0} nota{(clinicalData?.followUps?.length || 0) !== 1 ? 's' : ''})
                                    </h4>
                                    {(!clinicalData?.followUps || clinicalData.followUps.length === 0) ? (
                                        <p className="text-sm text-gray-500 italic text-center py-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                                            Nenhuma evolução registrada ainda. Salve a primeira nota abaixo ↓
                                        </p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                                            {clinicalData.followUps.map((note: any, index: number) => (
                                                <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                                                    <div className="flex justify-between items-center mb-2 pb-1 border-b dark:border-gray-700 border-dashed">
                                                        <span className="text-xs font-semibold text-primary flex items-center gap-1">
                                                            <CalendarDays size={12} />
                                                            {new Date(note.date).toLocaleDateString('pt-BR')} {new Date(note.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        {index === 0 && <span className="text-[9px] font-bold" style={{ background: '#eff6ff', color: '#1d4ed8', padding: '2px 6px', borderRadius: '4px' }}>RECENTE</span>}
                                                    </div>
                                                    {note.text && <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{note.text}</p>}
                                                    {note.carePlan && (
                                                        <div className="mt-2 p-2 rounded border" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
                                                            <strong className="text-xs block mb-0.5" style={{ color: '#1d4ed8' }}>Plano:</strong>
                                                            <p className="text-sm whitespace-pre-wrap" style={{ color: '#1e40af' }}>{note.carePlan}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="card p-4" style={{ borderColor: 'rgba(29,78,216,0.2)', background: 'rgba(29,78,216,0.03)' }}>
                                    <h4 className="font-semibold pb-2 mb-3 text-primary flex items-center gap-2" style={{ borderBottom: '1px solid rgba(29,78,216,0.15)' }}>
                                        <Plus size={16} /> Nova Evolução / Nota
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-muted block mb-1">Quadro Clínico / Observações</label>
                                            <textarea className="form-control" placeholder="Sintomas, sinais vitais, exames..." rows={4} value={newNote} onChange={e => setNewNote(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold block mb-1" style={{ color: '#2563eb' }}>Plano de Autocuidado / Ação</label>
                                            <textarea className="form-control" placeholder="Metas, orientações, encaminhamentos..." rows={4} value={newCarePlan} onChange={e => setNewCarePlan(e.target.value)} style={{ borderColor: '#bfdbfe', background: 'rgba(239,246,255,0.3)' }} />
                                        </div>
                                    </div>
                                    <div className="mt-3 flex justify-end">
                                        <button onClick={saveClinicalData} disabled={isSavingClinical} className="btn btn-primary flex items-center gap-2">
                                            {isSavingClinical ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /> Salvar Nota</>}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 items-center">
                                <span className="text-[10px] text-muted flex-1">✨ Cada nota é salva no prontuário da criança.</span>
                                <button onClick={() => setSelectedPatient(null)} className="btn btn-outline">Fechar</button>
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}
        </div>
    );
}
