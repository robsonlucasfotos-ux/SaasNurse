import { useEffect } from 'react';
import { AlertTriangle, CheckCircle, HeartPulse, Plus, Loader2, FileText, Activity, Baby, BookOpen, Heart, Calendar, Save } from 'lucide-react';
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

    // Gestational age calc
    const dumDate = patient.dum ? new Date(patient.dum) : null;
    const diffTime = dumDate ? Math.abs(Date.now() - dumDate.getTime()) : 0;
    const weeks = dumDate ? Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)) : null;

    return (
        <ModalPortal>
            {/* Overlay com Isolamento Total (Heavy Blur and Darken) */}
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                style={{ zIndex: 9998 }}
                onClick={onClose}
            ></div>

            {/* Drawer Container (85% width max) */}
            <div
                className="fixed top-0 right-0 h-full w-[95%] md:w-[85%] max-w-6xl bg-white flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-300"
                style={{ zIndex: 9999 }}
            >
                {/* Header (Topo) */}
                <div className="p-6 md:px-8 border-b border-gray-200 bg-white shadow-sm flex-shrink-0 flex justify-between items-start">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-4">
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-none">
                                {patient.name}
                            </h2>
                            <span className={`px-4 py-1.5 text-sm font-bold uppercase tracking-wider rounded-lg shadow-sm whitespace-nowrap ${patient.risk_level === 'Alto' ? 'bg-red-600 text-white border border-red-700' : 'bg-green-600 text-white border border-green-700'}`}>
                                Risco {patient.risk_level === 'Alto' ? 'Alto' : 'Habitual'}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-6 text-gray-700 font-semibold text-sm md:text-base">
                            <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-md">
                                <Baby size={18} className="text-gray-500" /> {patient.age ? `${patient.age} anos` : 'Idade N/I'}
                            </span>
                            <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-md">
                                <Calendar size={18} className="text-blue-600" /> DUM: {patient.dum ? new Date(patient.dum).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/I'} {weeks ? `(${weeks} semanas)` : ''}
                            </span>
                            <span className="flex items-center gap-1.5 bg-pink-50 text-pink-800 px-3 py-1 rounded-md font-bold border border-pink-200">
                                <HeartPulse size={18} className="text-pink-600" /> DPP: {patient.dpp ? new Date(patient.dpp).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'Nenhuma DPP registrada'}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors shrink-0 outline-none focus:ring-2 focus:ring-gray-400">
                        <Plus size={32} className="rotate-45" />
                    </button>
                </div>

                {/* Main Content Area (Split Left/Right) */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full relative">

                    {/* Left: Checklists (fixed width on large screens) */}
                    <div className="w-full lg:w-[420px] bg-white border-r border-gray-200 overflow-y-auto p-6 md:p-8 flex flex-col gap-10 shrink-0">

                        {/* Trimestres */}
                        <section>
                            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3 border-b border-gray-100 pb-3">
                                <CheckCircle className="text-pink-600" size={28} /> Protocolos RENAME
                            </h3>

                            <div className="flex flex-col gap-6">
                                {/* T1 */}
                                <div className="p-5 rounded-2xl border-2 border-pink-100 bg-pink-50/50 hover:bg-pink-50 transition-colors">
                                    <h5 className="font-extrabold text-pink-900 text-lg mb-4 flex items-center gap-2 tracking-tight">
                                        <div className="w-2 h-2 rounded-full bg-pink-500"></div>1º Trimestre (0-12s)
                                    </h5>
                                    <div className="flex flex-col gap-3">
                                        <label className="flex items-center gap-4 cursor-pointer p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:shadow-sm">
                                            <input type="checkbox" className="w-6 h-6 accent-pink-600 rounded cursor-pointer shrink-0" checked={clinicalData?.t1_exames || false} onChange={e => handleClinicalChange('t1_exames', e.target.checked)} />
                                            <span className="text-base text-gray-900 font-semibold leading-snug">Exames Iniciais / Ecografia</span>
                                        </label>
                                        <label className="flex items-center gap-4 cursor-pointer p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:shadow-sm">
                                            <input type="checkbox" className="w-6 h-6 accent-pink-600 rounded cursor-pointer shrink-0" checked={clinicalData?.t1_testes || false} onChange={e => handleClinicalChange('t1_testes', e.target.checked)} />
                                            <span className="text-base text-gray-900 font-semibold leading-snug">Testes Rápidos Efetuados</span>
                                        </label>
                                        <label className="flex items-center gap-4 cursor-pointer p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:shadow-sm">
                                            <input type="checkbox" className="w-6 h-6 accent-pink-600 rounded cursor-pointer shrink-0" checked={clinicalData?.t1_pnc || false} onChange={e => handleClinicalChange('t1_pnc', e.target.checked)} />
                                            <span className="text-base text-gray-900 font-semibold leading-snug">Início PNC Precoce</span>
                                        </label>
                                        <div className="h-px bg-pink-200/60 my-2"></div>
                                        <label className="flex items-center gap-4 cursor-pointer p-3 bg-white/60 hover:bg-white rounded-xl transition-all border border-pink-200">
                                            <input type="checkbox" className="w-6 h-6 accent-pink-700 rounded cursor-pointer shrink-0" checked={clinicalData?.t1_presc || false} onChange={e => handleClinicalChange('t1_presc', e.target.checked)} />
                                            <span className="text-base text-pink-900 font-extrabold leading-tight">Prescrito: Sulfato / Ácido Fólico</span>
                                        </label>
                                    </div>
                                </div>

                                {/* T2 */}
                                <div className="p-5 rounded-2xl border-2 border-purple-100 bg-purple-50/50 hover:bg-purple-50 transition-colors">
                                    <h5 className="font-extrabold text-purple-900 text-lg mb-4 flex items-center gap-2 tracking-tight">
                                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>2º Trimestre (13-27s)
                                    </h5>
                                    <div className="flex flex-col gap-3">
                                        <label className="flex items-center gap-4 cursor-pointer p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:shadow-sm">
                                            <input type="checkbox" className="w-6 h-6 accent-purple-600 rounded cursor-pointer shrink-0" checked={clinicalData?.t2_exames || false} onChange={e => handleClinicalChange('t2_exames', e.target.checked)} />
                                            <span className="text-base text-gray-900 font-semibold leading-snug">USG Morfológica</span>
                                        </label>
                                        <label className="flex items-center gap-4 cursor-pointer p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:shadow-sm">
                                            <input type="checkbox" className="w-6 h-6 accent-purple-600 rounded cursor-pointer shrink-0" checked={clinicalData?.t2_vacina || false} onChange={e => handleClinicalChange('t2_vacina', e.target.checked)} />
                                            <span className="text-base text-gray-900 font-semibold leading-snug">Vacina dTpa Recebida</span>
                                        </label>
                                        <label className="flex items-center gap-4 cursor-pointer p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:shadow-sm">
                                            <input type="checkbox" className="w-6 h-6 accent-purple-600 rounded cursor-pointer shrink-0" checked={clinicalData?.t2_ttog || false} onChange={e => handleClinicalChange('t2_ttog', e.target.checked)} />
                                            <span className="text-base text-gray-900 font-semibold leading-snug">Rastreio TTOG 75g (24-28s)</span>
                                        </label>
                                        <div className="h-px bg-purple-200/60 my-2"></div>
                                        <label className="flex items-center gap-4 cursor-pointer p-3 bg-white/60 hover:bg-white rounded-xl transition-all border border-purple-200">
                                            <input type="checkbox" className="w-6 h-6 accent-purple-700 rounded cursor-pointer shrink-0" checked={clinicalData?.t2_presc || false} onChange={e => handleClinicalChange('t2_presc', e.target.checked)} />
                                            <span className="text-base text-purple-900 font-extrabold leading-tight">Prescrito: Ferro / Cálcio</span>
                                        </label>
                                    </div>
                                </div>

                                {/* T3 */}
                                <div className="p-5 rounded-2xl border-2 border-blue-100 bg-blue-50/50 hover:bg-blue-50 transition-colors">
                                    <h5 className="font-extrabold text-blue-900 text-lg mb-4 flex items-center gap-2 tracking-tight">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>3º Trimestre (28-41s)
                                    </h5>
                                    <div className="flex flex-col gap-3">
                                        <label className="flex items-center gap-4 cursor-pointer p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:shadow-sm">
                                            <input type="checkbox" className="w-6 h-6 accent-blue-600 rounded cursor-pointer shrink-0" checked={clinicalData?.t3_swab || false} onChange={e => handleClinicalChange('t3_swab', e.target.checked)} />
                                            <span className="text-base text-gray-900 font-semibold leading-snug">Swab Anal/Vaginal (35s+)</span>
                                        </label>
                                        <label className="flex items-center gap-4 cursor-pointer p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:shadow-sm">
                                            <input type="checkbox" className="w-6 h-6 accent-blue-600 rounded cursor-pointer shrink-0" checked={clinicalData?.t3_testes || false} onChange={e => handleClinicalChange('t3_testes', e.target.checked)} />
                                            <span className="text-base text-gray-900 font-semibold leading-snug">Repetir Testes Rápidos</span>
                                        </label>
                                        <label className="flex items-center gap-4 cursor-pointer p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:shadow-sm">
                                            <input type="checkbox" className="w-6 h-6 accent-blue-600 rounded cursor-pointer shrink-0" checked={clinicalData?.t3_posicao || false} onChange={e => handleClinicalChange('t3_posicao', e.target.checked)} />
                                            <span className="text-base text-gray-900 font-semibold leading-snug">Avaliar Apresentação Fetal</span>
                                        </label>
                                        <div className="h-px bg-blue-200/60 my-2"></div>
                                        <label className="flex items-center gap-4 cursor-pointer p-3 bg-white/60 hover:bg-white rounded-xl transition-all border border-blue-200">
                                            <input type="checkbox" className="w-6 h-6 accent-blue-700 rounded cursor-pointer shrink-0" checked={clinicalData?.t3_presc || false} onChange={e => handleClinicalChange('t3_presc', e.target.checked)} />
                                            <span className="text-base text-blue-900 font-extrabold leading-tight">Manteve Suplementação</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Fatores & Condições */}
                        <section>
                            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3 border-b border-gray-100 pb-3">
                                <Activity className="text-orange-600" size={28} /> Observação Contínua
                            </h3>
                            <div className="flex flex-col gap-3">
                                {[
                                    { key: 'obs_hipertensao', label: 'Risco de DHEG / PA Elevada', color: 'red' },
                                    { key: 'obs_diabetes', label: 'Diabetes Gestacional', color: 'orange' },
                                    { key: 'obs_itu', label: 'ITU de Repetição / Cultura +', color: 'yellow' },
                                    { key: 'obs_corrimento', label: 'Vaginoses Sintomáticas', color: 'purple' },
                                ].map(({ key, label, color }) => (
                                    <label key={key} className="flex items-center gap-4 cursor-pointer bg-white p-4 border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-sm transition-all">
                                        <input type="checkbox" className={`accent-${color}-600 w-6 h-6 rounded cursor-pointer shrink-0`} checked={clinicalData?.[key] || false} onChange={e => handleClinicalChange(key, e.target.checked)} />
                                        <span className="text-base text-gray-900 font-bold">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Ações Finais / Desfecho */}
                        <section className="mt-4 rounded-2xl border-4 border-gray-100 bg-gray-50 p-6">
                            <h4 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                                <Baby size={24} className="text-indigo-600" /> Finalizar Gestação
                            </h4>
                            <p className="text-sm text-gray-600 mb-5 leading-relaxed font-medium">
                                Registre o desfecho (Parto ou Perda) para formalizar a saída do módulo de pré-natal de forma segura e sistemática.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button onClick={() => onConcludePregnancy(patient.id, 'Parto Normal', clinicalData)} className="p-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-base font-bold transition-all shadow-sm">Registrar Parto Normal</button>
                                <button onClick={() => onConcludePregnancy(patient.id, 'Cesárea', clinicalData)} className="p-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-base font-bold transition-all shadow-sm">Registrar Parto Cesárea</button>
                                <button onClick={() => onConcludePregnancy(patient.id, 'Óbito Fetal / Perda', clinicalData)} className="p-4 w-full bg-gray-800 hover:bg-black text-white rounded-xl text-base font-bold transition-all shadow-sm">Registrar Perda Fetal / Aborto</button>
                            </div>
                        </section>
                    </div>

                    {/* Right: Notes Area (History + Compose) */}
                    <div className="flex-1 flex flex-col h-[calc(100vh-120px)] md:h-full bg-gray-50 min-w-0">

                        {/* History Scroll Area */}
                        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10 lg:px-16" style={{ backgroundColor: '#f9fafb' }}>
                            <h3 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                <BookOpen className="text-blue-600" size={32} /> Prontuário Clínico
                                <span className="bg-blue-100 text-blue-800 text-sm py-1 px-3 rounded-full font-bold">
                                    {followUps.length} nota{followUps.length !== 1 ? 's' : ''}
                                </span>
                            </h3>

                            {followUps.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border-2 border-dashed border-gray-300 shadow-sm mt-8">
                                    <FileText size={64} className="text-gray-300 mb-6" />
                                    <p className="text-xl text-gray-900 font-extrabold text-center">Nenhuma observação clínica neste prontuário.</p>
                                    <p className="text-base text-gray-500 font-medium mt-3 text-center max-w-sm">
                                        Utilize a área inferior da tela para registrar a primeira evolução de enfermagem desta paciente.
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    {followUps.map((note: any, index: number) => (
                                        <div key={index} className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-200">
                                            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-2 bg-slate-100 text-slate-800 px-4 py-1.5 rounded-lg border border-slate-200">
                                                        <Calendar size={16} className="text-slate-500" />
                                                        <span className="font-bold text-sm tracking-wide">
                                                            {new Date(note.date).toLocaleDateString('pt-BR')}
                                                        </span>
                                                        <span className="font-semibold text-slate-500 text-sm border-l border-slate-300 pl-2 ml-1">
                                                            {new Date(note.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    {index === 0 && <span className="px-3 py-1.5 bg-amber-200 text-amber-900 text-xs font-black uppercase rounded-lg tracking-widest shadow-sm">Mais Recente</span>}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-8">
                                                {note.text && (
                                                    <div>
                                                        <h6 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                            <Activity size={16} /> Observações Clínicas Relevantes
                                                        </h6>
                                                        <p className="text-lg text-gray-900 whitespace-pre-wrap leading-relaxed font-normal">{note.text}</p>
                                                    </div>
                                                )}
                                                {note.carePlan && (
                                                    <div className="bg-[#f0f4ff] border-2 border-[#dbeafe] p-5 md:p-6 rounded-2xl">
                                                        <h6 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                            <HeartPulse size={18} className="text-blue-600" /> Plano de Ação Cofen / Orientações
                                                        </h6>
                                                        <p className="text-lg text-blue-950 whitespace-pre-wrap leading-relaxed font-semibold">{note.carePlan}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {/* Spacing element to prevent footer occlusion on some browsers */}
                            <div className="h-10"></div>
                        </div>

                        {/* Compose Area (Fixed Bottom within Right Column) */}
                        <div className="bg-white p-6 md:p-8 border-t border-gray-200 shadow-[0_-15px_40px_rgba(0,0,0,0.06)] z-10 shrink-0">
                            <h4 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <Plus size={28} className="text-emerald-600" /> Evoluir Paciente
                            </h4>
                            <div className="flex flex-col xl:flex-row gap-6">
                                <div className="flex-1 flex flex-col gap-3">
                                    <label className="text-sm font-bold text-gray-700 uppercase tracking-widest pl-1">Informações Subjetivas / Objetivas</label>
                                    <textarea
                                        className="w-full p-5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-slate-800 focus:bg-white focus:ring-4 focus:ring-slate-800/10 transition-all text-gray-900 text-lg min-h-[140px] resize-y placeholder:text-gray-400 placeholder:font-medium"
                                        placeholder="Sintomas relatados, pressão arterial aferida, BCF auscultado, ganho de peso monitorado..."
                                        value={newNote}
                                        onChange={e => setNewNote(e.target.value)}
                                    />
                                </div>
                                <div className="flex-1 flex flex-col gap-3">
                                    <label className="text-sm font-bold text-blue-700 uppercase tracking-widest pl-1">Plano Diagnóstico e Terapêutico</label>
                                    <textarea
                                        className="w-full p-5 bg-[#f8faff] border-2 border-blue-200 rounded-2xl focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all text-blue-950 text-lg min-h-[140px] resize-y placeholder:text-blue-300 placeholder:font-medium"
                                        placeholder="Prescrição baseada em protocolos, pedidos de exames solicitados, encaminhamentos feitos..."
                                        value={newCarePlan}
                                        onChange={e => setNewCarePlan(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex flex-col xl:flex-row items-center justify-between gap-6">
                                <p className="text-base text-gray-500 font-bold bg-gray-100 py-2 px-4 rounded-lg">
                                    Registro imutável com data e hora após salvo.
                                </p>
                                <button
                                    onClick={saveClinicalData}
                                    disabled={isSavingClinical}
                                    className="w-full xl:w-auto px-10 py-5 bg-black hover:bg-gray-800 active:scale-95 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSavingClinical ? <Loader2 size={28} className="animate-spin" /> : <><Save size={28} /> Salvar Nova Nota</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
}
