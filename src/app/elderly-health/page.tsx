'use client';

import { useState, useEffect } from 'react';
import { Activity, ClipboardList, Loader2, Search, HeartPulse, MessageCircle, Pencil, Save, X, Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import ModalPortal from '@/components/ModalPortal';

interface Patient {
    id: string;
    name: string;
    age: number;
    phone: string;
    risk_level: string;
    clinical_data?: any;
    _table?: 'pregnant_women' | 'chronic_patients'; // internal use
}

export default function ElderlyHealthPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const supabase = createClient();

    const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
    const [editForm, setEditForm] = useState<Partial<Patient>>({});
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    // Clinical modal
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [clinicalData, setClinicalData] = useState<any>({});
    const [isSavingClinical, setIsSavingClinical] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [newCarePlan, setNewCarePlan] = useState('');

    useEffect(() => {
        loadPatients();
    }, []);

    async function loadPatients() {
        setIsLoading(true);
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (userData.user) {
                const uid = userData.user.id;

                const [pwRes, cpRes] = await Promise.all([
                    supabase.from('pregnant_women').select('id, name, age, phone, risk_level, clinical_data').eq('user_id', uid),
                    supabase.from('chronic_patients').select('id, name, age, phone, risk_level, clinical_data').eq('user_id', uid)
                ]);

                const pwData = (pwRes.data || []).map((p: any) => ({ ...p, _table: 'pregnant_women' as const }));
                const cpData = (cpRes.data || []).map((p: any) => ({ ...p, _table: 'chronic_patients' as const }));

                const allPatients = [...pwData, ...cpData];
                const seen = new Set<string>();
                const elderly = allPatients.filter(p => {
                    if (seen.has(p.id) || (p.age ?? 0) < 60) return false;
                    seen.add(p.id);
                    return true;
                }).sort((a, b) => a.name.localeCompare(b.name));

                setPatients(elderly);
            }
        } catch (error) {
            console.error('Error loading elderly patients:', error);
        } finally {
            setIsLoading(false);
        }
    }

    function openEditModal(patient: Patient) {
        setEditingPatient(patient);
        setEditForm({ ...patient });
        setSelectedPatient(null);
    }

    async function handleSaveEdit() {
        if (!editingPatient) return;
        setIsSavingEdit(true);
        try {
            const table = editingPatient._table || 'chronic_patients';
            const { error } = await supabase
                .from(table)
                .update({
                    name: editForm.name,
                    age: editForm.age,
                    phone: editForm.phone,
                    risk_level: editForm.risk_level,
                })
                .eq('id', editingPatient.id);
            if (error) throw error;
            setPatients(prev => prev.map(p => p.id === editingPatient.id ? { ...p, ...editForm } as Patient : p));
            setEditingPatient(null);
        } catch (err) {
            alert('Erro ao salvar: ' + (err as any)?.message);
        } finally {
            setIsSavingEdit(false);
        }
    }

    function openClinicalModal(patient: Patient) {
        setSelectedPatient(patient);
        setClinicalData(patient.clinical_data || {});
        setNewNote('');
        setNewCarePlan('');
        setEditingPatient(null);
    }

    async function saveClinicalData() {
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
            const table = selectedPatient._table || 'chronic_patients';
            const { error } = await supabase
                .from(table)
                .update({ clinical_data: updatedClinicalData })
                .eq('id', selectedPatient.id);
            if (error) throw error;
            setPatients(prev => prev.map(p => p.id === selectedPatient.id ? { ...p, clinical_data: updatedClinicalData } : p));
            setClinicalData(updatedClinicalData);
            setNewNote('');
            setNewCarePlan('');
        } catch {
            alert('Não foi possível salvar.');
        } finally {
            setIsSavingClinical(false);
        }
    }

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const inputCls = "w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/40";

    return (
        <div className="flex flex-col h-full gap-6">
            <div>
                <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
                    <Activity className="text-primary" /> Saúde do Idoso
                </h2>
                <p className="text-muted">Protocolo de Avaliação Multidimensional e Imunossenescência.</p>
            </div>

            {/* Protocolos Fixos */}
            <div className="card">
                <h3 className="flex items-center gap-2 mb-6 text-primary font-bold">
                    <ClipboardList size={20} /> Avaliação Geriátrica Ampla (AGA)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 border rounded bg-surface">
                        <h4 className="flex items-center gap-2 mb-2 font-bold text-sm"><Activity size={16} /> Equilíbrio e Marcha</h4>
                        <p className="text-xs text-muted">Aferir risco de quedas via Timed Up and Go (TUG). Revisar segurança doméstica. CIAP-2: A04</p>
                    </div>
                    <div className="p-4 border rounded bg-surface">
                        <h4 className="flex items-center gap-2 mb-2 font-bold text-sm"><Activity size={16} /> Rastreio Cognitivo e Crônicos</h4>
                        <p className="text-xs text-muted">Aplicar Mini-Mental. Monitorar PA e Glicemia. CIAP-2: P70 (Demência), P20 (Memória) e T90 (DM2).</p>
                    </div>
                    <div className="p-4 border rounded bg-surface">
                        <h4 className="flex items-center gap-2 mb-2 font-bold text-sm"><Activity size={16} /> Vacinação e Imunossenescência</h4>
                        <p className="text-xs text-muted">Verificar e aplicar: Influenza (anual), Pneumocócica 23, Hepatite B e dT (Dupla Adulto).</p>
                    </div>
                </div>
            </div>

            {/* Lista de Pacientes */}
            <div className="card flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
                        <HeartPulse className="text-rose-500" size={20} /> Pacientes Idosos (60+ anos) — {filteredPatients.length}
                    </h3>
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar paciente..."
                            className={`${inputCls} pl-9`}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto flex-1 h-full min-h-[300px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="animate-spin text-primary" size={32} />
                        </div>
                    ) : patients.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted">
                            <p>Nenhum paciente com 60 anos ou mais cadastrado.</p>
                            <p className="text-xs mt-1">Os pacientes são integrados automaticamente pelo cadastro unificado.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b text-muted text-xs uppercase tracking-wider">
                                    <th className="p-3">Paciente</th>
                                    <th className="p-3">Idade</th>
                                    <th className="p-3">Risco</th>
                                    <th className="p-3 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPatients.map(p => (
                                    <tr key={p.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="p-3">
                                            <span className="font-bold block text-sm">{p.name}</span>
                                            {p.phone && <span className="text-xs text-muted">{p.phone}</span>}
                                        </td>
                                        <td className="p-3 text-sm text-gray-600 dark:text-gray-400">
                                            {p.age} anos
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.risk_level === 'Alto' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {p.risk_level || 'Habitual'}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex justify-center gap-2">
                                                {p.phone ? (
                                                    <a
                                                        href={`https://wa.me/55${p.phone?.replace(/\D/g, '')}?text=Olá ${encodeURIComponent(p.name.split(' ')[0])}, aqui é a enfermagem da UBS. Tudo bem?`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg transition-colors flex items-center gap-1 text-xs"
                                                    >
                                                        <MessageCircle size={14} /> WhatsApp
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-muted italic">Sem telefone</span>
                                                )}
                                                <button
                                                    onClick={() => openEditModal(p)}
                                                    className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                                                    title="Editar dados"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={() => openClinicalModal(p)}
                                                    className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-1 text-xs"
                                                    title="Acompanhamento clínico"
                                                >
                                                    <CheckCircle size={14} /> <span className="hidden md:inline font-bold uppercase">Acompanhar</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <div className="mt-auto border-t pt-4 text-center text-xs text-muted">
                <p>Baseado na Lei 7.498/86 e Decreto 94.406/87. Consulte sempre os Manuais do MS e Protocolos Municipais.</p>
            </div>

            {/* Modal de Edição */}
            {editingPatient && (
                <ModalPortal>
                    <div className="modal-overlay">
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col border" style={{ borderColor: '#fde68a' }}>
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
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nome Completo</label>
                                        <input type="text" className={inputCls} value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Idade (anos)</label>
                                        <input type="number" className={inputCls} value={editForm.age || ''} onChange={e => setEditForm({ ...editForm, age: parseInt(e.target.value) })} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Telefone / WhatsApp</label>
                                        <input type="tel" className={inputCls} value={editForm.phone || ''} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nível de Risco</label>
                                        <select className={inputCls} value={editForm.risk_level || 'Baixo'} onChange={e => setEditForm({ ...editForm, risk_level: e.target.value })}>
                                            <option value="Baixo">Baixo / Habitual</option>
                                            <option value="Moderado">Moderado</option>
                                            <option value="Alto">Alto</option>
                                        </select>
                                    </div>
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

            {/* Modal Acompanhamento Clínico */}
            {selectedPatient && (
                <ModalPortal>
                    <div className="modal-overlay">
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-primary">
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
                                                        <span className="text-xs font-semibold text-primary">
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
                                        <Plus size={16} /> Nova Nota / Evolução
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-muted block mb-1">Observações Clínicas</label>
                                            <textarea className={inputCls} placeholder="Sintomas, sinais vitais, exames..." rows={4} value={newNote} onChange={e => setNewNote(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold block mb-1" style={{ color: '#2563eb' }}>Plano de Autocuidado</label>
                                            <textarea className={inputCls} placeholder="Metas, orientações, encaminhamentos..." rows={4} value={newCarePlan} onChange={e => setNewCarePlan(e.target.value)} style={{ borderColor: '#bfdbfe', background: 'rgba(239,246,255,0.3)' }} />
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
                                <span className="text-[10px] text-muted flex-1">✨ Cada nota é salva permanentemente no prontuário.</span>
                                <button onClick={() => setSelectedPatient(null)} className="btn btn-outline">Fechar</button>
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}
        </div>
    );
}
