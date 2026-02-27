'use client';

import { useState, useEffect } from 'react';
import {
    Baby, Plus, CalendarDays, Loader2, Users, CheckCircle,
    AlertTriangle, MessageCircle, Activity, Pencil, Save, X,
    ShieldCheck, Calendar, Info, Heart
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import ModalPortal from '@/components/ModalPortal';
import ChildClinicalPanel from '@/components/ChildClinicalPanel';

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
        title: '4 Meses',
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
        title: '9 Meses',
        symptoms: [
            { name: 'Marcos do Desenvolvimento', conduct: 'Engatinha? Fica em pé agarrando móveis? Movimento de pinça (indicador e polegar)? Articula dissílabas (ma-ma, pa-pa)?' },
        ],
        prescriptions: [
            { med: 'Vacinas (Calendário)', posology: 'Febre Amarela (Dose Inicial - em áreas recomendadas).', pcdt: true },
        ]
    },
    {
        id: '12m',
        title: '1 a 2 Anos',
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

export default function ChildCare() {
    const supabase = createClient();

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

    // Scroll lock for modals
    useEffect(() => {
        if (editingChild || selectedPatient) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        return () => document.body.classList.remove('no-scroll');
    }, [editingChild, selectedPatient]);

    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        setIsLoading(true);
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) { setIsLoading(false); return; }

            const { data, error } = await supabase
                .from('children')
                .select('*')
                .eq('user_id', userData.user.id)
                .order('name', { ascending: true });

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
            alert("Não foi possível salvar os dados da criança.");
        } finally {
            setIsSaving(false);
        }
    };

    const openClinicalModal = (patient: Child) => {
        console.log('Opening Child Clinical Panel for:', patient.name);
        setEditingChild(null);
        setClinicalData(patient.clinical_data || {});
        setNewNote('');
        setNewCarePlan('');
        setSelectedPatient(patient);
    };

    function openEditModal(child: Child) {
        setSelectedPatient(null);
        setEditForm({ ...child });
        setEditingChild(child);
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
        } catch (err: any) {
            alert('Erro ao salvar: ' + err.message);
        } finally {
            setIsSavingEdit(false);
        }
    }

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

            setChildren(children.map(p => p.id === selectedPatient.id ? { ...p, clinical_data: updatedClinicalData } : p));
            setClinicalData(updatedClinicalData);
            setNewNote('');
            setNewCarePlan('');
        } catch (error) {
            console.error('Erro ao salvar evolução:', error);
            alert('Não foi possível salvar o acompanhamento.');
        } finally {
            setIsSavingClinical(false);
        }
    };

    const getAgeDetails = (birthStr: string) => {
        if (!birthStr) return { months: 0, display: 'N/I' };
        const birth = new Date(birthStr);
        const today = new Date();
        let months = (today.getFullYear() - birth.getFullYear()) * 12;
        months -= birth.getMonth();
        months += today.getMonth();

        if (months < 1) {
            const diffTime = Math.abs(today.getTime() - birth.getTime());
            const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            return { months, display: `${days} dias` };
        } else if (months < 24) {
            return { months, display: `${months} meses` };
        } else {
            const years = Math.floor(months / 12);
            return { months, display: `${years} anos` };
        }
    };

    return (
        <div className="flex flex-col h-full gap-6 pb-20">
            {/* Header / Intro */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black text-indigo-950 flex items-center gap-3">
                        <div className="bg-indigo-600 text-white p-2 rounded-2xl shadow-lg shadow-indigo-200">
                            <Baby size={28} />
                        </div>
                        Puericultura (CD)
                    </h2>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2 ml-1">Crescimento & Desenvolvimento Infantil</p>
                </div>
            </div>

            {/* Dashboard / Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 p-5 shadow-sm transform hover:scale-[1.02] transition-transform">
                    <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">Total Ativo</span>
                    <span className="text-4xl font-black text-indigo-700 my-2 block">{isLoading ? '-' : children.length}</span>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">Crianças</span>
                </div>
                <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 p-5 shadow-sm transform hover:scale-[1.02] transition-transform">
                    <span className="text-emerald-600 font-black text-[10px] uppercase tracking-widest">Sob Monitoramento</span>
                    <span className="text-4xl font-black text-emerald-700 my-2 block">{isLoading ? '-' : children.filter(c => c.risk_level === 'Alto').length}</span>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">Alto Risco</span>
                </div>
                <div className="card bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 p-5 shadow-sm transform hover:scale-[1.02] transition-transform">
                    <span className="text-amber-600 font-black text-[10px] uppercase tracking-widest">Novos Nascidos</span>
                    <span className="text-4xl font-black text-amber-700 my-2 block">{isLoading ? '-' : children.filter(c => getAgeDetails(c.birth_date).months < 1).length}</span>
                    <span className="text-[10px] font-bold text-amber-400 uppercase">Recém-nascidos</span>
                </div>
                <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 p-5 shadow-sm transform hover:scale-[1.02] transition-transform">
                    <span className="text-purple-600 font-black text-[10px] uppercase tracking-widest">Guia SaaS</span>
                    <span className="text-4xl font-black text-purple-700 my-2 block">100%</span>
                    <span className="text-[10px] font-bold text-purple-400 uppercase">Segurança Clínica</span>
                </div>
            </div>

            {/* Adicionar Criança */}
            <div className="flex justify-between items-center">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all active:scale-95"
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />} {showForm ? 'Fechar' : 'Nova Criança'}
                </button>
            </div>

            {showForm && (
                <div className="card animate-in fade-in slide-in-from-top-4 border-2 border-indigo-100 rounded-[2.5rem] bg-indigo-50/10">
                    <h3 className="mb-6 text-indigo-900 font-black flex items-center gap-3 text-xl">
                        <Users size={24} className="text-indigo-600" /> Cadastro de Puericultura
                    </h3>
                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Nome Completo da Criança *</label>
                            <input type="text" className="w-full p-4 bg-white border-2 border-indigo-50 rounded-2xl focus:border-indigo-500 transition-all font-bold" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Data de Nascimento *</label>
                            <input type="date" className="w-full p-4 bg-white border-2 border-indigo-50 rounded-2xl focus:border-indigo-500 transition-all font-bold text-indigo-600" required value={formData.birth_date} onChange={e => setFormData({ ...formData, birth_date: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Sexo Biológico</label>
                            <select className="w-full p-4 bg-white border-2 border-indigo-50 rounded-2xl focus:border-indigo-500 transition-all font-bold" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Não informado">Outro / N/I</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Responsável Principal *</label>
                            <input type="text" className="w-full p-4 bg-white border-2 border-indigo-50 rounded-2xl focus:border-indigo-500 transition-all font-bold" required value={formData.guardian_name} onChange={e => setFormData({ ...formData, guardian_name: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Telefone / WhatsApp</label>
                            <input type="tel" className="w-full p-4 bg-white border-2 border-indigo-50 rounded-2xl focus:border-indigo-500 transition-all font-bold" value={formData.guardian_phone} onChange={e => setFormData({ ...formData, guardian_phone: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Risco Familiar / Clínico</label>
                            <select className="w-full p-4 bg-white border-2 border-indigo-50 rounded-2xl focus:border-indigo-500 transition-all font-bold" value={formData.risk_level} onChange={e => setFormData({ ...formData, risk_level: e.target.value })}>
                                <option value="Baixo">Risco Baixo (Habitual)</option>
                                <option value="Moderado">Risco Moderado</option>
                                <option value="Alto">Alto Risco</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Observações de Prontuário</label>
                            <textarea className="w-full p-4 bg-white border-2 border-indigo-50 rounded-2xl focus:border-indigo-500 transition-all font-bold" rows={3} value={formData.observations} onChange={e => setFormData({ ...formData, observations: e.target.value })} />
                        </div>

                        <div className="md:col-span-2 flex justify-end">
                            <button type="submit" disabled={isSaving} className="w-full md:w-auto px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3">
                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Confirmar Cadastro'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Listagem de Cards */}
            <div className="mt-4">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-gray-900 font-black text-xl flex items-center gap-2">
                            <Users size={24} className="text-indigo-600" />
                            Monitoramento Ativo
                        </h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2 italic">Acompanhamento do desenvolvimento neuropsicomotor</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 size={48} className="animate-spin text-indigo-500" />
                    </div>
                ) : children.length === 0 ? (
                    <div className="card text-center py-20 border-2 border-dashed border-indigo-100 rounded-[3rem] bg-indigo-50/5">
                        <Baby size={64} className="text-indigo-100 mx-auto mb-6" />
                        <p className="text-xl font-black text-indigo-900/40">Nenhuma criança cadastrada</p>
                        <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">Inicie o monitoramento preventivo da sua área.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {children.map(c => {
                            const age = getAgeDetails(c.birth_date);
                            const riskColor = c.risk_level === 'Alto' ? 'red' : c.risk_level === 'Moderado' ? 'orange' : 'indigo';

                            return (
                                <div key={c.id} className="group border-2 border-gray-50 rounded-[2.5rem] p-8 flex flex-col bg-white hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 relative">
                                    <div className={`absolute top-8 left-0 w-2 h-16 rounded-r-full bg-${riskColor}-500 shadow-[4px_0_15px_rgba(0,0,0,0.1)]`}></div>

                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <h4 className="font-black text-gray-950 text-2xl leading-tight truncate group-hover:text-indigo-700 transition-colors uppercase tracking-tighter">{c.name}</h4>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">{age.display}</span>
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border border-${riskColor}-100 bg-${riskColor}-50 text-${riskColor}-600`}>Risco {c.risk_level}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 bg-indigo-50/30 rounded-[2rem] border border-indigo-50/50 mb-6 space-y-4">
                                        <div className="flex justify-between items-center px-1">
                                            <div className="flex items-center gap-2">
                                                <CalendarDays size={14} className="text-indigo-300" />
                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Nascimento</span>
                                            </div>
                                            <span className="text-xs font-black text-indigo-950">{c.birth_date ? new Date(c.birth_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/I'}</span>
                                        </div>
                                        <div className="flex justify-between items-center px-1">
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck size={14} className="text-indigo-300" />
                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Responsável</span>
                                            </div>
                                            <span className="text-xs font-black text-indigo-950 truncate max-w-[120px]">{c.guardian_name || 'N/I'}</span>
                                        </div>
                                    </div>

                                    {c.guardian_phone && (
                                        <a
                                            href={`https://wa.me/55${c.guardian_phone.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 text-emerald-600 font-black text-xs mb-8 hover:bg-emerald-50 px-4 py-3 rounded-2xl transition-all border border-emerald-50/50 w-full justify-center"
                                        >
                                            <MessageCircle size={18} />
                                            {c.guardian_phone}
                                        </a>
                                    )}

                                    <div className="mt-auto flex gap-3">
                                        <button
                                            onClick={() => openClinicalModal(c)}
                                            className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-3"
                                        >
                                            <Activity size={18} /> Acompanhar
                                        </button>
                                        <button
                                            onClick={() => openEditModal(c)}
                                            className="p-5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-[1.5rem] transition-all active:scale-90 shadow-sm"
                                        >
                                            <Pencil size={20} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Child Clinical Follow-up Modal */}
            <ChildClinicalPanel
                child={selectedPatient}
                clinicalData={clinicalData}
                handleClinicalChange={(key: string, val: any) => {
                    const updated = { ...clinicalData, [key]: val };
                    setClinicalData(updated);
                }}
                newNote={newNote}
                setNewNote={setNewNote}
                newCarePlan={newCarePlan}
                setNewCarePlan={setNewCarePlan}
                saveClinicalData={saveClinicalData}
                isSavingClinical={isSavingClinical}
                onClose={() => setSelectedPatient(null)}
                milestones={childMilestones}
            />

            {/* Edit Child Modal */}
            {editingChild && (
                <ModalPortal>
                    <div className="modal-overlay">
                        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col border-4 border-amber-50" style={{ zIndex: 9999 }}>
                            <div className="p-8 border-b border-amber-50 flex justify-between items-center bg-amber-50/30">
                                <h3 className="text-xl font-black flex items-center gap-3 text-amber-900 uppercase tracking-tighter">
                                    <Pencil size={24} /> Editar Dados: {editingChild.name}
                                </h3>
                                <button onClick={() => setEditingChild(null)} className="p-3 rounded-full hover:bg-amber-100 transition-colors text-amber-950">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="p-8 overflow-y-auto flex-1 bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nome Completo</label>
                                        <input type="text" className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-amber-500 focus:bg-white transition-all font-bold" value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Data de Nascimento</label>
                                        <input type="date" className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-amber-500 focus:bg-white transition-all font-bold text-amber-700" value={editForm.birth_date || ''} onChange={e => setEditForm({ ...editForm, birth_date: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Sexo Biológico</label>
                                        <select className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-amber-500 focus:bg-white transition-all font-bold" value={editForm.gender || 'Masculino'} onChange={e => setEditForm({ ...editForm, gender: e.target.value })}>
                                            <option value="Masculino">Masculino</option>
                                            <option value="Feminino">Feminino</option>
                                            <option value="Não informado">N/I</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Risco Clínico</label>
                                        <select className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-amber-500 focus:bg-white transition-all font-bold" value={editForm.risk_level || 'Baixo'} onChange={e => setEditForm({ ...editForm, risk_level: e.target.value })}>
                                            <option value="Baixo">Baixo (Habitual)</option>
                                            <option value="Moderado">Moderado</option>
                                            <option value="Alto">Alto Risco</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Responsável</label>
                                        <input type="text" className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-amber-500 focus:bg-white transition-all font-bold" value={editForm.guardian_name || ''} onChange={e => setEditForm({ ...editForm, guardian_name: e.target.value })} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Observações / Antecedentes</label>
                                        <textarea className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-amber-500 focus:bg-white transition-all font-bold" rows={3} value={editForm.observations || ''} onChange={e => setEditForm({ ...editForm, observations: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 border-t bg-gray-50 flex justify-end gap-4">
                                <button onClick={() => setEditingChild(null)} className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-500 rounded-2xl font-black text-sm uppercase tracking-widest border-2 border-gray-100 transition-all">Cancelar</button>
                                <button onClick={handleSaveEdit} disabled={isSavingEdit} className="px-10 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-amber-100 transition-all flex items-center gap-2">
                                    {isSavingEdit ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Atualizar Cadastro</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}
        </div>
    );
}
