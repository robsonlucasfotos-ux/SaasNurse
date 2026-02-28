'use client';

import React, { useState } from 'react';
import {
    AlertTriangle, CheckCircle, HeartPulse, Plus, Loader2, FileText,
    Activity, Baby, BookOpen, Calendar, Save, MessageCircle,
    Stethoscope, ShieldCheck, ChevronDown, ChevronUp, Info, Pencil
} from 'lucide-react';
import ModalPortal from './ModalPortal';

export default function PrenatalClinicalPanel({
    patient,
    clinicalData,
    handleClinicalChange,
    newNote,
    setNewNote,
    newCarePlan,
    setNewCarePlan,
    saveClinicalData,
    isSavingClinical,
    onClose,
    onConcludePregnancy,
    trimestersData = [],
    cofenMedications = []
}: any) {
    const [activeSection, setActiveSection] = useState<'evolution' | 'protocols'>('evolution');
    const [expandedProtocol, setExpandedProtocol] = useState<number | null>(null);

    if (!patient) return null;

    const followUps: any[] = clinicalData?.followUps || [];

    // Gestational age calculation
    const dumDate = patient.dum ? new Date(patient.dum) : null;
    const diffTime = dumDate ? Math.abs(Date.now() - dumDate.getTime()) : 0;
    const weeks = dumDate ? Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)) : null;

    const currentTrimester = weeks !== null
        ? weeks <= 12 ? 1 : weeks <= 27 ? 2 : 3
        : null;

    const trimesterLabel = currentTrimester === 1 ? '1º Trimestre' : currentTrimester === 2 ? '2º Trimestre' : currentTrimester === 3 ? '3º Trimestre' : null;
    const trimesterColor = currentTrimester === 1
        ? 'bg-pink-100 text-pink-800 border-pink-200'
        : currentTrimester === 2
            ? 'bg-purple-100 text-purple-800 border-purple-200'
            : 'bg-blue-100 text-blue-800 border-blue-200';

    const progressPercent = (weeks !== null && !isNaN(weeks)) ? Math.min(Math.round((weeks / 40) * 100), 100) : 0;

    return (
        <ModalPortal>
            {/* Dark overlay */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
                style={{ zIndex: 9998 }}
                onClick={onClose}
            />

            {/* Slide-in Drawer */}
            <div
                className="fixed top-0 right-0 h-full w-full md:w-[90%] lg:w-[85%] max-w-7xl bg-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-500 ease-out"
                style={{ zIndex: 9999 }}
            >
                {/* ─── TOP HEADER: Patient Quick Stats ─── */}
                <div className="px-6 md:px-10 py-6 border-b border-gray-100 bg-white flex-shrink-0">
                    <div className="flex justify-between items-start gap-6">
                        <div className="flex flex-col gap-3 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-none">
                                    {patient.name}
                                </h2>
                                <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full border ${patient.risk_level === 'Alto'
                                    ? 'bg-red-50 text-red-600 border-red-200'
                                    : patient.risk_level === 'Moderado'
                                        ? 'bg-orange-50 text-orange-600 border-orange-200'
                                        : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                    }`}>
                                    RISCO {patient.risk_level || 'HABITUAL'}
                                </span>
                                {trimesterLabel && (
                                    <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full border ${trimesterColor}`}>
                                        {trimesterLabel}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 font-bold">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                        <Baby size={16} />
                                    </div>
                                    <span>{patient.age ? `${patient.age} anos` : 'Idade N/I'}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                        <Calendar size={16} />
                                    </div>
                                    <span>
                                        DUM: {patient.dum ? new Date(patient.dum).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/I'}
                                        {weeks !== null && (
                                            <span className="ml-2 text-blue-600 font-black px-2 py-0.5 bg-blue-50 rounded italic">
                                                {weeks}ª Sem.
                                            </span>
                                        )}
                                    </span>
                                </div>

                                {patient.dpp && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-500">
                                            <HeartPulse size={16} />
                                        </div>
                                        <span className="text-pink-600">DPP: {new Date(patient.dpp).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                                    </div>
                                )}

                                {patient.phone && (
                                    <a
                                        href={`https://wa.me/55${patient.phone.replace(/\D/g, '')}?text=Olá ${encodeURIComponent(patient.name.split(' ')[0])}, aqui é a enfermagem da UBS.`}
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

                            {/* Progress bar */}
                            {weeks !== null && (
                                <div className="mt-2 w-full max-w-md">
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-500 transition-all duration-1000 ease-out"
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-1 items-center">
                                        <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">Progresso Gestacional</span>
                                        <span className="text-[10px] font-black text-gray-500">{progressPercent}% realizado</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={onClose}
                            className="p-3 bg-gray-50 hover:bg-red-50 hover:text-red-500 text-gray-400 rounded-2xl transition-all duration-200 active:scale-90"
                        >
                            <Plus size={24} className="rotate-45" />
                        </button>
                    </div>
                </div>

                {/* ─── NAVIGATION TABS ─── */}
                <div className="flex border-b border-gray-100 bg-white sticky top-0 z-20 px-6 md:px-10">
                    <button
                        onClick={() => setActiveSection('evolution')}
                        className={`px-6 py-4 text-sm font-black uppercase tracking-widest border-b-4 transition-all ${activeSection === 'evolution'
                            ? 'border-blue-600 text-blue-600 bg-blue-50/30'
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <BookOpen size={16} />
                            Evolução Clínica
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveSection('protocols')}
                        className={`px-6 py-4 text-sm font-black uppercase tracking-widest border-b-4 transition-all ${activeSection === 'protocols'
                            ? 'border-pink-600 text-pink-600 bg-pink-50/30'
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={16} />
                            Protocolo & Condutas
                        </div>
                    </button>
                </div>

                {/* ─── MAIN CONTENT ─── */}
                <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">

                    {/* LEFT SIDEBAR: Static Checklist & Quick Actions */}
                    <div className="hidden lg:flex w-[320px] bg-gray-50/50 border-r border-gray-100 overflow-y-auto p-6 flex-col gap-6">
                        <section>
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Activity size={14} className="text-pink-500" /> Checklist Ativo
                            </h4>
                            <div className="space-y-2">
                                {[
                                    { key: 'obs_hipertensao', label: 'Risco DHEG / PA' },
                                    { key: 'obs_diabetes', label: 'Diabetes Gest.' },
                                    { key: 'obs_itu', label: 'ITU de Repetição' },
                                    { key: 'obs_corrimento', label: 'Vaginose / IST' },
                                    { key: 'obs_anemia', label: 'Anemia' },
                                ].map(({ key, label }) => (
                                    <label key={key} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-pink-200 transition-all cursor-pointer group shadow-sm">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded-md border-gray-300 text-pink-600 focus:ring-pink-500 transition-all cursor-pointer"
                                            checked={clinicalData?.[key] || false}
                                            onChange={e => handleClinicalChange(key, e.target.checked)}
                                        />
                                        <span className="text-sm font-bold text-gray-700 group-hover:text-pink-900 transition-colors uppercase tracking-tight">
                                            {label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        <section className="mt-auto">
                            <div className="bg-white p-5 rounded-2xl border-2 border-dashed border-gray-200">
                                <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Stethoscope size={14} className="text-indigo-500" /> Desfecho
                                </h4>
                                <button
                                    onClick={() => onConcludePregnancy(patient.id, 'Parto Normal', clinicalData)}
                                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all mb-2"
                                >
                                    Registrar Parto
                                </button>
                                <button
                                    onClick={() => onConcludePregnancy(patient.id, 'Óbito/Perda', clinicalData)}
                                    className="w-full py-3 bg-gray-800 hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                                >
                                    Arquivar Gestação
                                </button>
                            </div>
                        </section>
                    </div>

                    {/* MAIN AREA */}
                    <div className="flex-1 flex flex-col min-w-0 bg-white">

                        {activeSection === 'evolution' ? (
                            <div className="flex-1 flex flex-col overflow-hidden">

                                {/* New Compose Panel - Moved to Top */}
                                <div className="p-6 md:p-8 bg-white border-b border-gray-100 shadow-sm z-10 flex-shrink-0">
                                    <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                        <Pencil className="text-pink-600" size={24} />
                                        Nova Evolução
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between px-1">
                                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Avaliação</label>
                                                <span className="text-[10px] font-bold text-gray-400 italic">Sintomas e Exame Físico</span>
                                            </div>
                                            <textarea
                                                className="w-full p-5 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10 transition-all min-h-[160px] resize-none text-gray-800 font-medium placeholder:text-gray-300 text-base"
                                                placeholder="Como a paciente está? Sinais vitais, queixas clínicas..."
                                                value={newNote}
                                                onChange={e => setNewNote(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between px-1">
                                                <label className="text-xs font-black text-blue-700 uppercase tracking-widest">Autocuidado / Conduta</label>
                                                <span className="text-[10px] font-bold text-blue-400 italic">Orientações e Prescrições</span>
                                            </div>
                                            <textarea
                                                className="w-full p-5 bg-blue-50/30 border-2 border-blue-100 rounded-3xl focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all min-h-[160px] resize-none text-blue-900 font-bold placeholder:text-blue-300 text-base"
                                                placeholder="Plano de cuidados, medicações orientadas, pedidos de exames..."
                                                value={newCarePlan}
                                                onChange={e => setNewCarePlan(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase bg-gray-50 px-3 py-1.5 rounded-full">
                                            <Info size={12} />
                                            Registro profissional permanente (COFEN)
                                        </div>
                                        <button
                                            onClick={saveClinicalData}
                                            disabled={isSavingClinical || (!newNote.trim() && !newCarePlan.trim())}
                                            className="w-full md:w-auto px-10 py-4 bg-gray-900 hover:bg-black active:scale-95 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-gray-200 flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:scale-100"
                                        >
                                            {isSavingClinical ? (
                                                <Loader2 size={24} className="animate-spin" />
                                            ) : (
                                                <>
                                                    <Save size={20} />
                                                    Salvar e Finalizar
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Scrollable History - Moved to Bottom */}
                                <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8 space-y-8 bg-gray-50/30">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                            <BookOpen className="text-gray-400" size={18} />
                                            Histórico do Prontuário
                                            <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-600 text-[9px] rounded-full">
                                                {followUps.length} evoluções
                                            </span>
                                        </h3>
                                    </div>

                                    {patient.risk_reason && (
                                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-2xl shadow-sm">
                                            <div className="flex items-start gap-3">
                                                <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-[10px] font-black text-red-700 uppercase tracking-widest">Alerta de Alto Risco</p>
                                                    <p className="text-sm font-bold text-red-900 mt-1">{patient.risk_reason}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {followUps.length === 0 ? (
                                        <div className="p-8 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-center bg-white/50">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-3">
                                                <FileText size={24} />
                                            </div>
                                            <p className="text-base font-black text-gray-800">Sem histórico</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {followUps.map((note, idx) => (
                                                <div key={idx} className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
                                                    {idx === 0 && (
                                                        <div className="absolute top-0 right-0 w-2 h-full bg-blue-500"></div>
                                                    )}
                                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
                                                        <div className="flex items-center gap-3">
                                                            <div className="px-3 py-1.5 bg-gray-100 rounded-xl text-[10px] font-black text-gray-500 flex items-center gap-1.5">
                                                                <Calendar size={12} />
                                                                {new Date(note.date).toLocaleDateString('pt-BR')}
                                                                <span className="opacity-30">|</span>
                                                                {new Date(note.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                            {idx === 0 && (
                                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[9px] font-black uppercase tracking-tighter rounded-lg">Última Entrada</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        {note.text && (
                                                            <div>
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Avaliação</p>
                                                                <p className="text-gray-800 leading-relaxed font-medium">{note.text}</p>
                                                            </div>
                                                        )}
                                                        {note.carePlan && (
                                                            <div className="bg-blue-50/30 p-4 rounded-2xl border border-blue-100/50">
                                                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1.5">Autocuidado e Conduta</p>
                                                                <p className="text-blue-900 font-bold">{note.carePlan}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* PROTOCOLS VIEW */
                            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50/20">
                                <div className="max-w-4xl space-y-10">
                                    {/* Trimester Protocols */}
                                    <section>
                                        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                            <ShieldCheck className="text-pink-600" size={24} />
                                            Condutas por Período Gestacional
                                        </h3>
                                        <div className="space-y-4">
                                            {trimestersData.map((t: any) => (
                                                <div
                                                    key={t.id}
                                                    className={`p-1 rounded-[2.5rem] transition-all duration-300 ${currentTrimester === t.id
                                                        ? 'bg-gradient-to-tr from-pink-100 to-purple-100 shadow-lg border border-pink-200'
                                                        : 'bg-white border border-gray-100'
                                                        }`}
                                                >
                                                    <button
                                                        onClick={() => setExpandedProtocol(expandedProtocol === t.id ? null : t.id)}
                                                        className="w-full flex items-center justify-between px-6 py-5 rounded-[2.2rem] hover:bg-white/50 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black ${currentTrimester === t.id ? 'bg-pink-600 text-white' : 'bg-gray-100 text-gray-400'
                                                                }`}>
                                                                {t.id}º
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-base font-black text-gray-900 leading-tight">{t.title}</p>
                                                                {currentTrimester === t.id && (
                                                                    <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest bg-pink-100 px-2 py-0.5 rounded italic mt-1 inline-block">PERÍODO ATUAL</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {expandedProtocol === t.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                                    </button>

                                                    {expandedProtocol === t.id && (
                                                        <div className="px-8 pb-8 pt-4 space-y-6">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                <div className="space-y-4">
                                                                    <h5 className="text-[10px] font-black text-pink-600 uppercase tracking-widest flex items-center gap-2">
                                                                        <Activity size={14} /> Manejo Clínico
                                                                    </h5>
                                                                    {t.symptoms.map((s: any, i: number) => (
                                                                        <div key={i} className="bg-white/60 p-4 rounded-2xl border border-pink-50">
                                                                            <p className="font-black text-gray-900 text-sm mb-1">{s.name}</p>
                                                                            <p className="text-xs text-gray-600 font-medium leading-relaxed">{s.conduct}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div className="space-y-4">
                                                                    <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                                                                        <Stethoscope size={14} /> Prescrições Sugeridas
                                                                    </h5>
                                                                    {t.prescriptions.map((p: any, i: number) => (
                                                                        <div key={i} className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                                                                            <div className="flex items-center justify-between mb-1">
                                                                                <p className="font-black text-blue-900 text-sm">{p.med}</p>
                                                                                {p.pcdt && <span className="text-[8px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded">PCDT</span>}
                                                                            </div>
                                                                            <p className="text-xs text-blue-800/80 font-bold">{p.posology}</p>
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

                                    {/* Cofen Medications */}
                                    <section>
                                        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                            <Pencil className="text-emerald-600" size={24} />
                                            Prescrições de Enfermagem (Res. 801/26)
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {cofenMedications.map((m: any, idx: number) => (
                                                <div key={idx} className="p-5 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                                    <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded mb-2 inline-block">
                                                        {m.category}
                                                    </span>
                                                    <h4 className="font-black text-gray-900 text-base">{m.name}</h4>
                                                    <p className="text-xs text-emerald-700 font-bold mt-1">{m.dosage}</p>
                                                    <p className="text-xs text-gray-400 font-medium mt-2 italic"><strong>Indicação:</strong> {m.indication}</p>
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
        </ModalPortal>
    );
}
