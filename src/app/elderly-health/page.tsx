'use client';

import { useState, useEffect } from 'react';
import { Activity, ClipboardList, Loader2, Search, HeartPulse, MessageCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface Patient {
    id: string;
    name: string;
    age: number;
    phone: string;
    risk_level: string;
    clinical_data?: any;
}

export default function ElderlyHealthPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const supabase = createClient();

    useEffect(() => {
        loadPatients();
    }, [supabase]);

    async function loadPatients() {
        setIsLoading(true);
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (userData.user) {
                const { data, error } = await supabase
                    .from('patients')
                    .select('*')
                    .gte('age', 60)
                    .eq('user_id', userData.user.id)
                    .order('name');

                if (error) throw error;
                setPatients(data || []);
            }
        } catch (error) {
            console.error('Error loading elderly patients:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

            {/* Lista Unificada de Pacientes (Idosos) */}
            <div className="card flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
                        <HeartPulse className="text-rose-500" size={20} /> Pacientes Idosos (60+ anos)
                    </h3>
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar paciente..."
                            className="input pl-9 text-sm w-full py-2"
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
                                    <th className="p-3 text-center">Contato</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPatients.map(p => (
                                    <tr key={p.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="p-3">
                                            <span className="font-bold block text-sm">{p.name}</span>
                                        </td>
                                        <td className="p-3 text-sm text-gray-600 dark:text-gray-400">
                                            {p.age} anos
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.risk_level === 'Alto' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {p.risk_level || 'Habitual'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex justify-center">
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
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Respaldo Jurídico Footer */}
            <div className="mt-auto border-t pt-4 text-center text-xs text-muted">
                <p>Baseado na Lei 7.498/86 e Decreto 94.406/87. Consulte sempre os Manuais do MS e Protocolos Municipais.</p>
            </div>
        </div>
    );
}
