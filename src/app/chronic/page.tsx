'use client';

import { useState, useEffect } from 'react';
import {
    Stethoscope, Plus, Search, Loader2, AlertTriangle,
    CheckCircle, MessageCircle, ExternalLink, Calendar,
    Activity, TrendingDown, Thermometer, Droplets, Phone, HeartPulse
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface ChronicPatient {
    id: string;
    name: string;
    age: number;
    phone: string;
    chronic_condition: 'HAS' | 'DM' | 'HAS e DM';
    risk_level: 'Baixo' | 'Moderado' | 'Alto';
    last_bp_check: string | null;
    last_hba1c: number | null;
    last_hba1c_date: string | null;
    insulin_expiry_date: string | null;
    medications: string;
    observations: string;
    clinical_data?: any; // JSONB
}

export default function ChronicPage() {
    const [patients, setPatients] = useState<ChronicPatient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'Todas' | 'HAS' | 'DM' | 'HAS e DM'>('Todas');

    const [newPatient, setNewPatient] = useState<Partial<ChronicPatient>>({
        chronic_condition: 'HAS',
        risk_level: 'Baixo'
    });

    // Clinical Follow-up Modal State
    const [selectedPatient, setSelectedPatient] = useState<ChronicPatient | null>(null);
    const [clinicalData, setClinicalData] = useState<any>({});
    const [isSavingClinical, setIsSavingClinical] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [newCarePlan, setNewCarePlan] = useState('');

    const supabase = createClient();

    useEffect(() => {
        loadPatients();
    }, [supabase]);

    async function loadPatients() {
        setIsLoading(true);
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (userData.user) {
                const { data, error } = await supabase
                    .from('patients')
                    .select('*')
                    .eq('is_chronic', true)
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
                .from('patients')
                .insert([{ ...newPatient, is_chronic: true, user_id: userData.user.id }]);

            if (error) throw error;

            setIsAdding(false);
            setNewPatient({ chronic_condition: 'HAS', risk_level: 'Baixo' });
            loadPatients();
        } catch (error) {
            console.error('Error adding patient:', error);
            alert('Erro ao salvar paciente.');
        } finally {
            setIsLoading(false);
        }
    }

    const openClinicalModal = (patient: ChronicPatient) => {
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

            setPatients(patients.map(p => p.id === selectedPatient.id ? { ...p, clinical_data: updatedClinicalData } : p));
            setSelectedPatient(null);
            alert("Acompanhamento salvo com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar acompanhamento:", error);
            alert("Não foi possível salvar o acompanhamento.");
        } finally {
            setIsSavingClinical(false);
        }
    };

    const filteredPatients = patients.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'Todas' || p.chronic_condition === filter;
        return matchesSearch && matchesFilter;
    });

    // Alert Logic
    const getInsulinAlert = (date: string | null) => {
        if (!date) return null;
        const expiry = new Date(date);
        const diff = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (diff <= 15 && diff > 0) return { type: 'warning', msg: `Vence em ${diff} dias` };
        if (diff <= 0) return { type: 'danger', msg: 'Vencida!' };
        return null;
    };

    const getBPOverdue = (date: string | null) => {
        if (!date) return true;
        const lastCheck = new Date(date);
        const diffMonths = (new Date().getFullYear() - lastCheck.getFullYear()) * 12 + (new Date().getMonth() - lastCheck.getMonth());
        return diffMonths >= 3;
    };

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="flex items-center gap-2">
                        <Stethoscope className="text-primary" /> Hiperdia Inteligente
                    </h2>
                    <p className="text-muted">Monitoramento ativo de Hipertensos e Diabéticos.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn btn-primary flex items-center gap-2"
                >
                    {isAdding ? 'Cancelar' : <><Plus size={18} /> Novo Paciente</>}
                </button>
            </div>

            {/* Analytics Brief */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Total Crônicos</span>
                    <p className="text-2xl font-black text-blue-900 dark:text-blue-100">{patients.length}</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800">
                    <span className="text-[10px] font-bold text-red-600 uppercase">PA Pendente (+3 meses)</span>
                    <p className="text-2xl font-black text-red-900 dark:text-red-100">
                        {patients.filter(p => getBPOverdue(p.last_bp_check)).length}
                    </p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800">
                    <span className="text-[10px] font-bold text-orange-600 uppercase">Receita Insulina (Alerta)</span>
                    <p className="text-2xl font-black text-orange-900 dark:text-orange-100">
                        {patients.filter(p => getInsulinAlert(p.insulin_expiry_date)).length}
                    </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
                    <span className="text-[10px] font-bold text-green-600 uppercase">HbA1c na Meta (&lt;7%)</span>
                    <p className="text-2xl font-black text-green-900 dark:text-green-100">
                        {patients.filter(p => p.last_hba1c && p.last_hba1c < 7).length}
                    </p>
                </div>
            </div>

            {isAdding && (
                <form onSubmit={handleAddPatient} className="card bg-surface p-6 animate-in slide-in-from-top duration-300">
                    <h3 className="mb-4">Cadastrar Paciente Crônico</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text" placeholder="Nome do Paciente" className="input" required
                            onChange={e => setNewPatient({ ...newPatient, name: e.target.value })}
                        />
                        <input
                            type="number" placeholder="Idade" className="input"
                            onChange={e => setNewPatient({ ...newPatient, age: parseInt(e.target.value) })}
                        />
                        <input
                            type="text" placeholder="WhatsApp (ex: 61999999999)" className="input"
                            onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })}
                        />
                        <select className="input" onChange={e => setNewPatient({ ...newPatient, chronic_condition: e.target.value as any })}>
                            <option value="HAS">Hipertensão (HAS)</option>
                            <option value="DM">Diabetes (DM)</option>
                            <option value="HAS e DM">Ambos (HAS e DM)</option>
                        </select>
                        <select className="input" onChange={e => setNewPatient({ ...newPatient, risk_level: e.target.value as any })}>
                            <option value="Baixo">Risco Baixo</option>
                            <option value="Moderado">Risco Moderado</option>
                            <option value="Alto">Risco Alto</option>
                        </select>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold ml-1">Última Aferição PA</label>
                            <input
                                type="date" className="input"
                                onChange={e => setNewPatient({ ...newPatient, last_bp_check: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold ml-1">HbA1c Recente (%)</label>
                            <input
                                type="number" step="0.1" placeholder="Ex: 6.5" className="input"
                                onChange={e => setNewPatient({ ...newPatient, last_hba1c: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold ml-1">Vencimento Receita Insulina</label>
                            <input
                                type="date" className="input"
                                onChange={e => setNewPatient({ ...newPatient, insulin_expiry_date: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Salvando...' : 'Salvar Paciente'}
                        </button>
                    </div>
                </form>
            )}

            <div className="card flex-1 flex flex-col min-h-0">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nome..."
                            className="input pl-10 w-full"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        {['Todas', 'HAS', 'DM', 'HAS e DM'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto flex-1 h-full min-h-[400px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="animate-spin text-primary" size={32} />
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b text-muted text-xs uppercase tracking-wider">
                                    <th className="p-3">Paciente</th>
                                    <th className="p-3">Condição / Risco</th>
                                    <th className="p-3">Monitoramento Metas</th>
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
                                                        <a
                                                            href={`https://wa.me/55${p.phone?.replace(/\D/g, '')}?text=Olá ${encodeURIComponent(p.name.split(' ')[0])}, aqui é a enfermagem da UBS. Tudo bem?`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1 mt-1 text-[10px] text-[#25D366] hover:underline font-semibold"
                                                            title="Chamar no WhatsApp"
                                                        >
                                                            <MessageCircle size={11} /> {p.phone}
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.chronic_condition === 'HAS' ? 'bg-blue-100 text-blue-700' : p.chronic_condition === 'DM' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
                                                        {p.chronic_condition}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.risk_level === 'Alto' ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}>
                                                        {p.risk_level}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1 text-[11px]">
                                                        <Activity size={12} className={bpOverdue ? 'text-red-500' : 'text-green-500'} />
                                                        <span>PA: {p.last_bp_check ? new Date(p.last_bp_check).toLocaleDateString('pt-BR') : 'N/A'}</span>
                                                    </div>
                                                    {p.chronic_condition !== 'HAS' && (
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
                                                            Insulina: {insulinAlert.msg}
                                                        </span>
                                                    )}
                                                    {bpOverdue && (
                                                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-red-100 text-red-700">
                                                            PA ATRASADA
                                                        </span>
                                                    )}
                                                    {!insulinAlert && !bpOverdue && (
                                                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-100 text-green-700 uppercase">
                                                            ESTABILIZADO
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3 text-center">
                                                <div className="flex justify-center gap-2">
                                                    {p.phone ? (
                                                        <a
                                                            href={`https://wa.me/55${p.phone?.replace(/\D/g, '')}?text=Olá ${encodeURIComponent(p.name.split(' ')[0])}, aqui é a enfermagem da UBS. Tudo bem?`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg transition-colors"
                                                            title={`Chamar ${p.name} no WhatsApp`}
                                                        >
                                                            <MessageCircle size={14} />
                                                        </a>
                                                    ) : (
                                                        <button disabled className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed" title="Sem telefone cadastrado">
                                                            <MessageCircle size={14} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => openClinicalModal(p)}
                                                        className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-1"
                                                        title="Acompanhamento Clínico / Prontuário"
                                                    >
                                                        <CheckCircle size={14} /> <span className="text-[10px] uppercase font-bold hidden md:inline">Acompanhar</span>
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

            {/* Modal de Acompanhamento Clínico */}
            {
                selectedPatient && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-primary animate-in fade-in zoom-in-95">
                            <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                                <div>
                                    <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                        <CheckCircle size={20} />
                                        Prontuário e Acompanhamento Clínico: {selectedPatient.name}
                                    </h3>
                                    <p className="text-xs text-muted mt-1">
                                        <AlertTriangle size={12} className="inline mr-1 text-warning" />
                                        Prescrição de enfermagem baseada no protocolo local
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedPatient(null)}
                                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <Plus size={20} className="rotate-45" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">

                                {/* Histórico do Paciente */}
                                <div className="card p-4 border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20">
                                    <h4 className="font-semibold border-b dark:border-gray-700 pb-2 mb-3 bg-white dark:bg-transparent px-2 py-1 flex items-center gap-2">
                                        <Activity size={16} className="text-primary" /> Histórico de Consultas
                                    </h4>

                                    <div className="mb-4 max-h-60 overflow-y-auto pr-2 flex flex-col gap-3">
                                        {(!clinicalData?.followUps || clinicalData.followUps.length === 0) ? (
                                            <p className="text-sm text-gray-500 italic text-center py-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                                                Nenhuma evolução registrada ainda.
                                            </p>
                                        ) : (
                                            clinicalData.followUps.map((note: any, index: number) => (
                                                <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                                    <div className="flex justify-between items-center mb-2 pb-1 border-b dark:border-gray-700 border-dashed">
                                                        <span className="text-xs font-semibold text-primary flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            {new Date(note.date).toLocaleDateString('pt-BR')} às {new Date(note.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {note.text && (
                                                            <div>
                                                                <strong className="text-xs text-muted block mb-0.5">Observações Clínicas (SOAP):</strong>
                                                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{note.text}</p>
                                                            </div>
                                                        )}
                                                        {note.carePlan && (
                                                            <div className="bg-blue-50 dark:bg-blue-900/10 p-2 rounded border border-blue-100 dark:border-blue-900/30 mt-2">
                                                                <strong className="text-xs text-blue-700 dark:text-blue-400 block mb-0.5 flex items-center gap-1">
                                                                    <HeartPulse size={12} /> Plano de Ação / Autocuidado e Conduta:
                                                                </strong>
                                                                <p className="text-sm text-blue-800 dark:text-blue-300 whitespace-pre-wrap">{note.carePlan}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Nova Consulta */}
                                <div className="card p-4 border-primary/20 bg-primary/5">
                                    <h4 className="font-semibold border-b border-primary/20 pb-2 mb-3 text-primary flex items-center gap-2">
                                        <Plus size={16} /> Nova Evolução
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-semibold text-muted ml-1">Quadro Clínico (Observações / Exames)</label>
                                            <textarea
                                                className="form-control"
                                                placeholder="Sintomas, queixas, aferição de sinais vitais, avaliação de exames..."
                                                rows={4}
                                                value={newNote}
                                                onChange={e => setNewNote(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-semibold text-blue-600 ml-1">Plano de Autocuidado / Ação</label>
                                            <textarea
                                                className="form-control border-blue-200 focus:border-blue-400 bg-blue-50/30"
                                                placeholder="Metas, orientações dietéticas, ajustes, prescrição, encaminhamentos..."
                                                rows={4}
                                                value={newCarePlan}
                                                onChange={e => setNewCarePlan(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 items-center">
                                <span className="text-[10px] text-muted flex-1">✨ A nota será gravada na linha do tempo do paciente.</span>
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
                                    {isSavingClinical ? <Loader2 size={16} className="animate-spin" /> : 'Salvar Evolução'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
}
