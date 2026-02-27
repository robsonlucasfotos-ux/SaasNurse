'use client';

import { AlertTriangle, CheckCircle, HeartPulse, Plus, Loader2, FileText, Activity, Baby, BookOpen, Calendar, Save, MessageCircle } from 'lucide-react';
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
}: any) {
    if (!patient) return null;

    const followUps: any[] = clinicalData?.followUps || [];

    // Gestational age calculation
    const dumDate = patient.dum ? new Date(patient.dum) : null;
    const diffTime = dumDate ? Math.abs(Date.now() - dumDate.getTime()) : 0;
    const weeks = dumDate ? Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)) : null;

    const trimester = weeks !== null
        ? weeks <= 12 ? 1 : weeks <= 27 ? 2 : 3
        : null;

    const trimesterLabel = trimester === 1 ? '1º Trimestre' : trimester === 2 ? '2º Trimestre' : trimester === 3 ? '3º Trimestre' : null;
    const trimesterColor = trimester === 1
        ? 'bg-pink-100 text-pink-800 border-pink-300'
        : trimester === 2
            ? 'bg-purple-100 text-purple-800 border-purple-300'
            : 'bg-blue-100 text-blue-800 border-blue-300';

    const progressPercent = weeks !== null ? Math.min(Math.round((weeks / 40) * 100), 100) : 0;

    return (
        <ModalPortal>
            {/* Dark overlay — click to close */}
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
                style={{ zIndex: 9998 }}
                onClick={onClose}
            />

            {/* Slide-in Drawer */}
            <div
                className="fixed top-0 right-0 h-full w-[98%] md:w-[88%] max-w-6xl bg-white flex flex-col"
                style={{ zIndex: 9999, boxShadow: '0 0 80px rgba(0,0,0,0.5)' }}
            >
                {/* ─── HEADER ─── */}
                <div className="px-6 md:px-10 py-5 border-b border-gray-100 bg-white flex-shrink-0">
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-col gap-2 min-w-0 flex-1">
                            {/* Name + Risk badges */}
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-none">
                                    {patient.name}
                                </h2>
                                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border whitespace-nowrap ${patient.risk_level === 'Alto'
                                        ? 'bg-red-100 text-red-800 border-red-300'
                                        : patient.risk_level === 'Moderado'
                                            ? 'bg-orange-100 text-orange-800 border-orange-300'
                                            : 'bg-green-100 text-green-800 border-green-300'
                                    }`}>
                                    Risco {patient.risk_level || 'Habitual'}
                                </span>
                                {trimesterLabel && (
                                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border whitespace-nowrap ${trimesterColor}`}>
                                        {trimesterLabel}
                                    </span>
                                )}
                            </div>

                            {/* Meta info row */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-semibold mt-0.5">
                                {patient.age && (
                                    <span className="flex items-center gap-1.5">
                                        <Baby size={14} className="text-gray-400" /> {patient.age} anos
                                    </span>
                                )}
                                {patient.dum && (
                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={14} className="text-blue-400" />
                                        DUM: {new Date(patient.dum).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                        {weeks !== null && (
                                            <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded font-black text-xs ml-1">
                                                {weeks}ª sem.
                                            </span>
                                        )}
                                    </span>
                                )}
                                {patient.dpp && (
                                    <span className="flex items-center gap-1.5 text-pink-600 font-bold">
                                        <HeartPulse size={14} className="text-pink-400" />
                                        DPP: {new Date(patient.dpp).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                    </span>
                                )}
                                {patient.phone && (
                                    <a
                                        href={`https://wa.me/55${patient.phone.replace(/\D/g, '')}?text=Olá ${encodeURIComponent(patient.name.split(' ')[0])}, aqui é a enfermagem da UBS. Tudo bem com você e o bebê?`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-[#25D366] hover:underline"
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <MessageCircle size={14} /> WhatsApp
                                    </a>
                                )}
                            </div>

                            {/* Gestational Progress */}
                            {weeks !== null && (
                                <div className="mt-2 max-w-sm">
                                    <div className="flex justify-between text-[10px] font-bold text-gray-300 mb-1">
                                        <span>Semana 1</span>
                                        <span>Semana 40</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-500 transition-all"
                                            style={{ width: `${progressPercent}%` }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-300 mt-1">{progressPercent}% da gestação concluída</p>
                                </div>
                            )}
                        </div>

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="p-2.5 bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-500 rounded-xl transition-colors shrink-0 mt-1"
                            title="Fechar"
                        >
                            <Plus size={22} className="rotate-45" />
                        </button>
                    </div>
                </div>

                {/* ─── BODY ─── */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

                    {/* LEFT: Checklists & Actions */}
                    <div className="w-full lg:w-[380px] bg-white border-r border-gray-100 overflow-y-auto px-6 py-6 md:px-8 flex flex-col gap-8 shrink-0">

                        {/* Protocolo por Trimestre */}
                        <section>
                            <h3 className="text-lg font-black text-gray-800 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                                <CheckCircle className="text-pink-500" size={20} /> Protocolos Assistenciais
                            </h3>
                            <div className="flex flex-col gap-5">
                                {/* 1º Trimestre */}
                                <div className="p-4 rounded-2xl border-2 border-pink-100 bg-pink-50/40">
                                    <h5 className="font-extrabold text-pink-900 text-sm mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-pink-500 inline-block"></span>1º Trimestre (0–12 sem.)
                                    </h5>
                                    <div className="flex flex-col gap-2">
                                        {[
                                            { key: 't1_exames', label: 'Exames Iniciais / Ecografia Confirmada' },
                                            { key: 't1_testes', label: 'Testes Rápidos (HIV, Sífilis, Hep B/C)' },
                                            { key: 't1_pnc', label: 'Início PNC Precoce Registrado' },
                                        ].map(({ key, label }) => (
                                            <label key={key} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-xl transition-all">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 accent-pink-600 rounded cursor-pointer shrink-0"
                                                    checked={clinicalData?.[key] || false}
                                                    onChange={e => handleClinicalChange(key, e.target.checked)}
                                                />
                                                <span className="text-sm text-gray-700 font-semibold">{label}</span>
                                            </label>
                                        ))}
                                        <div className="h-px bg-pink-200/60 my-1" />
                                        <label className="flex items-center gap-3 cursor-pointer p-3 bg-white/70 hover:bg-white rounded-xl border border-pink-200 transition-all">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 accent-pink-700 rounded cursor-pointer shrink-0"
                                                checked={clinicalData?.t1_presc || false}
                                                onChange={e => handleClinicalChange('t1_presc', e.target.checked)}
                                            />
                                            <span className="text-sm text-pink-900 font-extrabold">✅ Prescrito: Sulfato Ferroso + Ácido Fólico</span>
                                        </label>
                                    </div>
                                </div>

                                {/* 2º Trimestre */}
                                <div className="p-4 rounded-2xl border-2 border-purple-100 bg-purple-50/40">
                                    <h5 className="font-extrabold text-purple-900 text-sm mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>2º Trimestre (13–27 sem.)
                                    </h5>
                                    <div className="flex flex-col gap-2">
                                        {[
                                            { key: 't2_exames', label: 'USG Morfológica (20–24 sem.)' },
                                            { key: 't2_vacina', label: 'Vacina dTpa Aplicada (>20 sem.)' },
                                            { key: 't2_ttog', label: 'TTOG 75g Realizado (24–28 sem.)' },
                                        ].map(({ key, label }) => (
                                            <label key={key} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-xl transition-all">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 accent-purple-600 rounded cursor-pointer shrink-0"
                                                    checked={clinicalData?.[key] || false}
                                                    onChange={e => handleClinicalChange(key, e.target.checked)}
                                                />
                                                <span className="text-sm text-gray-700 font-semibold">{label}</span>
                                            </label>
                                        ))}
                                        <div className="h-px bg-purple-200/60 my-1" />
                                        <label className="flex items-center gap-3 cursor-pointer p-3 bg-white/70 hover:bg-white rounded-xl border border-purple-200 transition-all">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 accent-purple-700 rounded cursor-pointer shrink-0"
                                                checked={clinicalData?.t2_presc || false}
                                                onChange={e => handleClinicalChange('t2_presc', e.target.checked)}
                                            />
                                            <span className="text-sm text-purple-900 font-extrabold">✅ Prescrito: Ferro + Carbonato de Cálcio</span>
                                        </label>
                                    </div>
                                </div>

                                {/* 3º Trimestre */}
                                <div className="p-4 rounded-2xl border-2 border-blue-100 bg-blue-50/40">
                                    <h5 className="font-extrabold text-blue-900 text-sm mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>3º Trimestre (28–41 sem.)
                                    </h5>
                                    <div className="flex flex-col gap-2">
                                        {[
                                            { key: 't3_swab', label: 'Swab Anal/Vaginal — Estreptococo B (35–37s)' },
                                            { key: 't3_testes', label: 'Repetir Testes Rápidos de Rotina' },
                                            { key: 't3_posicao', label: 'Apresentação Fetal Avaliada' },
                                        ].map(({ key, label }) => (
                                            <label key={key} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded-xl transition-all">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 accent-blue-600 rounded cursor-pointer shrink-0"
                                                    checked={clinicalData?.[key] || false}
                                                    onChange={e => handleClinicalChange(key, e.target.checked)}
                                                />
                                                <span className="text-sm text-gray-700 font-semibold">{label}</span>
                                            </label>
                                        ))}
                                        <div className="h-px bg-blue-200/60 my-1" />
                                        <label className="flex items-center gap-3 cursor-pointer p-3 bg-white/70 hover:bg-white rounded-xl border border-blue-200 transition-all">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 accent-blue-700 rounded cursor-pointer shrink-0"
                                                checked={clinicalData?.t3_presc || false}
                                                onChange={e => handleClinicalChange('t3_presc', e.target.checked)}
                                            />
                                            <span className="text-sm text-blue-900 font-extrabold">✅ Suplementação Mantida Pós-Parto (3 meses)</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Condições Ativas */}
                        <section>
                            <h3 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                                <Activity className="text-orange-500" size={20} /> Condições Monitoradas
                            </h3>
                            <div className="flex flex-col gap-2">
                                {[
                                    { key: 'obs_hipertensao', label: '⚠️ Risco DHEG / PA Elevada' },
                                    { key: 'obs_diabetes', label: '🩸 Diabetes Gestacional (DMG)' },
                                    { key: 'obs_itu', label: '🔬 ITU de Repetição / Urocultura +' },
                                    { key: 'obs_corrimento', label: '💊 Vaginoses / IST Sintomática' },
                                    { key: 'obs_anemia', label: '🩺 Anemia / Ferritina Baixa' },
                                    { key: 'obs_hipotireoidismo', label: '🧬 Hipotireoidismo Gestacional' },
                                ].map(({ key, label }) => (
                                    <label key={key} className="flex items-center gap-3 cursor-pointer bg-white p-3 border-2 border-gray-100 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded cursor-pointer shrink-0"
                                            checked={clinicalData?.[key] || false}
                                            onChange={e => handleClinicalChange(key, e.target.checked)}
                                        />
                                        <span className="text-sm text-gray-800 font-bold">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Desfecho da Gestação */}
                        <section className="rounded-2xl border-2 border-gray-100 bg-gray-50 p-5">
                            <h4 className="text-base font-black text-gray-800 mb-2 flex items-center gap-2">
                                <Baby size={18} className="text-indigo-500" /> Finalizar Gestação
                            </h4>
                            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                                Registra o desfecho e remove a paciente do módulo de Pré-natal.
                            </p>
                            <div className="flex flex-col gap-2.5">
                                <button
                                    onClick={() => onConcludePregnancy(patient.id, 'Parto Normal', clinicalData)}
                                    className="p-3.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm"
                                >
                                    🟢 Registrar Parto Normal
                                </button>
                                <button
                                    onClick={() => onConcludePregnancy(patient.id, 'Cesárea', clinicalData)}
                                    className="p-3.5 w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm"
                                >
                                    🔵 Registrar Parto Cesárea
                                </button>
                                <button
                                    onClick={() => onConcludePregnancy(patient.id, 'Óbito Fetal / Perda', clinicalData)}
                                    className="p-3.5 w-full bg-gray-700 hover:bg-gray-900 text-white rounded-xl text-sm font-bold transition-all shadow-sm"
                                >
                                    ⚫ Registrar Perda Fetal / Aborto
                                </button>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT: Clinical Notes + Compose */}
                    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 min-w-0">

                        {/* Notes History */}
                        <div className="flex-1 overflow-y-auto px-6 py-7 md:px-10">
                            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <BookOpen className="text-blue-500" size={24} /> Prontuário Clínico
                                <span className="bg-blue-100 text-blue-700 text-xs py-1 px-2.5 rounded-full font-bold">
                                    {followUps.length} nota{followUps.length !== 1 ? 's' : ''}
                                </span>
                            </h3>

                            {/* High Risk Reason */}
                            {patient.risk_reason && (
                                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
                                    <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] font-black text-red-600 uppercase tracking-wider mb-0.5">Motivo do Alto Risco</p>
                                        <p className="text-sm text-red-900 font-semibold">{patient.risk_reason}</p>
                                    </div>
                                </div>
                            )}

                            {followUps.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-10 bg-white rounded-3xl border-2 border-dashed border-gray-200 mt-4">
                                    <FileText size={48} className="text-gray-200 mb-4" />
                                    <p className="text-lg text-gray-700 font-extrabold text-center">Nenhuma evolução registrada.</p>
                                    <p className="text-sm text-gray-400 mt-2 text-center max-w-xs">
                                        Use a área abaixo para registrar a primeira nota de enfermagem desta gestante.
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-5">
                                    {followUps.map((note: any, index: number) => (
                                        <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
                                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-2 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold">
                                                        <Calendar size={13} className="text-slate-400" />
                                                        {new Date(note.date).toLocaleDateString('pt-BR')}
                                                        <span className="text-slate-400 border-l border-slate-200 pl-2 ml-1">
                                                            {new Date(note.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    {index === 0 && (
                                                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase rounded-lg tracking-widest border border-amber-200">
                                                            Mais Recente
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-5">
                                                {note.text && (
                                                    <div>
                                                        <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                            <Activity size={12} /> Observações Clínicas
                                                        </h6>
                                                        <p className="text-base text-gray-900 whitespace-pre-wrap leading-relaxed">{note.text}</p>
                                                    </div>
                                                )}
                                                {note.carePlan && (
                                                    <div className="bg-blue-50 border-2 border-blue-100 p-5 rounded-2xl">
                                                        <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                            <HeartPulse size={12} className="text-blue-400" /> Plano de Ação / Prescrição
                                                        </h6>
                                                        <p className="text-base text-blue-900 whitespace-pre-wrap leading-relaxed font-semibold">{note.carePlan}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="h-8" />
                        </div>

                        {/* Compose Area */}
                        <div className="bg-white px-6 py-6 md:px-10 border-t border-gray-200 shrink-0" style={{ boxShadow: '0 -10px 30px rgba(0,0,0,0.04)' }}>
                            <h4 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-2">
                                <Plus size={22} className="text-emerald-500" /> Evoluir Paciente
                            </h4>
                            <div className="flex flex-col xl:flex-row gap-5">
                                <div className="flex-1 flex flex-col gap-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Subjetivo / Objetivo (S/O)</label>
                                    <textarea
                                        className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-gray-800 focus:bg-white focus:ring-4 focus:ring-gray-800/8 transition-all text-gray-900 text-base min-h-[110px] resize-y placeholder:text-gray-300 placeholder:font-medium"
                                        placeholder="PA aferida, BCF ausculado, ganho de peso, sintomas relatados pela paciente..."
                                        value={newNote}
                                        onChange={e => setNewNote(e.target.value)}
                                    />
                                </div>
                                <div className="flex-1 flex flex-col gap-2">
                                    <label className="text-xs font-bold text-blue-500 uppercase tracking-widest pl-1">Avaliação / Plano (A/P)</label>
                                    <textarea
                                        className="w-full p-4 bg-blue-50/50 border-2 border-blue-100 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all text-blue-900 text-base min-h-[110px] resize-y placeholder:text-blue-200 placeholder:font-medium"
                                        placeholder="Prescrições de enfermagem, exames solicitados, encaminhamentos, metas..."
                                        value={newCarePlan}
                                        onChange={e => setNewCarePlan(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <p className="text-xs text-gray-400 font-bold bg-gray-50 border border-gray-100 py-2 px-3 rounded-lg">
                                    📌 Cada nota é imutável e registrada com data e hora.
                                </p>
                                <button
                                    onClick={saveClinicalData}
                                    disabled={isSavingClinical}
                                    className="w-full sm:w-auto px-8 py-4 bg-black hover:bg-gray-800 active:scale-95 text-white rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}
                                >
                                    {isSavingClinical
                                        ? <><Loader2 size={20} className="animate-spin" /> Salvando...</>
                                        : <><Save size={20} /> Salvar Nota no Prontuário</>
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
}
