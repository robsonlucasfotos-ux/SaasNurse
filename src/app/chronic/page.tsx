'use client';

import { useState, useEffect } from 'react';
import {
    Stethoscope, Plus, Search, Loader2, AlertTriangle,
    CheckCircle, MessageCircle, ExternalLink, Calendar,
    Activity, TrendingDown, Thermometer, Droplets
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
}

export default function ChronicPage() {
    const [patients, setPatients] = useState<ChronicPatient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'Todas' | 'HAS' | 'DM' | 'HAS e DM'>('Todas');

    const [newPatient, setNewPatient] = useState<Partial<ChronicPatient>>({
        condition: 'HAS',
        risk_level: 'Baixo'
    });

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
            setNewPatient({ condition: 'HAS', risk_level: 'Baixo' });
            loadPatients();
        } catch (error) {
            console.error('Error adding patient:', error);
            alert('Erro ao salvar paciente.');
        } finally {
            setIsLoading(false);
        }
    }

    const filteredPatients = patients.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'Todas' || p.condition === filter;
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
                        <select className="input" onChange={e => setNewPatient({ ...newPatient, condition: e.target.value as any })}>
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
                                                </div>
                                            </td>
                                            <td className="p-3 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.condition === 'HAS' ? 'bg-blue-100 text-blue-700' : p.condition === 'DM' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
                                                        {p.condition}
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
                                                    <button onClick={() => window.open(`https://wa.me/55${p.phone?.replace(/\D/g, '')}`, '_blank')} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                                        <MessageCircle size={14} />
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
        </div>
    );
}
