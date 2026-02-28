'use client';

import React, { useState } from 'react';
import {
    AlertTriangle, CheckCircle, HeartPulse, Plus, Loader2, FileText,
    Activity, Baby, BookOpen, Calendar, Save, MessageCircle,
    Stethoscope, ShieldCheck, ChevronDown, ChevronUp, Info, Syringe
} from 'lucide-react';

export default function ChildClinicalPanel({
    child,
    clinicalData,
    handleClinicalChange,
    newNote,
    setNewNote,
    newCarePlan,
    setNewCarePlan,
    saveClinicalData,
    isSavingClinical,
    onClose,
    milestones = []
}: any) {
    const [activeSection, setActiveSection] = useState<'evolution' | 'milestones'>('evolution');
    const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);

    if (!child) return null;

    const followUps: any[] = clinicalData?.followUps || [];

    // Age calculation
    const birthDate = child.birth_date ? new Date(child.birth_date) : null;
    const diffTime = birthDate ? Math.abs(Date.now() - birthDate.getTime()) : 0;
    const months = birthDate ? Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44)) : null;
    const years = months ? Math.floor(months / 12) : null;

    let ageLabel = '';
    if (months !== null) {
        if (months < 1) {
            const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            ageLabel = `${days} dias`;
        } else if (months < 24) {
            ageLabel = `${months} meses`;
        } else {
            ageLabel = `${years} anos e ${months % 12} meses`;
        }
    }

    return (
        <>
            {/* Dark overlay */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
                style={{ zIndex: 9998 }}
                onClick={onClose}
            />

            {/* Slide-in Drawer */}
            <div
                className="fixed top-0 right-0 h-full w-full md:w-[90%] lg:w-[85%] max-w-7xl bg-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-500 ease-out border-l border-indigo-100"
                style={{ zIndex: 9999 }}
            >
                {/* ─── TOP HEADER ─── */}
                <div className="px-6 md:px-10 py-6 border-b border-indigo-50 bg-indigo-50/20 flex-shrink-0">
                    <div className="flex justify-between items-start gap-6">
                        <div className="flex flex-col gap-3 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-2xl md:text-3xl font-black text-indigo-950 tracking-tight leading-none">
                                    {child.name}
                                </h2>
                                <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full border ${child.risk_level === 'Alto'
                                    ? 'bg-red-50 text-red-600 border-red-200'
                                    : child.risk_level === 'Moderado'
                                        ? 'bg-orange-50 text-orange-600 border-orange-200'
                                        : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                    }`}>
                                    RISCO {child.risk_level || 'BAIXO'}
                                </span>
                                <span className="px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full border bg-indigo-100 text-indigo-700 border-indigo-200">
                                    {ageLabel || 'Idade N/I'}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 font-bold">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                                        <Calendar size={16} />
                                    </div>
                                    <span>Nasc: {child.birth_date ? new Date(child.birth_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/I'}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                                        <Baby size={16} />
                                    </div>
                                    <span>Resp: {child.guardian_name || 'Não informado'}</span>
                                </div>

                                {child.guardian_phone && (
                                    <a
                                        href={`https://wa.me/55${child.guardian_phone.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                                            <MessageCircle size={16} />
                                        </div>
                                        WhatsApp
                                    </a>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-3 bg-indigo-50 hover:bg-red-50 hover:text-red-500 text-indigo-300 rounded-2xl transition-all duration-200 active:scale-90 shadow-sm"
                        >
                            <Plus size={24} className="rotate-45" />
                        </button>
                    </div>
                </div>

                {/* ─── NAVIGATION TABS ─── */}
                <div className="flex border-b border-indigo-50 bg-white sticky top-0 z-20 px-6 md:px-10">
                    <button
                        onClick={() => setActiveSection('evolution')}
                        className={`px-6 py-4 text-sm font-black uppercase tracking-widest border-b-4 transition-all ${activeSection === 'evolution'
                            ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <BookOpen size={16} />
                            Acompanhamento
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveSection('milestones')}
                        className={`px-6 py-4 text-sm font-black uppercase tracking-widest border-b-4 transition-all ${activeSection === 'milestones'
                            ? 'border-purple-600 text-purple-600 bg-purple-50/30'
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={16} />
                            Marcos & Vacinas
                        </div>
                    </button>
                </div>

                {/* ─── MAIN CONTENT ─── */}
                <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">

                    {/* LEFT SIDEBAR: Static Checklist */}
                    <div className="hidden lg:flex w-[320px] bg-indigo-50/10 border-r border-indigo-50 overflow-y-auto p-6 flex-col gap-6">
                        <section>
                            <h4 className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Activity size={14} className="text-indigo-400" /> Sinais de Alerta
                            </h4>
                            <div className="space-y-2">
                                {[
                                    { key: 'obs_febre', label: 'Febre Persistente' },
                                    { key: 'obs_diarreia', label: 'Diarreia / Desidrat.' },
                                    { key: 'obs_tosse', label: 'Tosse / Cansaço' },
                                    { key: 'obs_alimentacao', label: 'Dific. Alimentar' },
                                    { key: 'obs_atraso', label: 'Atraso Desenv.' },
                                ].map(({ key, label }) => (
                                    <label key={key} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-indigo-50 hover:border-indigo-200 transition-all cursor-pointer group shadow-sm">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded-md border-indigo-200 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                                            checked={clinicalData?.[key] || false}
                                            onChange={e => handleClinicalChange(key, e.target.checked)}
                                        />
                                        <span className="text-sm font-bold text-indigo-900/70 group-hover:text-indigo-900 transition-colors uppercase tracking-tight">
                                            {label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        <section className="mt-auto">
                            <div className="bg-white p-5 rounded-2xl border-2 border-dashed border-indigo-100">
                                <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Stethoscope size={14} className="text-indigo-500" /> Antropometria Recente
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs font-bold">
                                        <span className="text-gray-400">Peso:</span>
                                        <span className="text-indigo-600">{clinicalData?.lastWeight ? `${clinicalData.lastWeight} kg` : '--'}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-bold">
                                        <span className="text-gray-400">Altura:</span>
                                        <span className="text-indigo-600">{clinicalData?.lastHeight ? `${clinicalData.lastHeight} cm` : '--'}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-bold">
                                        <span className="text-gray-400">PC:</span>
                                        <span className="text-indigo-600">{clinicalData?.lastPC ? `${clinicalData.lastPC} cm` : '--'}</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* MAIN AREA */}
                    <div className="flex-1 flex flex-col min-w-0 bg-white">

                        {activeSection === 'evolution' ? (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {/* Scrollable History */}
                                <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8 space-y-8 bg-indigo-50/5">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-black text-indigo-950 flex items-center gap-2">
                                            <BookOpen className="text-indigo-600" size={24} />
                                            Prontuário de Puericultura
                                            <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] rounded-full">
                                                {followUps.length} evoluções
                                            </span>
                                        </h3>
                                    </div>

                                    {child.observations && (
                                        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-2xl shadow-sm">
                                            <div className="flex items-start gap-3">
                                                <Info size={20} className="text-amber-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Observações Base</p>
                                                    <p className="text-sm font-bold text-amber-900 mt-1">{child.observations}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {followUps.length === 0 ? (
                                        <div className="p-12 border-2 border-dashed border-indigo-100 rounded-[3rem] flex flex-col items-center justify-center text-center bg-white/50">
                                            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-200 mb-4">
                                                <FileText size={32} />
                                            </div>
                                            <p className="text-lg font-black text-indigo-900">Nenhuma evolução</p>
                                            <p className="text-sm text-indigo-300 mt-1 font-bold">Inicie o registro clínico da criança abaixo.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {followUps.map((note, idx) => (
                                                <div key={idx} className="group bg-white p-6 rounded-[2.5rem] border border-indigo-50 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300">
                                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-indigo-50/50">
                                                        <div className="px-3 py-1.5 bg-indigo-50 rounded-xl text-[10px] font-black text-indigo-400 flex items-center gap-1.5 uppercase tracking-widest">
                                                            <Calendar size={12} />
                                                            {new Date(note.date).toLocaleDateString('pt-BR')}
                                                            <span className="opacity-30">|</span>
                                                            {new Date(note.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                        {idx === 0 && (
                                                            <span className="px-2 py-1 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-tighter rounded-lg">Recente</span>
                                                        )}
                                                    </div>
                                                    <div className="space-y-4">
                                                        {note.text && (
                                                            <div>
                                                                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1.5">Evolução Clínica</p>
                                                                <p className="text-indigo-950 leading-relaxed font-bold text-sm">{note.text}</p>
                                                            </div>
                                                        )}
                                                        {note.carePlan && (
                                                            <div className="bg-emerald-50/50 p-4 rounded-3xl border border-emerald-100/50">
                                                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1.5">Plano de Cuidado & Orientações</p>
                                                                <p className="text-emerald-900 font-bold text-sm italic">"{note.carePlan}"</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Compose Panel */}
                                <div className="p-6 md:p-10 bg-white border-t border-indigo-50 shadow-[0_-15px_50px_rgba(79,70,229,0.05)] z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center justify-between px-1">
                                                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Status de Crescimento & Desenvolvimento</label>
                                            </div>
                                            <textarea
                                                className="w-full p-6 bg-indigo-50/20 border-2 border-indigo-50 rounded-[2rem] focus:border-indigo-500 focus:bg-white focus:ring-8 focus:ring-indigo-500/5 transition-all min-h-[160px] resize-none text-indigo-950 font-bold placeholder:text-indigo-200"
                                                placeholder="Relato da mãe, marcos atingidos, peso/alt, alimentação..."
                                                value={newNote}
                                                onChange={e => setNewNote(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center justify-between px-1">
                                                <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Prescrições & Orientações de Alta</label>
                                            </div>
                                            <textarea
                                                className="w-full p-6 bg-emerald-50/20 border-2 border-emerald-50 rounded-[2rem] focus:border-emerald-600 focus:bg-white focus:ring-8 focus:ring-emerald-500/5 transition-all min-h-[160px] resize-none text-emerald-900 font-bold placeholder:text-emerald-200"
                                                placeholder="Ferro, Vitamina A, vacinas, data do próximo retorno..."
                                                value={newCarePlan}
                                                onChange={e => setNewCarePlan(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div className="flex items-center gap-3 text-[10px] font-black text-indigo-300 uppercase bg-indigo-50/50 px-4 py-2 rounded-full">
                                            <ShieldCheck size={14} />
                                            Registro profissional via SaaS Guia APS
                                        </div>
                                        <button
                                            onClick={saveClinicalData}
                                            disabled={isSavingClinical}
                                            className="w-full md:w-auto px-12 py-5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-[1.8rem] font-black text-lg shadow-2xl shadow-indigo-200 flex items-center justify-center gap-4 transition-all disabled:opacity-50"
                                        >
                                            {isSavingClinical ? (
                                                <Loader2 size={24} className="animate-spin" />
                                            ) : (
                                                <>
                                                    <Save size={24} />
                                                    Salvar Nota Clínica
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* MILESTONES VIEW */
                            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-indigo-50/10">
                                <div className="max-w-4xl space-y-10">
                                    <section>
                                        <h3 className="text-xl font-black text-indigo-950 mb-8 flex items-center gap-3">
                                            <Activity className="text-purple-600" size={28} />
                                            Protocolo de Crescimento & Desenvolvimento
                                        </h3>
                                        <div className="space-y-4">
                                            {milestones.map((m: any) => (
                                                <div
                                                    key={m.id}
                                                    className={`p-1 rounded-[2.5rem] border-2 transition-all duration-300 ${expandedMilestone === m.id
                                                        ? 'bg-gradient-to-tr from-indigo-50 to-purple-50 shadow-xl border-indigo-200'
                                                        : 'bg-white border-transparent shadow-sm'
                                                        }`}
                                                >
                                                    <button
                                                        onClick={() => setExpandedMilestone(expandedMilestone === m.id ? null : m.id)}
                                                        className="w-full flex items-center justify-between px-8 py-6 rounded-[2.2rem] hover:bg-white/50 transition-all"
                                                    >
                                                        <div className="flex items-center gap-6">
                                                            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-lg shadow-sm ${expandedMilestone === m.id ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-400'
                                                                }`}>
                                                                {m.title.split(' ')[0]}
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-lg font-black text-indigo-950 leading-tight">{m.title}</p>
                                                            </div>
                                                        </div>
                                                        <div className={`p-2 rounded-full ${expandedMilestone === m.id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-50 text-gray-300'}`}>
                                                            {expandedMilestone === m.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                                        </div>
                                                    </button>

                                                    {expandedMilestone === m.id && (
                                                        <div className="px-10 pb-10 pt-4 space-y-8 animate-in fade-in slide-in-from-top-4">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                                <div className="space-y-5">
                                                                    <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                                        <CheckCircle size={14} className="text-indigo-500" /> Marcos de Saúde
                                                                    </h5>
                                                                    {m.symptoms.map((s: any, i: number) => (
                                                                        <div key={i} className="bg-white/80 p-5 rounded-3xl border border-indigo-100/50 shadow-sm">
                                                                            <p className="font-black text-indigo-900 text-sm mb-2">{s.name}</p>
                                                                            <p className="text-xs text-indigo-700/70 font-bold leading-relaxed">{s.conduct}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div className="space-y-5">
                                                                    <h5 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                                        <Syringe size={14} className="text-purple-500" /> Plano de Imunização
                                                                    </h5>
                                                                    {m.prescriptions.map((p: any, i: number) => (
                                                                        <div key={i} className="bg-purple-50/50 p-5 rounded-3xl border border-purple-100/50 shadow-sm">
                                                                            <div className="flex items-center justify-between mb-2">
                                                                                <p className="font-black text-purple-900 text-sm">{p.med}</p>
                                                                                {p.pcdt && <span className="text-[8px] font-black bg-purple-600 text-white px-2 py-0.5 rounded-full uppercase">PCDT</span>}
                                                                            </div>
                                                                            <p className="text-xs text-purple-800/70 font-bold italic leading-relaxed">{p.posology}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
