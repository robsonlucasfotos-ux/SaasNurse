'use client';

import { useState, useEffect } from 'react';
import {
    BarChart3, TrendingUp, Target, Users,
    Baby, Stethoscope, Activity, ShieldCheck,
    AlertCircle, Loader2, ArrowUpRight
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface IndicatorData {
    numerator: number;
    denominator: number;
}

interface PrevineStats {
    kpi1: IndicatorData; // Prenatal 6+
    kpi2: IndicatorData; // Exams HIV/Syphilis
    kpi3: IndicatorData; // Dental
    kpi4: IndicatorData; // Cytopathology
    kpi5: IndicatorData; // Vaccination Polio/Penta
    kpi6: IndicatorData; // HAS BP Check
    kpi7: IndicatorData; // DM HbA1c Check
}

export default function StrategicManagementPage() {
    const [stats, setStats] = useState<PrevineStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        loadStats();
    }, []);

    async function loadStats() {
        setIsLoading(true);
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (userData.user) {
                const { data, error } = await supabase.rpc('get_previne_brasil_stats', {
                    uid: userData.user.id
                });
                if (error) throw error;
                setStats(data);
            }
        } catch (error) {
            console.error('Error loading Previne stats:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const renderIndicator = (
        title: string,
        data: IndicatorData | undefined,
        goal: number,
        icon: React.ReactNode,
        colorClass: string
    ) => {
        const percentage = data && data.denominator > 0
            ? Math.round((data.numerator / data.denominator) * 100)
            : 0;

        const isMet = percentage >= goal;

        return (
            <div className="card bg-surface border-l-4 shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between" style={{ borderLeftColor: `var(--${colorClass})` }}>
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-lg bg-${colorClass}/10 text-${colorClass}`}>
                            {icon}
                        </div>
                        <div className={`flex items-center gap-1 text-xs font-bold ${isMet ? 'text-green-600' : 'text-orange-500'}`}>
                            {isMet ? <ShieldCheck size={14} /> : <AlertCircle size={14} />}
                            {isMet ? 'META ATINGIDA' : 'EM EVOLUÇÃO'}
                        </div>
                    </div>
                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 leading-tight mb-2">
                        {title}
                    </h4>
                    <div className="flex items-end gap-2 mb-1">
                        <span className="text-3xl font-black">{percentage}%</span>
                        <span className="text-[10px] text-muted mb-1.5 font-medium">Meta MS: {goal}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mb-4">
                        <div
                            className={`h-2 rounded-full transition-all duration-1000 bg-${colorClass}`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                    </div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-muted border-t pt-3">
                    <span>{data?.numerator || 0} de {data?.denominator || 0} pacientes</span>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                        DETALHES <ArrowUpRight size={12} />
                    </button>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full gap-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="flex items-center gap-2">
                        <BarChart3 className="text-primary" /> Gestão Estratégica
                    </h2>
                    <p className="text-muted">Painel Tático de Indicadores Previne Brasil (ISF).</p>
                </div>
                <div className="flex items-center gap-3 bg-primary/5 px-4 py-2 rounded-xl border border-primary/10">
                    <div className="text-right">
                        <span className="text-[10px] font-bold text-primary block uppercase">ISF Estimado</span>
                        <span className="text-xl font-black text-primary">8.45</span>
                    </div>
                    <TrendingUp className="text-primary" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* KPI 1: Pré-natal (6+ consultas) */}
                {renderIndicator(
                    "Proporção de gestantes com pelo menos 6 consultas (1ª até a 12ª semana)",
                    stats?.kpi1,
                    45,
                    <Users size={20} />,
                    "primary"
                )}

                {/* KPI 2: HIV / Sífilis */}
                {renderIndicator(
                    "Proporção de gestantes com exames de Sífilis e HIV realizados",
                    stats?.kpi2,
                    60,
                    <Stethoscope size={20} />,
                    "danger"
                )}

                {/* KPI 3: Odonto Gestante */}
                {renderIndicator(
                    "Proporção de gestantes com atendimento odontológico realizado",
                    stats?.kpi3,
                    60,
                    <TrendingUp size={20} />,
                    "blue-500"
                )}

                {/* KPI 4: Citopatológico */}
                {renderIndicator(
                    "Proporção de mulheres com coleta de citopatológico (25 a 64 anos)",
                    stats?.kpi4,
                    40,
                    <Activity size={20} />,
                    "purple-500"
                )}

                {/* KPI 5: Vacinação Infantil */}
                {renderIndicator(
                    "Proporção de crianças de 1 ano vacinadas (Penta e Polio)",
                    stats?.kpi5,
                    95,
                    <Baby size={20} />,
                    "green-600"
                )}

                {/* KPI 6: HAS (PA Aferida) */}
                {renderIndicator(
                    "Proporção de pessoas com hipertensão, com PA aferida no semestre",
                    stats?.kpi6,
                    50,
                    <Target size={20} />,
                    "orange-500"
                )}

                {/* KPI 7: DM (HbA1c) */}
                {renderIndicator(
                    "Proporção de pessoas com diabetes, com consulta e HbA1c no semestre",
                    stats?.kpi7,
                    50,
                    <Activity size={20} />,
                    "blue-600"
                )}

                <div className="card bg-gradient-to-br from-primary to-indigo-700 text-white p-6 justify-center items-center text-center hidden lg:flex">
                    <div>
                        <Target size={40} className="mx-auto mb-4 opacity-50" />
                        <h4 className="font-bold mb-2">Foco no Q1 2026</h4>
                        <p className="text-xs opacity-90 leading-relaxed">
                            Sua unidade atingiu 4 das 7 metas. Foque na busca ativa de crianças para vacinação.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-auto grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                <div className="card p-5 bg-gray-50 dark:bg-gray-800/40 border-dashed">
                    <h5 className="text-sm font-bold mb-4 flex items-center gap-2">
                        <AlertCircle size={16} className="text-orange-500" /> Alerta de Busca Ativa
                    </h5>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs p-2 bg-white dark:bg-gray-800 rounded border">
                            <span>Indicador 5: 12 crianças sem dose de reforço</span>
                            <button className="text-primary font-bold">Gerar Lista</button>
                        </div>
                        <div className="flex items-center justify-between text-xs p-2 bg-white dark:bg-gray-800 rounded border">
                            <span>Indicador 1: 4 gestantes com captação tardia</span>
                            <button className="text-primary font-bold">Verificar</button>
                        </div>
                    </div>
                </div>
                <div className="card p-5 bg-blue-50 dark:bg-blue-900/10 border-blue-100">
                    <h5 className="text-sm font-bold mb-2 text-blue-700">Dica NurseAI para Gestores</h5>
                    <p className="text-xs text-blue-600 leading-relaxed">
                        O registro da consulta odontológica no e-SUS deve ser vinculado ao CPF ou CNS da gestante para o indicador 3. No Guia APS, nós já validamos isso para você!
                    </p>
                </div>
            </div>
        </div>
    );
}
