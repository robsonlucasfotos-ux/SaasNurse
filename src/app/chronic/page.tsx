'use client';

import { useState, useEffect } from 'react';
import {
    Stethoscope, Plus, Search, Loader2, AlertTriangle,
    CheckCircle, MessageCircle, Activity, TrendingDown, Pencil,
    Save, X, Calendar, HeartPulse
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface ChronicPatient {
    id: string;
    name: string;
    age: number;
    phone: string;
    condition: 'HAS' | 'DM' | 'HAS e DM';
    risk_level: 'Baixo' | 'Moderado' | 'Alto';
    last_bp_check: string | null;
    last_hba1c: number | null;
    last_hba1c_date: string | null;
    insulin_expiry_date: string | null;
    medications: string;
    observations: string;
    clinical_data?: any;
}

const EMPTY_PATIENT: Partial<ChronicPatient> = {
    condition: 'HAS',
    risk_level: 'Baixo',
    name: '',
    age: undefined,
    phone: '',
    medications: '',
    observations: '',
    last_bp_check: null,
    last_hba1c: undefined,
    insulin_expiry_date: null,
};

export default function ChronicPage() {
    const [patients, setPatients] = useState<ChronicPatient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'Todas' | 'HAS' | 'DM' | 'HAS e DM'>('Todas');

    const [newPatient, setNewPatient] = useState<Partial<ChronicPatient>>(EMPTY_PATIENT);

    // Edit Modal State
    const [editingPatient, setEditingPatient] = useState<ChronicPatient | null>(null);
    const [editForm, setEditForm] = useState<Partial<ChronicPatient>>({});
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    // Clinical Follow-up Modal State
    const [selectedPatient, setSelectedPatient] = useState<ChronicPatient | null>(null);
    const [clinicalData, setClinicalData] = useState<any>({});
    const [isSavingClinical, setIsSavingClinical] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [newCarePlan, setNewCarePlan] = useState('');

    const supabase = createClient();

    useEffect(() => {
        loadPatients();
    }, []);

    async function loadPatients() {
        setIsLoading(true);
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (userData.user) {
                const { data, error } = await supabase
                    .from('chronic_patients')
                    .select('*')
                    .eq('user_id', userData.user.id)
                    .order('name');

                if (error) throw error;
                setPatients(data || []);
            }
        } catch (error) {
            console.error('Error loading chronic patients:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleAddPatient(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) return;

            const { error } = await supabase
                .from('chronic_patients')
                .insert([{ ...newPatient, user_id: userData.user.id }]);

            if (error) throw error;

            setIsAdding(false);
            setNewPatient(EMPTY_PATIENT);
            loadPatients();
        } catch (error) {
            console.error('Error adding patient:', error);
            alert('Erro ao salvar paciente: ' + (error as any)?.message);
        } finally {
            setIsLoading(false);
        }
    }

    function openEditModal(patient: ChronicPatient) {
        setEditingPatient(patient);
        setEditForm({ ...patient });
        setSelectedPatient(null);
    }

    async function handleSaveEdit() {
        if (!editingPatient) return;
        setIsSavingEdit(true);
        try {
            const { error } = await supabase
                .from('chronic_patients')
                .update({
                    name: editForm.name,
                    age: editForm.age,
                    phone: editForm.phone,
                    condition: editForm.condition,
                    risk_level: editForm.risk_level,
                    last_bp_check: editForm.last_bp_check || null,
                    last_hba1c: editForm.last_hba1c || null,
                    last_hba1c_date: editForm.last_hba1c_date || null,
                    insulin_expiry_date: editForm.insulin_expiry_date || null,
                    medications: editForm.medications,
                    observations: editForm.observations,
                })
                .eq('id', editingPatient.id);

            if (error) throw error;

            setPatients(prev => prev.map(p => p.id === editingPatient.id ? { ...p, ...editForm } as ChronicPatient : p));
            setEditingPatient(null);
            setEditForm({});
        } catch (error) {
            console.error('Error updating patient:', error);
            alert('Erro ao atualizar: ' + (error as any)?.message);
        } finally {
            setIsSavingEdit(false);
        }
    }

    const openClinicalModal = (patient: ChronicPatient) => {
        setSelectedPatient(patient);
        setClinicalData(patient.clinical_data || {});
        setNewNote('');
        setNewCarePlan('');
        setEditingPatient(null);
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
                .from('chronic_patients')
                .update({ clinical_data: updatedClinicalData })
                .eq('id', selectedPatient.id);

            if (error) throw error;

            // Fica aberto — estilo Google Keep: atualiza lista e limpa campos
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

    const filteredPatients = patients.filter(p => {
        const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'Todas' || p.condition === filter;
        return matchesSearch && matchesFilter;
    });

    const getBPOverdue = (date: string | null) => {
        if (!date) return true;
        const lastCheck = new Date(date);
        const diffMonths = (new Date().getFullYear() - lastCheck.getFullYear()) * 12 + (new Date().getMonth() - lastCheck.getMonth());
        return diffMonths >= 3;
    };

    const getInsulinAlert = (date: string | null) => {
        if (!date) return null;
        const expiry = new Date(date);
        const diff = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (diff <= 15 && diff > 0) return { type: 'warning', msg: `Insulina vence em ${diff}d` };
        if (diff <= 0) return { type: 'danger', msg: 'Insulina VENCIDA!' };
        return null;
    };

    const inputCls = "w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/40";
    const labelCls = "block text-[10px] font-bold text-gray-500 uppercase mb-1";

    return (
        <div className="flex flex-col h-full gap-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="flex items-center gap-2">
                        <Stethoscope className="text-primary" /> Hiperdia Inteligente
                    </h2>
                    <p className="text-muted">Monitoramento ativo de Hipertensos e Diabéticos.</p>
                </div>
                <button
                    onClick={() => { setIsAdding(!isAdding); setEditingPatient(null); setSelectedPatient(null); }}
                    className="btn btn-primary flex items-center gap-2"
                >
                    {isAdding ? 'Cancelar' : <><Plus size={18} /> Novo Paciente</>}
                </button>
            </div>

            {/* Analytics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Total Crônicos</span>
                    <p className="text-2xl font-black text-blue-900 dark:text-blue-100">{patients.length}</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800">
                    <span className="text-[10px] font-bold text-red-600 uppercase">PA Pendente (+3m)</span>
                    <p className="text-2xl font-black text-red-900 dark:text-red-100">
                        {patients.filter(p => getBPOverdue(p.last_bp_check)).length}
                    </p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800">
                    <span className="text-[10px] font-bold text-orange-600 uppercase">Alerta Insulina</span>
                    <p className="text-2xl font-black text-orange-900 dark:text-orange-100">
                        {patients.filter(p => getInsulinAlert(p.insulin_expiry_date)).length}
                    </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
                    <span className="text-[10px] font-bold text-green-600 uppercase">HbA1c na Meta</span>
                    <p className="text-2xl font-black text-green-900 dark:text-green-100">
                        {patients.filter(p => p.last_hba1c && p.last_hba1c < 7).length}
                    </p>
                </div>
            </div>

            {/* Add Form */}
            {isAdding && (
                <form onSubmit={handleAddPatient} className="card bg-surface p-6 animate-in slide-in-from-top duration-300">
                    <h3 className="mb-4">Cadastrar Paciente Crônico</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div><label className={labelCls}>Nome *</label><input type="text" className={inputCls} required onChange={e => setNewPatient({ ...newPatient, name: e.target.value })} /></div>
                        <div><label className={labelCls}>Idade</label><input type="number" className={inputCls} onChange={e => setNewPatient({ ...newPatient, age: parseInt(e.target.value) })} /></div>
                        <div><label className={labelCls}>Telefone/WhatsApp</label><input type="text" className={inputCls} onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })} /></div>
                        <div>
                            <label className={labelCls}>Condição *</label>
                            <select className={inputCls} onChange={e => setNewPatient({ ...newPatient, condition: e.target.value as any })}>
                                <option value="HAS">Hipertensão (HAS)</option>
                                <option value="DM">Diabetes (DM)</option>
                                <option value="HAS e DM">Ambos (HAS e DM)</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>Risco</label>
                            <select className={inputCls} onChange={e => setNewPatient({ ...newPatient, risk_level: e.target.value as any })}>
                                <option value="Baixo">Risco Baixo</option>
                                <option value="Moderado">Risco Moderado</option>
                                <option value="Alto">Risco Alto</option>
                            </select>
                        </div>
                        <div><label className={labelCls}>Última PA</label><input type="date" className={inputCls} onChange={e => setNewPatient({ ...newPatient, last_bp_check: e.target.value })} /></div>
                        <div><label className={labelCls}>HbA1c (%)</label><input type="number" step="0.1" className={inputCls} onChange={e => setNewPatient({ ...newPatient, last_hba1c: parseFloat(e.target.value) })} /></div>
                        <div><label className={labelCls}>Venc. Receita Insulina</label><input type="date" className={inputCls} onChange={e => setNewPatient({ ...newPatient, insulin_expiry_date: e.target.value })} /></div>
                        <div className="md:col-span-3"><label className={labelCls}>Medicações</label><input type="text" className={inputCls} placeholder="Ex: Losartana 50mg, Metformina 850mg..." onChange={e => setNewPatient({ ...newPatient, medications: e.target.value })} /></div>
                        <div className="md:col-span-3"><label className={labelCls}>Observações</label><textarea className={inputCls} rows={2} onChange={e => setNewPatient({ ...newPatient, observations: e.target.value })} /></div>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Salvando...' : 'Salvar Paciente'}
                        </button>
                    </div>
                </form>
            )}

            {/* Patient Table */}
            <div className="card flex-1 flex flex-col min-h-0">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <input type="text" placeholder="Buscar por nome..." className={`${inputCls} pl-10`} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {(['Todas', 'HAS', 'DM', 'HAS e DM'] as const).map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'}`}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto flex-1 h-full min-h-[300px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="animate-spin text-primary" size={32} />
                        </div>
                    ) : filteredPatients.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted gap-2">
                            <Stethoscope size={40} className="opacity-30" />
                            <p className="text-sm">Nenhum paciente encontrado.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b text-muted text-xs uppercase tracking-wider">
                                    <th className="p-3">Paciente</th>
                                    <th className="p-3">Condição / Risco</th>
                                    <th className="p-3">Monitoramento</th>
                                    <th className="p-3">Alertas</th>
                                    <th className="p-3 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPatients.map(p => {
                                    const insulinAlert = getInsulinAlert(p.insulin_expiry_date);
                                    const bpOverdue = getBPOverdue(p.last_bp_check);

                                    return (
                                        <tr key={p.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="p-3">
                                                <div className="flex flex-col">
                                                    <span className="font-bold">{p.name}</span>
                                                    <span className="text-[10px] text-muted">{p.age} anos</span>
                                                    {p.phone && (
                                                        <a href={`https://wa.me/55${p.phone?.replace(/\D/g, '')}?text=Olá ${encodeURIComponent(p.name?.split(' ')[0])}, aqui é a enfermagem da UBS.`}
                                                            target="_blank" rel="noopener noreferrer"
                                                            className="flex items-center gap-1 mt-1 text-[10px] text-[#25D366] hover:underline font-semibold">
                                                            <MessageCircle size={11} /> {p.phone}
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3 text-sm">
                                                <div className="flex flex-wrap items-center gap-1">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.condition === 'HAS' ? 'bg-blue-100 text-blue-700' : p.condition === 'DM' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>{p.condition}</span>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.risk_level === 'Alto' ? 'bg-red-100 text-red-700' : p.risk_level === 'Moderado' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{p.risk_level}</span>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1 text-[11px]">
                                                        <Activity size={12} className={bpOverdue ? 'text-red-500' : 'text-green-500'} />
                                                        <span>PA: {p.last_bp_check ? new Date(p.last_bp_check).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/A'}</span>
                                                    </div>
                                                    {p.condition !== 'HAS' && (
                                                        <div className="flex items-center gap-1 text-[11px]">
                                                            <TrendingDown size={12} className={p.last_hba1c && p.last_hba1c > 7 ? 'text-red-500' : 'text-green-500'} />
                                                            <span>HbA1c: {p.last_hba1c ? `${p.last_hba1c}%` : 'N/A'}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {insulinAlert && (
                                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${insulinAlert.type === 'danger' ? 'bg-red-600 text-white animate-pulse' : 'bg-orange-100 text-orange-700'}`}>
                                                            {insulinAlert.msg}
                                                        </span>
                                                    )}
                                                    {bpOverdue && (
                                                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-red-100 text-red-700">PA ATRASADA</span>
                                                    )}
                                                    {!insulinAlert && !bpOverdue && (
                                                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-100 text-green-700 uppercase">ESTABILIZADO</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3 text-center">
                                                <div className="flex justify-center gap-2">
                                                    {p.phone ? (
                                                        <a href={`https://wa.me/55${p.phone?.replace(/\D/g, '')}?text=Olá ${encodeURIComponent(p.name?.split(' ')[0])}, aqui é a enfermagem da UBS. Tudo bem?`}
                                                            target="_blank" rel="noopener noreferrer"
                                                            className="p-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg transition-colors" title="WhatsApp">
                                                            <MessageCircle size={14} />
                                                        </a>
                                                    ) : (
                                                        <button disabled className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed"><MessageCircle size={14} /></button>
                                                    )}
                                                    <button
                                                        onClick={() => openEditModal(p)}
                                                        className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                                                        title="Editar Dados do Paciente"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => openClinicalModal(p)}
                                                        className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-1"
                                                        title="Acompanhamento Clínico"
                                                    >
                                                        <CheckCircle size={14} />
                                                        <span className="text-[10px] uppercase font-bold hidden md:inline">Acompanhar</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* ============================================================ */}
            {/* MODAL DE EDIÇÃO — renderizado na raiz para position:fixed     */}
            {/* ============================================================ */}
            {editingPatient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col border border-amber-200 dark:border-amber-900/50 animate-in zoom-in-95 duration-200">
                        <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center bg-amber-50 dark:bg-amber-900/10">
                            <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                                <Pencil size={20} />
                                Editar Paciente: <span className="text-amber-600">{editingPatient.name}</span>
                            </h3>
                            <button onClick={() => setEditingPatient(null)} className="p-2 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-full transition-colors">
                                <X size={20} className="text-amber-600" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className={labelCls}>Nome Completo *</label>
                                    <input type="text" className={inputCls} value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className={labelCls}>Idade</label>
                                    <input type="number" className={inputCls} value={editForm.age || ''} onChange={e => setEditForm({ ...editForm, age: parseInt(e.target.value) })} />
                                </div>
                                <div>
                                    <label className={labelCls}>Telefone / WhatsApp</label>
                                    <input type="text" className={inputCls} value={editForm.phone || ''} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                                </div>
                                <div>
                                    <label className={labelCls}>Condição Crônica</label>
                                    <select className={inputCls} value={editForm.condition || 'HAS'} onChange={e => setEditForm({ ...editForm, condition: e.target.value as any })}>
                                        <option value="HAS">Hipertensão (HAS)</option>
                                        <option value="DM">Diabetes (DM)</option>
                                        <option value="HAS e DM">Ambos (HAS e DM)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>Nível de Risco</label>
                                    <select className={inputCls} value={editForm.risk_level || 'Baixo'} onChange={e => setEditForm({ ...editForm, risk_level: e.target.value as any })}>
                                        <option value="Baixo">Risco Baixo</option>
                                        <option value="Moderado">Risco Moderado</option>
                                        <option value="Alto">Risco Alto</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>Última Aferição de PA</label>
                                    <input type="date" className={inputCls} value={editForm.last_bp_check || ''} onChange={e => setEditForm({ ...editForm, last_bp_check: e.target.value })} />
                                </div>
                                <div>
                                    <label className={labelCls}>HbA1c Recente (%)</label>
                                    <input type="number" step="0.1" className={inputCls} value={editForm.last_hba1c || ''} onChange={e => setEditForm({ ...editForm, last_hba1c: parseFloat(e.target.value) })} />
                                </div>
                                <div>
                                    <label className={labelCls}>Data HbA1c</label>
                                    <input type="date" className={inputCls} value={editForm.last_hba1c_date || ''} onChange={e => setEditForm({ ...editForm, last_hba1c_date: e.target.value })} />
                                </div>
                                <div>
                                    <label className={labelCls}>Vencimento Receita Insulina</label>
                                    <input type="date" className={inputCls} value={editForm.insulin_expiry_date || ''} onChange={e => setEditForm({ ...editForm, insulin_expiry_date: e.target.value })} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelCls}>Medicações em Uso</label>
                                    <input type="text" className={inputCls} placeholder="Ex: Losartana 50mg, Metformina 850mg..." value={editForm.medications || ''} onChange={e => setEditForm({ ...editForm, medications: e.target.value })} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelCls}>Observações Clínicas</label>
                                    <textarea className={inputCls} rows={3} value={editForm.observations || ''} onChange={e => setEditForm({ ...editForm, observations: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
                            <button onClick={() => setEditingPatient(null)} className="btn btn-outline">Cancelar</button>
                            <button onClick={handleSaveEdit} disabled={isSavingEdit} className="btn flex items-center gap-2 bg-amber-500 hover:bg-amber-600 border-none text-white">
                                {isSavingEdit ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Salvar Alterações</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================================================ */}
            {/* MODAL DE ACOMPANHAMENTO CLÍNICO — renderizado na raiz         */}
            {/* ============================================================ */}
            {selectedPatient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-primary animate-in fade-in zoom-in-95">
                        <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                            <div>
                                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                    <CheckCircle size={20} />
                                    Prontuário: {selectedPatient.name}
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
                            {/* Histórico estilo Google Keep */}
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
                                            <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-center mb-2 pb-1 border-b dark:border-gray-700 border-dashed">
                                                    <span className="text-xs font-semibold text-primary flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {new Date(note.date).toLocaleDateString('pt-BR')} {new Date(note.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {index === 0 && <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">RECENTE</span>}
                                                </div>
                                                {note.text && <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{note.text}</p>}
                                                {note.carePlan && (
                                                    <div className="bg-blue-50 dark:bg-blue-900/10 p-2 rounded border border-blue-100 dark:border-blue-900/30 mt-2">
                                                        <strong className="text-xs text-blue-700 dark:text-blue-400 block mb-0.5">Plano / Autocuidado:</strong>
                                                        <p className="text-sm text-blue-800 dark:text-blue-300 whitespace-pre-wrap">{note.carePlan}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Nova Evolução */}
                            <div className="card p-4 border-primary/20 bg-primary/5">
                                <h4 className="font-semibold border-b border-primary/20 pb-2 mb-3 text-primary flex items-center gap-2">
                                    <Plus size={16} /> Nova Evolução
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelCls}>Quadro Clínico / Observações</label>
                                        <textarea className={inputCls} placeholder="Sintomas, queixas, sinais vitais, exames..." rows={4} value={newNote} onChange={e => setNewNote(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1">Plano de Autocuidado / Ação</label>
                                        <textarea className={`${inputCls} border-blue-200 focus:border-blue-400 bg-blue-50/30`} placeholder="Metas, orientações, ajustes, encaminhamentos..." rows={4} value={newCarePlan} onChange={e => setNewCarePlan(e.target.value)} />
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
                            <span className="text-[10px] text-muted flex-1">✨ Cada nota é salva na linha do tempo do paciente.</span>
                            <button onClick={() => setSelectedPatient(null)} className="btn btn-outline">Fechar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
