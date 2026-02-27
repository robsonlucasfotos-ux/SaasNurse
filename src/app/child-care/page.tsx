'use client';

import { useState, useEffect } from 'react';
import { Baby, AlertCircle, Info, Plus, CalendarDays, Loader2, Users, CheckCircle, AlertTriangle, MessageCircle, Activity } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface Child {
    id: string;
    name: string;
    birth_date: string;
    gender: string;
    risk_level: string;
    guardian_name: string | null;
    guardian_phone: string | null;
    observations: string | null;
    clinical_data?: any; // JSONB
    created_at: string;
}

const childMilestones = [
    {
        id: '2m',
        title: '2 Meses',
        symptoms: [
            { name: 'Marcos do Desenvolvimento', conduct: 'Sorriso social voluntário? Sustenta a cabeça brevemente em prono? Fixa/segue objetos em 180 graus?' },
            { name: 'Fase do Leite & Prevenção', conduct: 'Aleitamento Materno Exclusivo (AME). Proibido chás/água. Prevenção Morte Súbita: Orientar decúbito dorsal (barriga para cima) no berço.' },
            { name: 'Antropometria', conduct: 'Aferir Peso, Estatura, Perímetro Cefálico e avaliar Z-score OMS.' },
        ],
        prescriptions: [
            { med: 'Vacinas (Calendário)', posology: 'Pentavalente (1ªD), VIP (1ªD), Pneumo 10V (1ªD), Rotavírus (1ªD).', pcdt: true },
        ]
    },
    {
        id: '4m',
        title: '4 Meses (Até 6m)',
        symptoms: [
            { name: 'Marcos do Desenvolvimento', conduct: 'Rola intencionalmente? Inicia postura sentada com apoio? Emite sons guturais / gargalhadas? Leva objetos à boca?' },
            { name: 'Orientações', conduct: 'Manutenção do AME. Orientar sobre segurança contra quedas (camas/sofás) e aspiração de objetos.' },
        ],
        prescriptions: [
            { med: 'Vacinas (Calendário)', posology: 'Pentavalente (2ªD), VIP (2ªD), Pneumo 10V (2ªD), Rotavírus (2ªD).', pcdt: true },
        ]
    },
    {
        id: '6m',
        title: '6 Meses',
        symptoms: [
            { name: 'Introdução Alimentar', conduct: 'Alimentos devem ser amassados com garfo (NUNCA liquefeitos). Oferta ativa de água potável. Manter AM.' },
            { name: 'Marcos do Desenvolvimento', conduct: 'Senta sem apoio? Transfere objetos de uma mão para a outra?' },
        ],
        prescriptions: [
            { med: 'Vacinas (Calendário)', posology: 'Pentavalente (3ªD), VIP (3ªD).' },
            { med: 'Sulfato Ferroso (Gotas)', posology: 'Profilaxia: 1mg/kg/dia para crianças em AME até o 24º mês.', pcdt: true },
            { med: 'Vitamina A (Megadose)', posology: '100.000 UI, Via Oral, Dose única.', pcdt: true },
        ]
    },
    {
        id: '9m',
        title: '9 Meses (Até 12m)',
        symptoms: [
            { name: 'Marcos do Desenvolvimento', conduct: 'Engatinha? Fica em pé agarrando móveis? Movimento de pinça (indicador e polegar)? Articula dissílabas (ma-ma, pa-pa)?' },
        ],
        prescriptions: [
            { med: 'Vacinas (Calendário)', posology: 'Febre Amarela (Dose Inicial - em áreas recomendadas).', pcdt: true },
        ]
    },
    {
        id: '12m',
        title: '12 a 24 Meses (1 a 2 Anos)',
        symptoms: [
            { name: 'Marcos e Autonomia', conduct: 'Anda com firmeza? Corre/sobe degraus? Frases de 2-3 palavras? Aponta partes do corpo?' },
            { name: 'Orientações Educativas', conduct: 'Escovação supervisio nada: pasta com flúor (1000-1500ppm) qtd grão de arroz. Proibido telas/smartphones antes dos 24m.' },
        ],
        prescriptions: [
            { med: '12m: Vacinas', posology: 'Tríplice Viral (1ªD), Pneumo 10V (Reforço), Meningo C (Reforço).', pcdt: true },
            { med: '15m: Vacinas', posology: 'DTP (Reforço), VOP (Reforço oral), Hepatite A, Tetra Viral.', pcdt: true },
            { med: 'Vitamina A (Megadose)', posology: '200.000 UI, Via Oral (Reforço anual até 59m).', pcdt: true },
        ]
    }
];

