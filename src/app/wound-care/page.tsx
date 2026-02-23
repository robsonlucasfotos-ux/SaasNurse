'use client';

import { useState, useEffect } from 'react';
import { Thermometer, Camera, Save, Image as ImageIcon, Trash2 } from 'lucide-react';

interface WoundEvolution {
    id: string;
    patientName: string;
    date: string;
    lesionType: string;
    treatment: string;
    photoBase64: string;
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
    const [newEvo, setNewEvo] = useState({ patientName: '', date: new Date().toISOString().split('T')[0], lesionType: 'Granulação (Vermelho)', treatment: '', photoBase64: '' });

    useEffect(() => {
        const saved = localStorage.getItem('wound_evolutions_v1');
        if (saved) {
            try { setEvolutions(JSON.parse(saved)); } catch (e) { }
        }
    }, []);

    const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewEvo(prev => ({ ...prev, photoBase64: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const saveEvolution = () => {
        if (!newEvo.patientName || !newEvo.treatment) {
            alert("Preencha o nome do paciente e o tratamento.");
            return;
        }
        const evo: WoundEvolution = { ...newEvo, id: Date.now().toString() };
        const updated = [evo, ...evolutions];
        setEvolutions(updated);
        localStorage.setItem('wound_evolutions_v1', JSON.stringify(updated));
        setNewEvo(prev => ({ ...prev, treatment: '', photoBase64: '' }));
    };

    const deleteEvolution = (id: string) => {
        if (confirm("Deseja apagar este registro?")) {
            const updated = evolutions.filter(e => e.id !== id);
            setEvolutions(updated);
            localStorage.setItem('wound_evolutions_v1', JSON.stringify(updated));
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
                                        <ImageIcon size={16} /> {newEvo.photoBase64 ? 'Substituir Foto' : 'Capturar/Anexar Foto'}
                                        <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                                    </label>
                                    {newEvo.photoBase64 && (
                                        <span className="text-xs text-green-600 flex items-center gap-1">Imagem em anexo ✓</span>
                                    )}
                                </div>
                            </div>
                            <button className="btn btn-primary w-full flex items-center justify-center gap-2 mt-4" onClick={saveEvolution}>
                                <Save size={18} /> Salvar no Prontuário Local
                            </button>
                        </div>
                    </div>

                    {/* Linha do Tempo */}
                    <div>
                        <h4 className="mb-4 flex justify-between items-center">
                            Histórico de Pacientes
                            <span className="text-xs font-normal text-muted bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Local Storage</span>
                        </h4>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                            {evolutions.length === 0 ? (
                                <p className="text-xs text-muted italic">Você ainda não registrou a evolução de nenhum curativo.</p>
                            ) : (
                                evolutions.map(evo => (
                                    <div key={evo.id} className="p-4 border rounded bg-surface relative hover:border-gray-300 transition-colors">
                                        <button className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded transition-colors" title="Apagar Ocorrência" onClick={() => deleteEvolution(evo.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="flex justify-between items-start mb-2 pr-6">
                                            <strong>{evo.patientName}</strong>
                                            <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded font-mono">
                                                {evo.date.split('-').reverse().join('/')}
                                            </span>
                                        </div>
                                        <span className="inline-block text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-800 rounded mb-2">
                                            {evo.lesionType}
                                        </span>
                                        <p className="text-sm text-muted mt-1 mb-3"><strong>Conduta:</strong> {evo.treatment}</p>

                                        {evo.photoBase64 && (
                                            <div className="mt-2 rounded overflow-hidden flex justify-center bg-gray-900 border border-gray-200" style={{ maxHeight: '200px' }}>
                                                <img src={evo.photoBase64} alt={`Evolução da lesão`} className="h-full w-auto object-contain max-w-full" />
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
