'use client';

import { useState, useEffect } from 'react';
import { Thermometer, Camera, Save, Image as ImageIcon, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface WoundEvolution {
    id: string;
    patientId: string;
    patientName: string;
    date: string;
    lesionType: string;
    rybStatus: string;
    treatment: string;
    photoUrl: string | null;
}

const rybSystem = [
    {
        color: 'Red (Vermelho)',
        status: 'Fase Proliferativa (Granulação)',
        description: 'Tecido altamente vascularizado, limpo e saudável.',
        conduct: 'Limpeza com Solução Salina Isotônica. Manter úmido e proteger com Hidrogel ou Placa de Hidrocolóide.',
        hex: '#ef4444'
    },
    {
        color: 'Yellow (Amarelo)',
        status: 'Esfacelo / Fibrina',
        description: 'Tecido desvitalizado fibroso e alta produção de exsudato inflamatório.',
        conduct: 'Desbridamento autolítico + controle de umidade. Ex: Alginato de Cálcio (torna-se gel hemostático).',
        hex: '#f59e0b'
    },
    {
        color: 'Black (Preto)',
        status: 'Necrose Isquêmica',
        description: 'Tecido morto profundo. Impede contração e serve como meio de cultura para infecções.',
        conduct: 'Desbridamento enzimático (Colagenase/Papaína), instrumental conservador (tesoura/bisturi) ou cirúrgico.',
        hex: '#1f2937'
    }
];

export default function WoundCarePage() {
    const [selectedWound, setSelectedWound] = useState<null | number>(null);
    const [evolutions, setEvolutions] = useState<WoundEvolution[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [newEvo, setNewEvo] = useState({ patientName: '', cpf: '', date: new Date().toISOString().split('T')[0], lesionType: 'Granulação (Vermelho)', treatment: '', photoFile: null as File | null, photoPreview: '' });

    useEffect(() => {
        fetchEvolutions();
    }, []);

    const fetchEvolutions = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('wound_evolutions')
                .select(`
                    id, date, lesion_type, ryb_color, ryb_status, conduct, photo_url,
                    patient:patient_id (id, name, cpf)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const formatted = data.map((d: any) => ({
                    id: d.id,
                    patientId: d.patient?.id || '',
                    patientName: d.patient?.name || 'Paciente Desconhecido',
                    date: d.date.split('T')[0],
                    lesionType: d.lesion_type,
                    rybStatus: d.ryb_status,
                    treatment: d.conduct,
                    photoUrl: d.photo_url
                }));
                setEvolutions(formatted);
            }
        } catch (error) {
            console.error('Erro ao buscar evoluções:', error);
            alert('Não foi possível carregar o histórico de curativos.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewEvo(prev => ({ ...prev, photoFile: file, photoPreview: URL.createObjectURL(file) }));
        }
    };

    const saveEvolution = async () => {
        if (!newEvo.patientName || !newEvo.treatment) {
            alert("Preencha o nome do paciente e o tratamento.");
            return;
        }

        setIsSaving(true);
        try {
            // 1. Achar ou Criar Paciente
            let patientId = '';

            // Busca simplificada pelo nome (No mundo real, usaríamos filtro composto ou select prévio)
            const { data: existingPatients, error: pSearchErr } = await supabase
                .from('patients')
                .select('id')
                .eq('name', newEvo.patientName)
                .limit(1);

            if (pSearchErr) throw pSearchErr;

            if (existingPatients && existingPatients.length > 0) {
                patientId = existingPatients[0].id;
            } else {
                // Cria novo
                const { data: newPatient, error: pCreateErr } = await supabase
                    .from('patients')
                    .insert([{ name: newEvo.patientName }])
                    .select('id')
                    .single();

                if (pCreateErr) throw pCreateErr;
                patientId = newPatient.id;
            }

            // 2. Upload da Foto (se houver)
            let photoUrl = null;
            if (newEvo.photoFile) {
                const fileExt = newEvo.photoFile.name.split('.').pop();
                const fileName = `${patientId}-${Date.now()}.${fileExt}`;
                const { error: uploadError, data: uploadData } = await supabase.storage
                    .from('feridas')
                    .upload(fileName, newEvo.photoFile);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from('feridas')
                    .getPublicUrl(fileName);

                photoUrl = publicUrlData.publicUrl;
            }

            // 3. Salvar Evolução
            const { error: evoError } = await supabase
                .from('wound_evolutions')
                .insert([{
                    patient_id: patientId,
                    date: new Date(newEvo.date).toISOString(),
                    lesion_type: newEvo.lesionType,
                    ryb_color: newEvo.lesionType.includes('Vermelho') ? 'Red' : newEvo.lesionType.includes('Amarelo') ? 'Yellow' : 'Black',
                    ryb_status: newEvo.lesionType,
                    conduct: newEvo.treatment,
                    photo_url: photoUrl
                }]);

            if (evoError) throw evoError;

            // Sucesso!
            setNewEvo({ patientName: '', cpf: '', date: new Date().toISOString().split('T')[0], lesionType: 'Granulação (Vermelho)', treatment: '', photoFile: null, photoPreview: '' });
            fetchEvolutions();

        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Falha ao salvar a evolução no banco de dados.");
        } finally {
            setIsSaving(false);
        }
    };

    const deleteEvolution = async (id: string, photoUrl: string | null) => {
        if (!confirm("Deseja apagar este registro do banco de dados?")) return;

        try {
            // Apaga do storage se tiver foto
            if (photoUrl) {
                const fileName = photoUrl.split('/').pop();
                if (fileName) {
                    await supabase.storage.from('feridas').remove([fileName]);
                }
            }

            // Apaga do banco
            const { error } = await supabase.from('wound_evolutions').delete().eq('id', id);
            if (error) throw error;

            fetchEvolutions();
        } catch (error) {
            console.error("Erro ao deletar:", error);
            alert("Falha ao deletar a evolução.");
        }
    };

    return (
        <div className="flex flex-col h-full gap-6">
            <div>
                <h2>Manejo de Feridas e Curativos</h2>
                <p className="text-muted">Guia de condutas (Sistema RYB) e diário de evolução fotográfica das lesões.</p>
            </div>

            <div className="card">
                <h3 className="flex items-center gap-2 mb-4" style={{ color: '#ef4444' }}>
                    <Thermometer size={22} /> Sistema RYB (Protocolo de Curativos)
                </h3>
                <p className="text-sm text-muted mb-6">Guia rápido para conduta em leito de ferida crônica conforme características do tecido.</p>

                <div className="flex flex-col gap-3">
                    {rybSystem.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedWound(idx)}
                            className={`p-4 border rounded text-left transition-all ${selectedWound === idx ? 'ring-2 ring-primary border-primary' : 'hover:border-primary'}`}
                            style={{ borderLeft: `6px solid ${item.hex}` }}
                        >
                            <div className="flex justify-between items-center">
                                <strong>{item.color}</strong>
                                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: item.hex }}>{item.status}</span>
                            </div>
                        </button>
                    ))}
                </div>

                {selectedWound !== null && (
                    <div className="mt-6 p-4 rounded animate-fade-in" style={{ backgroundColor: `${rybSystem[selectedWound].hex}10`, border: `1px solid ${rybSystem[selectedWound].hex}` }}>
                        <h4 style={{ color: rybSystem[selectedWound].hex, marginBottom: '0.5rem' }}>{rybSystem[selectedWound].status}</h4>
                        <p className="text-sm"><strong>Fisiologia:</strong> {rybSystem[selectedWound].description}</p>
                        <p className="text-sm mt-2"><strong>Conduta (RENAME e Protocolo Local):</strong> {rybSystem[selectedWound].conduct}</p>
                        {selectedWound === 2 && (
                            <p className="text-xs text-red-600 mt-2 font-bold py-1 px-2 border border-red-200 bg-red-50 rounded">
                                Alerta: O tratamento tópico deve ser sempre acompanhado de suporte analgésico sistêmico (ex: Dipirona/Paracetamol) e avaliação nutricional hiperproteica (neocolaegênese).
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Diário de Evolução Fotográfica */}
            <div className="card flex-1">
                <h3 className="flex items-center gap-2 mb-4" style={{ color: 'var(--primary)' }}>
                    <Camera size={22} /> Diário Fotográfico da Lesão
                </h3>
                <p className="text-sm text-muted mb-6">Registre e acompanhe a evolução das lesões dos pacientes com fotos cronológicas.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Formulário */}
                    <div className="bg-surface p-4 rounded border">
                        <h4 className="mb-4">Novo Registro Clínico</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="form-label text-sm">Nome do Paciente / Prontuário</label>
                                <input type="text" className="form-control text-sm" value={newEvo.patientName} onChange={(e) => setNewEvo({ ...newEvo, patientName: e.target.value })} placeholder="Ex: Maria da Silva" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label text-sm">Data do Curativo</label>
                                    <input type="date" className="form-control text-sm" value={newEvo.date} onChange={(e) => setNewEvo({ ...newEvo, date: e.target.value })} />
                                </div>
                                <div>
                                    <label className="form-label text-sm">Tecido Dominante</label>
                                    <select className="form-control text-sm" value={newEvo.lesionType} onChange={(e) => setNewEvo({ ...newEvo, lesionType: e.target.value })}>
                                        <option>Granulação (Vermelho)</option>
                                        <option>Esfacelo (Amarelo)</option>
                                        <option>Necrose (Preto)</option>
                                        <option>Epitelização (Rosa)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="form-label text-sm">Conduta Aplicada (Limpeza e Cobertura)</label>
                                <textarea className="form-control text-sm" rows={2} value={newEvo.treatment} onChange={(e) => setNewEvo({ ...newEvo, treatment: e.target.value })} placeholder="Ex: Limpeza com SF 0,9% em jato, desbridamento autolítico com papaína a 2%..."></textarea>
                            </div>
                            <div>
                                <label className="form-label text-sm">Evidência Fotográfica</label>
                                <div className="flex items-center gap-4">
                                    <label className="btn btn-outline flex items-center gap-2 cursor-pointer text-sm py-2 px-3">
                                        <ImageIcon size={16} /> {newEvo.photoPreview ? 'Substituir Foto' : 'Capturar/Anexar Foto'}
                                        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
                                    </label>
                                    {newEvo.photoPreview && (
                                        <span className="text-xs text-green-600 flex items-center gap-1">Imagem pronta ✓</span>
                                    )}
                                </div>
                            </div>
                            <button className="btn btn-primary w-full flex items-center justify-center gap-2 mt-4" onClick={saveEvolution} disabled={isSaving}>
                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {isSaving ? 'Salvando na Nuvem...' : 'Salvar no Prontuário'}
                            </button>
                        </div>
                    </div>

                    {/* Linha do Tempo */}
                    <div>
                        <h4 className="mb-4 flex justify-between items-center">
                            Histórico de Pacientes
                            <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full flex items-center gap-1">
                                <span className="status-dot green" style={{ width: 6, height: 6 }} />
                                Supabase Cloud
                            </span>
                        </h4>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 pb-12">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-10 text-muted">
                                    <Loader2 size={24} className="animate-spin mb-2" />
                                    <p className="text-sm">Carregando da nuvem...</p>
                                </div>
                            ) : evolutions.length === 0 ? (
                                <p className="text-xs text-muted italic text-center py-6">Nenhum curativo registrado no banco de dados.</p>
                            ) : (
                                evolutions.map(evo => (
                                    <div key={evo.id} className="p-4 border rounded bg-surface relative hover:border-blue-300 transition-colors shadow-sm">
                                        <button className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded transition-colors" title="Apagar Ocorrência" onClick={() => deleteEvolution(evo.id, evo.photoUrl)}>
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="flex justify-between items-start mb-2 pr-6">
                                            <strong className="text-[15px]">{evo.patientName}</strong>
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-mono border">
                                                {evo.date.split('-').reverse().join('/')}
                                            </span>
                                        </div>
                                        <span className="inline-block text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-700 rounded-md mb-2 border border-blue-100">
                                            {evo.lesionType}
                                        </span>
                                        <p className="text-sm text-gray-700 mt-1 mb-3"><strong>Conduta:</strong> {evo.treatment}</p>

                                        {evo.photoUrl && (
                                            <div className="mt-3 rounded-lg overflow-hidden flex justify-center bg-gray-50 border border-gray-200">
                                                <img src={evo.photoUrl} alt={`Lesão do paciente`} className="h-48 w-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto border-t pt-4 text-center text-xs text-muted">
                <p>O registro fotográfico deve integrar o prontuário do paciente em respeito à Resolução Cofen 311/2007 de sigilo ético.</p>
            </div>
        </div>
    );
}