export default function ChildCare() {
    const supabase = createClient();
    const [activeTab, setActiveTab] = useState('2m'); // Changed to string to match childMilestones IDs

    const [children, setChildren] = useState<Child[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Clinical Follow-up Modal State
    const [selectedPatient, setSelectedPatient] = useState<Child | null>(null);
    const [clinicalData, setClinicalData] = useState<any>({});
    const [isSavingClinical, setIsSavingClinical] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [newCarePlan, setNewCarePlan] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        birth_date: '',
        gender: 'Masculino',
        risk_level: 'Baixo',
        guardian_name: '',
        guardian_phone: '',
        observations: ''
    });

    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('children')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setChildren(data);
        } catch (error) {
            console.error('Erro ao listar puericultura:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) throw new Error("Usuário não logado");

            const { error } = await supabase.from('children').insert([{
                user_id: userData.user.id,
                name: formData.name,
                birth_date: formData.birth_date,
                gender: formData.gender,
                risk_level: formData.risk_level,
                guardian_name: formData.guardian_name || null,
                guardian_phone: formData.guardian_phone || null,
                observations: formData.observations || null
            }]);

            if (error) throw error;

            setFormData({ name: '', birth_date: '', gender: 'Masculino', risk_level: 'Baixo', guardian_name: '', guardian_phone: '', observations: '' });
            setShowForm(false);
            fetchChildren();
        } catch (error) {
            console.error("Erro ao salvar criança:", error);
            alert("Não foi possível salvar os dados do recém-nascido.");
        } finally {
            setIsSaving(false);
        }
    };

    const openClinicalModal = (patient: Child) => {
        setSelectedPatient(patient);
        setClinicalData(patient.clinical_data || {});
        setNewNote('');
        setNewCarePlan('');
    };

    const handleClinicalChange = (key: string, value: any) => {
        setClinicalData((prev: any) => ({ ...prev, [key]: value }));
    };

    const saveClinicalData = async () => {
        if (!selectedPatient) return;
        setIsSavingClinical(true);
        try {
            let updatedClinicalData = { ...clinicalData };

            if (newNote.trim() !== '' || newCarePlan.trim() !== '') {
                const followUps = updatedClinicalData.followUps || [];
                updatedClinicalData.followUps = [
                    {
                        date: new Date().toISOString(),
                        text: newNote,
                        carePlan: newCarePlan
                    },
                    ...followUps
                ];
            }

            const { error } = await supabase
                .from('children')
                .update({ clinical_data: updatedClinicalData })
                .eq('id', selectedPatient.id);

            if (error) throw error;

            setChildren(children.map(p => p.id === selectedPatient.id ? { ...p, clinical_data: updatedClinicalData } : p));
            setSelectedPatient(null);
            alert("Acompanhamento salvo com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar acompanhamento:", error);
            alert("Não foi possível salvar o acompanhamento.");
        } finally {
            setIsSavingClinical(false);
        }
    };

    const getAgeInMonthsDetails = (birthStr: string) => {
        const birth = new Date(birthStr);
        const today = new Date();
        let months = (today.getFullYear() - birth.getFullYear()) * 12;
        months -= birth.getMonth();
        months += today.getMonth();

        let display = '';
        if (months < 1) display = '< 1 mês';
        else if (months < 12) display = `${months} meses`;
        else {
            const years = Math.floor(months / 12);
            const remainingMonths = months % 12;
            display = `${years} ano(s)${remainingMonths > 0 ? ` e ${remainingMonths} mês(es)` : ''}`;
        }

        return { months, display };
    };

    return (
        <div className="flex flex-col h-full gap-6 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Baby color="var(--primary)" />
                        Puericultura
                    </h2>
                    <p className="text-muted text-sm mt-1">Crescimento, Desenvolvimento e Aleitamento.</p>
                </div>
            </div>

            {/* Ações (Adicionar Criança) */}
            <div className="flex justify-between items-center bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100">
                <div className="flex flex-col">
                    <h3 className="font-semibold flex items-center gap-2 text-blue-800 dark:text-blue-200">
                        <Users size={18} /> Triagem Ativa
                    </h3>
                    <span className="text-sm text-blue-600/80">Registre novos nascimentos e crianças sob observação.</span>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                    <Plus size={18} /> {showForm ? 'Cancelar' : 'Nova Criança'}
                </button>
            </div>

            {showForm && (
                <div className="card animate-in fade-in slide-in-from-top-4 border-blue-200 shadow-sm">
                    <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-xs font-semibold text-muted ml-1">Nome da Criança *</label>
                            <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-muted ml-1">Data de Nascimento *</label>
                            <input type="date" className="form-control font-medium text-blue-700" required value={formData.birth_date} onChange={e => setFormData({ ...formData, birth_date: e.target.value })} />
                            <span className="text-[10px] text-muted ml-1 flex items-center gap-1"><CalendarDays size={10} /> O sistema recalculará a idade em tempo real</span>
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-xs font-semibold text-muted ml-1">Nome do Responsável (Mãe/Pai/Tutor) *</label>
                            <input type="text" className="form-control" placeholder="Ex: Maria da Silva" required value={formData.guardian_name} onChange={e => setFormData({ ...formData, guardian_name: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-muted ml-1">Telefone do Responsável</label>
                            <input type="tel" className="form-control" placeholder="(61) 9xxxx-xxxx" value={formData.guardian_phone} onChange={e => setFormData({ ...formData, guardian_phone: e.target.value })} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-muted ml-1">Sexo biológico</label>
                            <select className="form-control" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Não informado">Outro / Não informado</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-muted ml-1">Risco Familiar / Clínico</label>
                            <select className="form-control" value={formData.risk_level} onChange={e => setFormData({ ...formData, risk_level: e.target.value })}>
                                <option value="Baixo">Baixo (Habitual)</option>
                                <option value="Moderado">Moderado</option>
                                <option value="Alto">Alto Risco</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-xs font-semibold text-muted ml-1">Observações (Ex: Prematuridade, Comorbidade Mãe)</label>
                            <textarea className="form-control" placeholder="Contexto de Atenção Básica..." rows={2} value={formData.observations} onChange={e => setFormData({ ...formData, observations: e.target.value })} />
                        </div>

                        <div className="md:col-span-2 flex justify-end mt-2">
                            <button type="submit" disabled={isSaving} className="btn bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Cadastrar Puericultura'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Listagem de Crianças Inteligente */}
            {!isLoading && children.length > 0 && (
                <div className="card w-full border-blue-200">
                    <h3 className="mb-4 text-blue-800 font-semibold flex items-center gap-2">
                        <Baby size={18} /> Crianças do Módulo ({children.length})
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="border-b dark:border-gray-700 text-sm font-semibold text-muted">
                                    <th className="p-3">Nome da Criança</th>
                                    <th className="p-3">Idade Exata (Automático)</th>
                                    <th className="p-3">Atributos / Risco</th>
                                    <th className="p-3">Responsável / WhatsApp</th>
                                    <th className="p-3 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {children.map(c => {
                                    const age = getAgeInMonthsDetails(c.birth_date);

                                    // Determinar cor do badge da idade baseado nos meses de vida
                                    let ageColor = 'bg-gray-100 text-gray-700'; // Default
                                    if (age.months < 6) ageColor = 'bg-pink-100 text-pink-700';
                                    else if (age.months < 12) ageColor = 'bg-orange-100 text-orange-700';
                                    else if (age.months < 24) ageColor = 'bg-blue-100 text-blue-700';


                                    return (
                                        <tr key={c.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{c.name}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded text-xs font-bold w-fit ${ageColor}`}>
                                                    {age.display}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold w-fit ${c.risk_level === 'Alto' ? 'bg-red-100 text-red-700 border border-red-200' :
                                                        c.risk_level === 'Moderado' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                                            'bg-green-100 text-green-700'
                                                        }`}>
                                                        {c.risk_level}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-muted text-sm max-w-[150px] truncate">
                                                {c.guardian_name || '-'}
                                                {c.guardian_phone && (
                                                    <a
                                                        href={`https://wa.me/55${c.guardian_phone.replace(/\D/g, '')}?text=Olá ${encodeURIComponent((c.guardian_name || 'responsável').split(' ')[0])}, aqui é a enfermagem da UBS.`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 mt-0.5 text-[10px] text-[#25D366] hover:underline font-semibold"
                                                        title="Chamar no WhatsApp"
                                                    >
                                                        <MessageCircle size={10} /> {c.guardian_phone}
                                                    </a>
                                                )}
                                            </td>
                                            <td className="p-3 text-center flex justify-center gap-2">
                                                {c.guardian_phone ? (
                                                    <a
                                                        href={`https://wa.me/55${c.guardian_phone.replace(/\D/g, '')}?text=Olá ${encodeURIComponent((c.guardian_name || 'responsável').split(' ')[0])}, aqui é a enfermagem da UBS. Gostaria de falar sobre ${encodeURIComponent(c.name)}.`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg transition-colors"
                                                        title={`WhatsApp de ${c.guardian_name}`}
                                                    >
                                                        <MessageCircle size={16} />
                                                    </a>
                                                ) : (
                                                    <button disabled className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed" title="Sem telefone">
                                                        <MessageCircle size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => openClinicalModal(c)}
                                                    className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-1"
                                                    title="Acompanhamento Clínico / Prontuário"
                                                >
                                                    <CheckCircle size={14} /> <span className="text-[10px] uppercase font-bold hidden md:inline">Acompanhar</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Protocolos Literários CD */}
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2>Protocolos Literários CD</h2>
                    <p className="text-muted">Avaliação do crescimento e desenvolvimento por marcos de idade.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {childMilestones.map(m => (
                        <button
                            key={m.id}
                            className={`btn ${activeTab === m.id ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setActiveTab(m.id)}
                        >
                            {m.title}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card w-full flex-1">
                {childMilestones.filter((m: any) => m.id === activeTab).map((m: any) => (
                    <div key={m.id} className="animate-fade-in">
                        <h3 className="flex items-center gap-2 mb-6">
                            <Baby color="var(--primary)" />
                            Condutas: {m.title}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="flex items-center gap-2 font-semibold text-primary mb-3">
                                    <CheckCircle size={16} /> Avaliação Clínica
                                </h4>
                                <ul className="space-y-3">
                                    {m.symptoms.map((s: any, idx: number) => (
                                        <div key={idx} className="p-4 border rounded" style={{ borderColor: 'var(--border)' }}>
                                            <strong>{s.name}</strong>
                                            <p className="text-muted mt-2" style={{ fontSize: '0.9rem' }}>{s.conduct}</p>
                                        </div>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="flex items-center gap-2 mb-4" style={{ color: 'var(--secondary)' }}>
                                    <CheckCircle size={18} /> Prescrições de Rotina (PCDT / RENAME)
                                </h4>
                                <div className="flex flex-col gap-4">
                                    {m.prescriptions.map((p: any, idx: number) => (
                                        <div key={idx} className="p-4 border rounded" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
                                            <strong>{p.med}</strong>
                                            <p className="text-muted mt-2" style={{ fontSize: '0.9rem' }}>{p.posology}</p>
                                            {p.pcdt && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mt-2 inline-block">Conforme Caderno de Atenção Básica</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                            <h4>Mapeamento CIAP-2 Relacionado</h4>
                            <p className="text-muted mt-2 mb-4 text-sm">
                                Códigos pertinentes estruturados no PEC: <strong>-30 (Exame médico completo)</strong>, <strong>-45 (Educação em Saúde/Orientações)</strong>, <strong>-44 (Vacinação preventiva)</strong> e agravos como <strong>D70/D73 (Gastroenterite)</strong>.
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Acompanhamento Clínico */}
            {selectedPatient && (
                <div
                    className="fixed inset-0 flex items-center justify-center p-4"
                    style={{
                        zIndex: 9999,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(4px)',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                    }}
                >
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-primary animate-in fade-in zoom-in-95">
                        <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                            <div>
                                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                    <CheckCircle size={20} />
                                    Prontuário e Acompanhamento Clínico: {selectedPatient.name}
                                </h3>
                                <p className="text-xs text-muted mt-1">
                                    <AlertTriangle size={12} className="inline mr-1 text-warning" />
                                    Prescrição de enfermagem baseada no protocolo local
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedPatient(null)}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                                title="Fechar"
                            >
                                <Plus size={24} className="rotate-45 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
                            {/* Histórico do Paciente */}
                            <div className="card p-4 border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20 shadow-none">
                                <h4 className="font-semibold border-b dark:border-gray-700 pb-2 mb-3 bg-white dark:bg-transparent px-2 py-1 flex items-center gap-2">
                                    <Activity size={16} className="text-primary" /> Histórico de Consultas
                                </h4>

                                <div className="mb-2 max-h-60 overflow-y-auto pr-2 flex flex-col gap-3">
                                    {(!clinicalData?.followUps || clinicalData.followUps.length === 0) ? (
                                        <p className="text-sm text-gray-500 italic text-center py-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                                            Nenhuma evolução registrada ainda.
                                        </p>
                                    ) : (
                                        clinicalData.followUps.map((note: any, index: number) => (
                                            <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                                <div className="flex justify-between items-center mb-2 pb-1 border-b dark:border-gray-700 border-dashed">
                                                    <span className="text-xs font-semibold text-primary flex items-center gap-1">
                                                        <CalendarDays size={12} />
                                                        {new Date(note.date).toLocaleDateString('pt-BR')} às {new Date(note.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className="space-y-2">
                                                    {note.text && (
                                                        <div>
                                                            <strong className="text-xs text-muted block mb-0.5">Observações Clínicas (SOAP):</strong>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{note.text}</p>
                                                        </div>
                                                    )}
                                                    {note.carePlan && (
                                                        <div className="bg-blue-50 dark:bg-blue-900/10 p-2 rounded border border-blue-100 dark:border-blue-900/30 mt-2">
                                                            <strong className="text-xs text-blue-700 dark:text-blue-400 block mb-0.5 flex items-center gap-1">
                                                                <CheckCircle size={12} /> Plano de Ação / Autocuidado e Conduta:
                                                            </strong>
                                                            <p className="text-sm text-blue-800 dark:text-blue-300 whitespace-pre-wrap">{note.carePlan}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Nova Consulta */}
                            <div className="card p-4 border-primary/20 bg-primary/5 shadow-none">
                                <h4 className="font-semibold border-b border-primary/20 pb-2 mb-3 text-primary flex items-center gap-2">
                                    <Plus size={16} /> Nova Evolução
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-semibold text-muted ml-1">Quadro Clínico (Observações / Exames)</label>
                                        <textarea
                                            className="form-control"
                                            placeholder="Sintomas, queixas, aferição de sinais vitais, avaliação de exames..."
                                            rows={4}
                                            value={newNote}
                                            onChange={e => setNewNote(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-semibold text-blue-600 ml-1">Plano de Autocuidado / Ação</label>
                                        <textarea
                                            className="form-control border-blue-200 focus:border-blue-400 bg-blue-50/30"
                                            placeholder="Metas, orientações dietéticas, ajustes, prescrição, encaminhamentos..."
                                            rows={4}
                                            value={newCarePlan}
                                            onChange={e => setNewCarePlan(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 items-center">
                            <span className="text-[10px] text-muted flex-1">✨ A nota será gravada na linha do tempo do paciente.</span>
                            <button
                                onClick={() => setSelectedPatient(null)}
                                className="btn btn-outline"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={saveClinicalData}
                                disabled={isSavingClinical}
                                className="btn btn-primary flex items-center gap-2"
                            >
                                {isSavingClinical ? <Loader2 size={16} className="animate-spin" /> : 'Salvar Evolução'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
