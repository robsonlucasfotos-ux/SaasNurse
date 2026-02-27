'use client';

import { useState, useEffect } from 'react';
import { Activity, Search, HeartPulse, Loader2, MessageCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface Patient {
    id: string;
    name: string;
    age: number;
    phone: string;
    risk_level: string;
    is_pregnant: boolean;
}

export default function WomensHealthPage() {
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
                    .from('pregnant_women')
                    .select('*')
                    .eq('user_id', userData.user.id)
                    .order('name');

                if (error) throw error;
                setPatients(data || []);
            }
        } catch (error) {
            console.error('Error loading womens health patients:', error);
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
                    <Activity className="text-pink-600" /> Saúde da Mulher
                </h2>
                <p className="text-muted">Protocolos de ISTs, Planejamento Familiar e Climatério.</p>
            </div>

            {/* Protocolos Fixos */}
            <div className="card w-full">
                <h3 className="flex items-center gap-2 mb-4 text-pink-600 font-bold">
                    <Activity size={20} /> Planejamento Familiar
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Orientações sobre métodos contraceptivos disponíveis na APS.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-3 border rounded bg-surface text-sm">
                        <strong>Antic. Oral Comb. (Microvlar):</strong> 1 comp/dia. <span className="text-xs text-muted block mt-1">CIAP-2: W11</span>
                    </div>
                    <div className="p-3 border rounded bg-surface text-sm">
                        <strong>Antic. Injetável (Mesigyna/Noregyna):</strong> Mensal. <span className="text-xs text-muted block mt-1">CIAP-2: W11</span>
                    </div>
                    <div className="p-3 border rounded bg-surface text-sm">
                        <strong>DIU de Cobre:</strong> Inserção por enf. capacitado. <span className="text-xs text-muted block mt-1">CIAP-2: W12</span>
                    </div>
                </div>

                <h3 className="flex items-center gap-2 mb-4 mt-8 text-rose-600 font-bold">
                    <Activity size={20} /> Rastreio e Tratamento de ISTs (PCDT)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded bg-rose-50/30 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/30">
                        <strong className="text-rose-800 dark:text-rose-300">Sífilis (VDRL Reagente)</strong>
                        <p className="mt-2 text-xs text-rose-700 dark:text-rose-400">Penicilina G Benzatina 2.400.000 UI IM (1.2 bi em cada glúteo). Repetir conforme fase (1, 2 ou 3 doses). CIAP-2: X70</p>
                    </div>
                    <div className="p-4 border rounded bg-rose-50/30 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/30">
                        <strong className="text-rose-800 dark:text-rose-300">Tricomoníase / Vaginose</strong>
                        <p className="mt-2 text-xs text-rose-700 dark:text-rose-400">Metronidazol 500mg 12/12h por 7 dias. Ou creme vaginal. CIAP-2: X14</p>
                    </div>
                </div>
            </div>

            {/* Lista Unificada de Pacientes (Mulheres) */}
            <div className="card flex-1 flex flex-col min-h-0 border border-pink-100 dark:border-pink-900/20">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold flex items-center gap-2 text-pink-700 dark:text-pink-400">
                        <HeartPulse size={20} /> Relação de Pacientes
                    </h3>
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar paciente mulher..."
                            className="input pl-9 text-sm w-full py-2"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto flex-1 h-full min-h-[300px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="animate-spin text-pink-500" size={32} />
                        </div>
                    ) : patients.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted">
                            <p>Nenhuma paciente feminina cadastrada.</p>
                            <p className="text-xs mt-1">As pacientes cadastradas no Pré-Natal e Crônicos aparecem aqui automaticamente.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b text-muted text-xs uppercase tracking-wider">
                                    <th className="p-3">Paciente</th>
                                    <th className="p-3">Idade</th>
                                    <th className="p-3">Status Específico</th>
                                    <th className="p-3 text-center">Contato</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPatients.map(p => (
                                    <tr key={p.id} className="border-b hover:bg-pink-50/50 dark:hover:bg-pink-900/10 transition-colors">
                                        <td className="p-3">
                                            <span className="font-bold block text-sm">{p.name}</span>
                                        </td>
                                        <td className="p-3 text-sm text-gray-600 dark:text-gray-400">
                                            {p.age} anos
                                        </td>
                                        <td className="p-3">
                                            {p.is_pregnant ? (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">
                                                    Gestante
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-muted italic">Emacompanhamento</span>
                                            )}
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

        </div>
    );
}
