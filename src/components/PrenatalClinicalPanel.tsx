import { AlertTriangle, CheckCircle, HeartPulse, Plus, Loader2, FileText, Activity, Baby, BookOpen, Heart } from 'lucide-react';

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col border border-pink-200 dark:border-pink-900/50 overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-4 border-b border-pink-100 dark:border-gray-800 flex justify-between items-start bg-pink-50 dark:bg-pink-900/10 flex-shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <HeartPulse className="text-pink-600" size={24} />
                            Acompanhamento: <span className="text-pink-600 uppercase">{patient.name}</span>
                        </h3>
                        <div className="flex items-center gap-2 mt-2 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 rounded-lg border border-pink-100 dark:border-pink-900/30 w-fit">
                            <AlertTriangle size={14} className="text-amber-500" />
                            <p className="text-[11px] font-bold text-gray-600 dark:text-gray-400">
                                Prescrição baseada em protocolo de enfermagem – Cofen 801/2026
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-full transition-colors mt-1">
                        <Plus size={24} className="rotate-45 text-pink-600" />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
                    <div className="flex flex-col gap-6">

                        {/* === DESFECHO DA GESTAÇÃO === */}
                        <div className="rounded-xl border-2 border-dashed border-pink-200 dark:border-pink-900/40 bg-pink-50/50 dark:bg-pink-900/5 p-4">
                            <h4 className="text-sm font-bold text-pink-700 mb-3 flex items-center gap-2">
                                <Baby size={16} /> Registrar Desfecho da Gestação
                            </h4>
                            <p className="text-[11px] text-gray-500 mb-3">
                                Ao registrar o desfecho, a paciente sairá da lista de gestantes ativas mas continuará salva no sistema.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => onConcludePregnancy(patient.id, 'Parto Normal', clinicalData)}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
                                >
                                    <Heart size={16} /> Parto Normal
                                </button>
                                <button
                                    onClick={() => onConcludePregnancy(patient.id, 'Cesárea', clinicalData)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
                                >
                                    <Baby size={16} /> Cesárea
                                </button>
                                <button
                                    onClick={() => onConcludePregnancy(patient.id, 'Óbito Fetal / Perda', clinicalData)}
                                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
                                >
                                    Perda / Aborto
                                </button>
                            </div>
                        </div>

                        {/* === CHECKLISTS POR TRIMESTRE === */}
                        <div>
                            <h4 className="text-sm font-bold text-pink-700 mb-3 flex items-center gap-2">
                                <CheckCircle size={16} /> Checklists por Trimestre
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* 1º Trimestre */}
                                <div className="card p-3 border-pink-100 bg-pink-50/30 dark:bg-pink-900/5 shadow-none">
                                    <h5 className="font-bold text-xs text-pink-700 border-b border-pink-100 pb-1 mb-2">1º Tri (0-12s)</h5>
                                    <div className="space-y-1.5">
                                        <label className="flex items-start gap-2 text-[11px] cursor-pointer"><input type="checkbox" className="mt-0.5 accent-pink-600 w-3.5 h-3.5" checked={clinicalData?.t1_exames || false} onChange={e => handleClinicalChange('t1_exames', e.target.checked)} /><span>Exames / Ecografia</span></label>
                                        <label className="flex items-start gap-2 text-[11px] cursor-pointer"><input type="checkbox" className="mt-0.5 accent-pink-600 w-3.5 h-3.5" checked={clinicalData?.t1_testes || false} onChange={e => handleClinicalChange('t1_testes', e.target.checked)} /><span>Testes Rápidos</span></label>
                                        <label className="flex items-start gap-2 text-[11px] cursor-pointer"><input type="checkbox" className="mt-0.5 accent-pink-600 w-3.5 h-3.5" checked={clinicalData?.t1_pnc || false} onChange={e => handleClinicalChange('t1_pnc', e.target.checked)} /><span>Início PNC Precoce</span></label>
                                        <div className="pt-1 mt-1 border-t border-pink-100/50">
                                            <label className="flex items-start gap-2 text-[10px] text-pink-800 font-semibold cursor-pointer"><input type="checkbox" className="mt-0.5 accent-pink-600 w-3 h-3" checked={clinicalData?.t1_presc || false} onChange={e => handleClinicalChange('t1_presc', e.target.checked)} /><span>Sulfato / Ác. Fólico</span></label>
                                        </div>
                                    </div>
                                </div>
                                {/* 2º Trimestre */}
                                <div className="card p-3 border-purple-100 bg-purple-50/30 dark:bg-purple-900/5 shadow-none">
                                    <h5 className="font-bold text-xs text-purple-700 border-b border-purple-100 pb-1 mb-2">2º Tri (13-27s)</h5>
                                    <div className="space-y-1.5">
                                        <label className="flex items-start gap-2 text-[11px] cursor-pointer"><input type="checkbox" className="mt-0.5 accent-purple-600 w-3.5 h-3.5" checked={clinicalData?.t2_exames || false} onChange={e => handleClinicalChange('t2_exames', e.target.checked)} /><span>USG Morfológica</span></label>
                                        <label className="flex items-start gap-2 text-[11px] cursor-pointer"><input type="checkbox" className="mt-0.5 accent-purple-600 w-3.5 h-3.5" checked={clinicalData?.t2_vacina || false} onChange={e => handleClinicalChange('t2_vacina', e.target.checked)} /><span>Vacina dTpa (20sem+)</span></label>
                                        <label className="flex items-start gap-2 text-[11px] cursor-pointer"><input type="checkbox" className="mt-0.5 accent-purple-600 w-3.5 h-3.5" checked={clinicalData?.t2_ttog || false} onChange={e => handleClinicalChange('t2_ttog', e.target.checked)} /><span>TTOG 75g (24-28s)</span></label>
                                        <div className="pt-1 mt-1 border-t border-purple-100/50">
                                            <label className="flex items-start gap-2 text-[10px] text-purple-800 font-semibold cursor-pointer"><input type="checkbox" className="mt-0.5 accent-purple-600 w-3 h-3" checked={clinicalData?.t2_presc || false} onChange={e => handleClinicalChange('t2_presc', e.target.checked)} /><span>Ferro / Cálcio</span></label>
                                        </div>
                                    </div>
                                </div>
                                {/* 3º Trimestre */}
                                <div className="card p-3 border-blue-100 bg-blue-50/30 dark:bg-blue-900/5 shadow-none">
                                    <h5 className="font-bold text-xs text-blue-700 border-b border-blue-100 pb-1 mb-2">3º Tri (28-41s)</h5>
                                    <div className="space-y-1.5">
                                        <label className="flex items-start gap-2 text-[11px] cursor-pointer"><input type="checkbox" className="mt-0.5 accent-blue-600 w-3.5 h-3.5" checked={clinicalData?.t3_swab || false} onChange={e => handleClinicalChange('t3_swab', e.target.checked)} /><span>Swab Anal/Vaginal</span></label>
                                        <label className="flex items-start gap-2 text-[11px] cursor-pointer"><input type="checkbox" className="mt-0.5 accent-blue-600 w-3.5 h-3.5" checked={clinicalData?.t3_testes || false} onChange={e => handleClinicalChange('t3_testes', e.target.checked)} /><span>Repetir Testes Rápidos</span></label>
                                        <label className="flex items-start gap-2 text-[11px] cursor-pointer"><input type="checkbox" className="mt-0.5 accent-blue-600 w-3.5 h-3.5" checked={clinicalData?.t3_posicao || false} onChange={e => handleClinicalChange('t3_posicao', e.target.checked)} /><span>Apresentação Fetal</span></label>
                                        <div className="pt-1 mt-1 border-t border-blue-100/50">
                                            <label className="flex items-start gap-2 text-[10px] text-blue-800 font-semibold cursor-pointer"><input type="checkbox" className="mt-0.5 accent-blue-600 w-3 h-3" checked={clinicalData?.t3_presc || false} onChange={e => handleClinicalChange('t3_presc', e.target.checked)} /><span>Manter Suplementação</span></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* === CONDIÇÕES CRÔNICAS === */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { key: 'obs_hipertensao', label: 'Hipertensão', color: 'red' },
                                { key: 'obs_diabetes', label: 'Diabetes Gest.', color: 'orange' },
                                { key: 'obs_itu', label: 'ITU Recorr.', color: 'yellow' },
                                { key: 'obs_corrimento', label: 'Corrimentos', color: 'purple' },
                            ].map(({ key, label, color }) => (
                                <label key={key} className="flex items-center gap-2 text-xs cursor-pointer bg-gray-50 dark:bg-gray-900 p-2 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-white transition-colors">
                                    <input type="checkbox" className={`accent-${color}-500 w-4 h-4`} checked={clinicalData?.[key] || false} onChange={e => handleClinicalChange(key, e.target.checked)} />
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
                                </label>
                            ))}
                        </div>

                        {/* === NOVA NOTA (Google Keep Style) === */}
                        <div className="border border-primary/30 rounded-xl bg-primary/5 p-4">
                            <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                                <FileText size={16} /> Nova Nota de Acompanhamento
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-500 ml-1 uppercase flex items-center gap-1">
                                        <FileText size={14} /> Observações Clínicas
                                    </label>
                                    <textarea
                                        className="form-control min-h-[110px] resize-none focus:ring-2 focus:ring-primary/20 text-sm"
                                        placeholder="Sintomas, exames, queixas da paciente hoje..."
                                        value={newNote}
                                        onChange={e => setNewNote(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-blue-600 ml-1 uppercase flex items-center gap-1">
                                        <HeartPulse size={14} /> Auto-cuidado / Plano de Ação
                                    </label>
                                    <textarea
                                        className="form-control border-blue-200 focus:border-blue-400 bg-blue-50/20 min-h-[110px] resize-none focus:ring-2 focus:ring-blue-100 text-sm"
                                        placeholder="Orientações de saúde, dieta, sinais de alerta, próxima consulta..."
                                        value={newCarePlan}
                                        onChange={e => setNewCarePlan(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="mt-3 flex justify-end">
                                <button
                                    onClick={saveClinicalData}
                                    disabled={isSavingClinical}
                                    className="btn btn-primary flex items-center gap-2 bg-pink-600 hover:bg-pink-700 border-none"
                                >
                                    {isSavingClinical ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /> Salvar Nota</>}
                                </button>
                            </div>
                        </div>

                        {/* === HISTÓRICO ESTILO GOOGLE KEEP === */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                <BookOpen size={14} /> Histórico de Acompanhamento ({followUps.length} nota{followUps.length !== 1 ? 's' : ''})
                            </h4>
                            {followUps.length === 0 ? (
                                <p className="text-xs text-gray-400 italic text-center py-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed border-gray-200 dark:border-gray-800">
                                    Nenhuma evolução registrada ainda. Salve a primeira nota acima ↑
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {followUps.map((note: any, index: number) => (
                                        <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-center mb-2 pb-1 border-b dark:border-gray-700 border-dashed">
                                                <span className="text-[10px] font-bold text-pink-600 flex items-center gap-1">
                                                    <CheckCircle size={10} />
                                                    {new Date(note.date).toLocaleDateString('pt-BR')} às {new Date(note.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {index === 0 && <span className="text-[9px] bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded font-bold">MAIS RECENTE</span>}
                                            </div>
                                            <div className="space-y-2">
                                                {note.text && (
                                                    <div>
                                                        <p className="text-[11px] text-muted font-semibold mb-0.5">Observações:</p>
                                                        <p className="text-[12px] text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{note.text}</p>
                                                    </div>
                                                )}
                                                {note.carePlan && (
                                                    <div className="bg-blue-50 dark:bg-blue-900/10 p-2 rounded border border-blue-100 dark:border-blue-900/30">
                                                        <strong className="text-[9px] text-blue-700 dark:text-blue-400 block mb-0.5 uppercase">Auto-cuidado / Plano:</strong>
                                                        <p className="text-[12px] text-blue-800 dark:text-blue-300 whitespace-pre-wrap leading-relaxed">{note.carePlan}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 flex-shrink-0">
                    <button onClick={onClose} className="btn btn-outline">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
