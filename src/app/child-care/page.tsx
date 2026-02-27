'use client';

import { useState, useEffect } from 'react';
import {
    Baby, Plus, CalendarDays, Loader2, Users, CheckCircle,
    MessageCircle, Activity, Pencil, Save, X, ShieldCheck, Heart
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
    clinical_data?: any;
    created_at: string;
}

// ─── Milestones Data ───────────────────────────────────────────────────────────
const childMilestones = [
    {
        id: '2m', title: '2 Meses',
        symptoms: [
            { name: 'Marcos do Desenvolvimento', conduct: 'Sorriso social voluntário? Fixa/segue objetos 180°? Sustenta cabeça em prono?' },
            { name: 'AME e Prevenção', conduct: 'Aleitamento Materno Exclusivo. Proibido chás/água. Decúbito dorsal no berço.' },
        ],
        prescriptions: [{ med: 'Vacinas do Calendário', posology: 'Pentavalente (1D), VIP (1D), Pneumo 10V (1D), Rotavírus (1D).', pcdt: true }]
    },
    {
        id: '4m', title: '4 Meses',
        symptoms: [
            { name: 'Marcos do Desenvolvimento', conduct: 'Rola intencionalmente? Senta com apoio? Gargalhadas/sons guturais?' },
            { name: 'Segurança', conduct: 'Alertar sobre quedas e aspiração de objetos.' },
        ],
        prescriptions: [{ med: 'Vacinas do Calendário', posology: 'Pentavalente (2D), VIP (2D), Pneumo 10V (2D), Rotavírus (2D).', pcdt: true }]
    },
    {
        id: '6m', title: '6 Meses',
        symptoms: [
            { name: 'Introdução Alimentar', conduct: 'Comida amassada com garfo (nunca liquidificar). Oferta ativa de água.' },
            { name: 'Marcos', conduct: 'Senta sem apoio? Transfere objetos de mão em mão?' },
        ],
        prescriptions: [
            { med: 'Vacinas', posology: 'Pentavalente (3D), VIP (3D).', pcdt: true },
            { med: 'Sulfato Ferroso (Gotas)', posology: 'Profilaxia: 1mg/kg/dia até 24 meses.', pcdt: true },
            { med: 'Vitamina A (Megadose)', posology: '100.000 UI, VO, dose única.', pcdt: true },
        ]
    },
    {
        id: '12m', title: '12 a 24 Meses',
        symptoms: [
            { name: 'Marcos e Autonomia', conduct: 'Anda com firmeza? Sobe degraus? Frases 2-3 palavras? Aponta partes do corpo?' },
            { name: 'Saúde Bucal', conduct: 'Escovação supervisionada: pasta flúor 1000-1500ppm, qtd grão de arroz. Proibido telas antes dos 24m.' },
        ],
        prescriptions: [
            { med: '12m: Vacinas', posology: 'Tríplice Viral (1D), Pneumo 10V (reforço), Meningo C (reforço).', pcdt: true },
            { med: '15m: Vacinas', posology: 'DTP (reforço), VOP (reforço oral), Hepatite A, Tetra Viral.', pcdt: true },
            { med: 'Vitamina A', posology: '200.000 UI VO, reforço anual até 59 meses.', pcdt: true },
        ]
    }
];

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function ChildCare() {
    const supabase = createClient();
    const [children, setChildren] = useState<Child[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', birth_date: '', gender: 'Masculino', risk_level: 'Baixo', guardian_name: '', guardian_phone: '', observations: '' });

    // Edit modal
    const [editingChild, setEditingChild] = useState<Child | null>(null);
    const [editForm, setEditForm] = useState<Partial<Child>>({});
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    // Clinical panel
    const [selectedPatient, setSelectedPatient] = useState<Child | null>(null);
    const [clinicalData, setClinicalData] = useState<any>({});
    const [isSavingClinical, setIsSavingClinical] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [newCarePlan, setNewCarePlan] = useState('');

    // Scroll lock
    useEffect(() => {
        if (editingChild || selectedPatient) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        return () => document.body.classList.remove('no-scroll');
    }, [editingChild, selectedPatient]);

    useEffect(() => { fetchChildren(); }, []);

    const fetchChildren = async () => {
        setIsLoading(true);
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) { setIsLoading(false); return; }
            const { data, error } = await supabase.from('children').select('*').eq('user_id', userData.user.id).order('name', { ascending: true });
            if (error) throw error;
            if (data) setChildren(data);
        } catch (err) { console.error('Erro ao listar puericultura:', err); }
        finally { setIsLoading(false); }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) throw new Error('Não logado');
            const { error } = await supabase.from('children').insert([{ user_id: userData.user.id, ...formData, guardian_name: formData.guardian_name || null, guardian_phone: formData.guardian_phone || null, observations: formData.observations || null }]);
            if (error) throw error;
            setFormData({ name: '', birth_date: '', gender: 'Masculino', risk_level: 'Baixo', guardian_name: '', guardian_phone: '', observations: '' });
            setShowForm(false);
            fetchChildren();
        } catch (err: any) { alert('Erro: ' + err.message); }
        finally { setIsSaving(false); }
    };

    const openClinicalModal = (child: Child) => {
        console.log('Opening Child Panel:', child.name);
        setEditingChild(null);
        setClinicalData(child.clinical_data || {});
        setNewNote('');
        setNewCarePlan('');
        setSelectedPatient(child);
    };

    const openEditModal = (child: Child) => {
        setSelectedPatient(null);
        setEditForm({ ...child });
        setEditingChild(child);
    };

    const handleSaveEdit = async () => {
        if (!editingChild) return;
        setIsSavingEdit(true);
        try {
            const { error } = await supabase.from('children').update({ name: editForm.name, birth_date: editForm.birth_date, gender: editForm.gender, risk_level: editForm.risk_level, guardian_name: editForm.guardian_name || null, guardian_phone: editForm.guardian_phone || null, observations: editForm.observations || null }).eq('id', editingChild.id);
            if (error) throw error;
            setChildren(prev => prev.map(c => c.id === editingChild.id ? { ...c, ...editForm } as Child : c));
            setEditingChild(null);
        } catch (err: any) { alert('Erro: ' + err.message); }
        finally { setIsSavingEdit(false); }
    };

    const saveClinicalData = async () => {
        if (!selectedPatient) return;
        setIsSavingClinical(true);
        try {
            const updated = { ...clinicalData };
            if (newNote.trim() || newCarePlan.trim()) {
                updated.followUps = [{ date: new Date().toISOString(), text: newNote, carePlan: newCarePlan }, ...(updated.followUps || [])];
            }
            const { error } = await supabase.from('children').update({ clinical_data: updated }).eq('id', selectedPatient.id);
            if (error) throw error;
            setChildren(prev => prev.map(c => c.id === selectedPatient.id ? { ...c, clinical_data: updated } : c));
            setClinicalData(updated);
            setNewNote('');
            setNewCarePlan('');
        } catch (err) { alert('Erro ao salvar.'); }
        finally { setIsSavingClinical(false); }
    };

    const getAge = (birthStr: string) => {
        if (!birthStr) return { months: 0, display: 'N/I' };
        const birth = new Date(birthStr);
        const today = new Date();
        let months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
        if (months < 0) months = 0;
        if (months < 1) { const days = Math.floor((today.getTime() - birth.getTime()) / 86400000); return { months: 0, display: `${days}d` }; }
        if (months < 24) return { months, display: `${months} m` };
        return { months, display: `${Math.floor(months / 12)} a ${months % 12}m` };
    };

    const highRisk = children.filter(c => c.risk_level === 'Alto').length;
    const newborns = children.filter(c => getAge(c.birth_date).months < 1).length;

    return (
        <div className="flex flex-col gap-6 pb-24">

            {/* ── HEADER ── */}
            <div className="rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #bfdbfe 0%, #fbcfe8 100%)' }}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-7">
                    <div>
                        <h2 className="text-3xl font-black flex items-center gap-3" style={{ color: '#1e3a5f' }}>
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md" style={{ background: 'rgba(255,255,255,0.7)' }}>
                                <Baby size={28} style={{ color: '#2563eb' }} />
                            </div>
                            Puericultura
                        </h2>
                        <p className="font-bold text-sm mt-1" style={{ color: '#3b82f6' }}>Crescimento · Desenvolvimento · Imunização</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-3 px-7 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg"
                        style={{ background: 'rgba(255,255,255,0.9)', color: '#2563eb', border: '2px solid rgba(255,255,255,0.7)' }}
                    >
                        {showForm ? <X size={20} /> : <Plus size={20} />} {showForm ? 'Fechar' : 'Nova Criança'}
                    </button>
                </div>
            </div>

            {/* ── DASHBOARD STATS ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Ativo', value: isLoading ? '—' : children.length, from: '#dbeafe', to: '#bfdbfe', text: '#1d4ed8', sub: 'Crianças' },
                    { label: 'Alto Risco', value: isLoading ? '—' : highRisk, from: '#fce7f3', to: '#fbcfe8', text: '#be185d', sub: 'Monitoradas' },
                    { label: 'Recém-nascidos', value: isLoading ? '—' : newborns, from: '#fef9c3', to: '#fef08a', text: '#92400e', sub: '< 1 mês' },
                    { label: 'AME Vigente', value: isLoading ? '—' : children.filter(c => getAge(c.birth_date).months < 6).length, from: '#d1fae5', to: '#a7f3d0', text: '#065f46', sub: '< 6 meses' },
                ].map((s, i) => (
                    <div key={i} className="rounded-3xl p-5 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow" style={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})` }}>
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: s.text }}>{s.label}</span>
                        <span className="text-4xl font-black" style={{ color: s.text }}>{s.value}</span>
                        <span className="text-[10px] font-bold uppercase" style={{ color: s.text, opacity: 0.7 }}>{s.sub}</span>
                    </div>
                ))}
            </div>

            {/* ── FORM ── */}
            {showForm && (
                <div className="border-2 rounded-3xl p-8 animate-in fade-in slide-in-from-top-4" style={{ borderColor: '#bfdbfe', background: 'linear-gradient(135deg, #f0f9ff, #fdf2f8)' }}>
                    <h3 className="text-xl font-black mb-6 flex items-center gap-3" style={{ color: '#1e40af' }}>
                        <Users size={22} /> Cadastro de Puericultura
                    </h3>
                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[
                            { label: 'Nome Completo da Criança *', type: 'text', key: 'name', span: 2, required: true },
                            { label: 'Data de Nascimento *', type: 'date', key: 'birth_date', required: true },
                            { label: 'Responsável (Mãe/Pai) *', type: 'text', key: 'guardian_name', required: true },
                            { label: 'Telefone do Responsável', type: 'tel', key: 'guardian_phone' },
                        ].map(f => (
                            <div key={f.key} className={f.span === 2 ? 'md:col-span-2' : ''}>
                                <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: '#6b7280' }}>{f.label}</label>
                                <input type={f.type} required={f.required} value={(formData as any)[f.key]} onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                                    className="w-full p-4 rounded-2xl border-2 font-bold transition-all outline-none focus:ring-4" style={{ borderColor: '#bfdbfe', background: 'white' }} />
                            </div>
                        ))}
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: '#6b7280' }}>Sexo Biológico</label>
                            <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="w-full p-4 rounded-2xl border-2 font-bold transition-all outline-none" style={{ borderColor: '#bfdbfe', background: 'white' }}>
                                <option>Masculino</option><option>Feminino</option><option value="Não informado">Outro / N/I</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: '#6b7280' }}>Nível de Risco</label>
                            <select value={formData.risk_level} onChange={e => setFormData({ ...formData, risk_level: e.target.value })} className="w-full p-4 rounded-2xl border-2 font-bold transition-all outline-none" style={{ borderColor: '#bfdbfe', background: 'white' }}>
                                <option value="Baixo">Baixo (Habitual)</option><option value="Moderado">Moderado</option><option value="Alto">Alto Risco</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 ml-1" style={{ color: '#6b7280' }}>Observações Clínicas</label>
                            <textarea value={formData.observations} onChange={e => setFormData({ ...formData, observations: e.target.value })} rows={2} className="w-full p-4 rounded-2xl border-2 font-bold transition-all outline-none resize-none" style={{ borderColor: '#bfdbfe', background: 'white' }} />
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                            <button type="submit" disabled={isSaving} className="px-12 py-4 rounded-2xl font-black text-white uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #3b82f6, #ec4899)' }}>
                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Confirmar Cadastro'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ── PATIENT LIST ── */}
            <div>
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-black" style={{ color: '#1e3a5f' }}>Monitoramento Ativo</h3>
                        <p className="text-xs font-black uppercase tracking-widest mt-1 italic" style={{ color: '#93c5fd' }}>
                            Acompanhamento neuropsicomotor · {children.length} crianças
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 size={48} className="animate-spin" style={{ color: '#3b82f6' }} />
                    </div>
                ) : children.length === 0 ? (
                    <div className="rounded-3xl border-2 border-dashed py-20 flex flex-col items-center gap-4" style={{ borderColor: '#bfdbfe', background: 'linear-gradient(135deg, #f0f9ff, #fdf2f8)' }}>
                        <Baby size={64} style={{ color: '#bfdbfe' }} />
                        <p className="text-xl font-black" style={{ color: '#93c5fd' }}>Nenhuma criança cadastrada</p>
                        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#c4b5fd' }}>Inicie o monitoramento preventivo da sua área</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {children.map(c => {
                            const age = getAge(c.birth_date);
                            const isHigh = c.risk_level === 'Alto';
                            const isMod = c.risk_level === 'Moderado';
                            // Card gradient: blue for boys, pink for girls, neutral for others
                            const cardBg = c.gender === 'Feminino'
                                ? 'linear-gradient(145deg, #fff0f6, #fdf2f8)'
                                : 'linear-gradient(145deg, #eff6ff, #f0f9ff)';
                            const accentColor = c.gender === 'Feminino' ? '#ec4899' : '#3b82f6';
                            const badgeColor = isHigh ? '#fecdd3' : isMod ? '#fde68a' : c.gender === 'Feminino' ? '#fce7f3' : '#dbeafe';
                            const badgeText = isHigh ? '#be123c' : isMod ? '#92400e' : c.gender === 'Feminino' ? '#9d174d' : '#1d4ed8';

                            return (
                                <div key={c.id}
                                    className="rounded-[2rem] flex flex-col shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden relative"
                                    style={{ background: cardBg, border: `2px solid ${c.gender === 'Feminino' ? '#fbcfe8' : '#bfdbfe'}` }}
                                >
                                    {/* Top accent bar */}
                                    <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${accentColor}, ${c.gender === 'Feminino' ? '#a855f7' : '#06b6d4'})` }} />

                                    <div className="p-6 flex flex-col gap-4 flex-1">
                                        {/* Name & age */}
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xl font-black leading-tight truncate group-hover:opacity-80 transition-opacity" style={{ color: '#1e3a5f' }}>
                                                    {c.name}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                    <span className="text-xs font-black px-2.5 py-1 rounded-xl" style={{ background: badgeColor, color: badgeText }}>
                                                        {age.display}
                                                    </span>
                                                    <span className="text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-lg" style={{ background: isHigh ? '#fee2e2' : isMod ? '#fef9c3' : 'rgba(255,255,255,0.7)', color: isHigh ? '#dc2626' : isMod ? '#d97706' : '#6b7280' }}>
                                                        {c.risk_level}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Gender icon */}
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.8)', border: `1.5px solid ${c.gender === 'Feminino' ? '#fbcfe8' : '#bfdbfe'}` }}>
                                                <Heart size={18} style={{ color: accentColor }} />
                                            </div>
                                        </div>

                                        {/* Info block */}
                                        <div className="rounded-2xl p-4 space-y-2.5" style={{ background: 'rgba(255,255,255,0.7)' }}>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#9ca3af' }}>Nascimento</span>
                                                <span className="text-xs font-black" style={{ color: '#1e3a5f' }}>
                                                    {c.birth_date ? new Date(c.birth_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/I'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#9ca3af' }}>Responsável</span>
                                                <span className="text-xs font-black truncate max-w-[120px]" style={{ color: '#1e3a5f' }}>{c.guardian_name || 'N/I'}</span>
                                            </div>
                                            {/* Progress bar for first 2 years */}
                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#9ca3af' }}>Prog. Puericultura</span>
                                                    <span className="text-[9px] font-black" style={{ color: accentColor }}>{Math.min(Math.round((age.months / 24) * 100), 100)}%</span>
                                                </div>
                                                <div className="h-1.5 w-full rounded-full" style={{ background: `${accentColor}20` }}>
                                                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(Math.round((age.months / 24) * 100), 100)}%`, background: `linear-gradient(90deg, ${accentColor}, ${c.gender === 'Feminino' ? '#a855f7' : '#06b6d4'})` }} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* WhatsApp */}
                                        {c.guardian_phone && (
                                            <a href={`https://wa.me/55${c.guardian_phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 py-2.5 rounded-2xl font-black text-xs transition-all hover:opacity-80"
                                                style={{ background: '#dcfce7', color: '#16a34a' }}>
                                                <MessageCircle size={16} /> {c.guardian_phone}
                                            </a>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-3 mt-auto">
                                            <button
                                                onClick={() => openClinicalModal(c)}
                                                className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                                                style={{ background: `linear-gradient(135deg, ${accentColor}, ${c.gender === 'Feminino' ? '#a855f7' : '#06b6d4'})`, boxShadow: `0 8px 20px ${accentColor}40` }}
                                            >
                                                <Activity size={16} /> Acompanhar
                                            </button>
                                            <button
                                                onClick={() => openEditModal(c)}
                                                className="p-4 rounded-2xl transition-all active:scale-90"
                                                style={{ background: 'rgba(255,255,255,0.9)', border: `1.5px solid ${accentColor}40`, color: accentColor }}
                                            >
                                                <Pencil size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── CLINICAL PANEL ── */}
            {selectedPatient && (
                <ChildClinicalPanel
                    child={selectedPatient}
                    clinicalData={clinicalData}
                    handleClinicalChange={(key: string, val: any) => setClinicalData((prev: any) => ({ ...prev, [key]: val }))}
                    newNote={newNote}
                    setNewNote={setNewNote}
                    newCarePlan={newCarePlan}
                    setNewCarePlan={setNewCarePlan}
                    saveClinicalData={saveClinicalData}
                    isSavingClinical={isSavingClinical}
                    onClose={() => setSelectedPatient(null)}
                    milestones={childMilestones}
                />
            )}

            {/* ── EDIT MODAL ── */}
            {editingChild && (
                <ModalPortal>
                    <div className="modal-overlay">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col" style={{ border: '2px solid #bfdbfe', zIndex: 9999 }}>
                            <div className="p-6 flex justify-between items-center" style={{ background: 'linear-gradient(135deg, #dbeafe, #fce7f3)' }}>
                                <h3 className="text-lg font-black flex items-center gap-2" style={{ color: '#1e3a5f' }}>
                                    <Pencil size={20} /> Editar: {editingChild.name}
                                </h3>
                                <button onClick={() => setEditingChild(null)} className="p-2 rounded-full hover:bg-white/50 transition-colors" style={{ color: '#3b82f6' }}>
                                    <X size={22} />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { label: 'Nome Completo', type: 'text', key: 'name', span: 2 },
                                    { label: 'Data de Nascimento', type: 'date', key: 'birth_date' },
                                    { label: 'Responsável', type: 'text', key: 'guardian_name' },
                                    { label: 'Telefone', type: 'tel', key: 'guardian_phone' },
                                ].map(f => (
                                    <div key={f.key} className={f.span === 2 ? 'md:col-span-2' : ''}>
                                        <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#9ca3af' }}>{f.label}</label>
                                        <input type={f.type} value={(editForm as any)[f.key] || ''} onChange={e => setEditForm({ ...editForm, [f.key]: e.target.value })}
                                            className="w-full p-3.5 rounded-2xl border-2 font-bold outline-none transition-all" style={{ borderColor: '#bfdbfe', background: '#f8fafc' }} />
                                    </div>
                                ))}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#9ca3af' }}>Risco</label>
                                    <select value={editForm.risk_level || 'Baixo'} onChange={e => setEditForm({ ...editForm, risk_level: e.target.value })} className="w-full p-3.5 rounded-2xl border-2 font-bold outline-none" style={{ borderColor: '#bfdbfe', background: '#f8fafc' }}>
                                        <option value="Baixo">Baixo</option><option value="Moderado">Moderado</option><option value="Alto">Alto</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#9ca3af' }}>Observações</label>
                                    <textarea value={editForm.observations || ''} onChange={e => setEditForm({ ...editForm, observations: e.target.value })} rows={2} className="w-full p-3.5 rounded-2xl border-2 font-bold outline-none resize-none" style={{ borderColor: '#bfdbfe', background: '#f8fafc' }} />
                                </div>
                            </div>
                            <div className="p-5 border-t flex justify-end gap-3" style={{ borderColor: '#bfdbfe' }}>
                                <button onClick={() => setEditingChild(null)} className="px-6 py-3 rounded-2xl font-black text-sm border-2 transition-all" style={{ borderColor: '#bfdbfe', color: '#3b82f6' }}>Cancelar</button>
                                <button onClick={handleSaveEdit} disabled={isSavingEdit} className="px-8 py-3 rounded-2xl font-black text-sm text-white flex items-center gap-2 shadow-lg transition-all" style={{ background: 'linear-gradient(135deg, #3b82f6, #ec4899)' }}>
                                    {isSavingEdit ? <Loader2 size={15} className="animate-spin" /> : <><Save size={15} /> Atualizar</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}
        </div>
    );
}
