'use client';

import { useState } from 'react';
import { Syringe, Calendar, CheckCircle, ShieldAlert } from 'lucide-react';

// Simplified representation of the Brazilian Immunization Program schedule for the first years
const vaccinationSchedule = [
    { months: 0, vaccines: ['BCG (Prevenção TB Miliar/Meníngea)', 'Hepatite B - 1ª Dose (Prevenção infecção precoce)'] },
    { months: 2, vaccines: ['Pentavalente (DTP/Hib/Hep B) - 1ª Dose', 'VIP (Inativada Poliomielite) - 1ª Dose', 'Pneumo 10 Valente - 1ª Dose', 'Rotavírus Humano - 1ª Dose'] },
    { months: 3, vaccines: ['Meningocócica C - 1ª Dose (Neisseria meningitidis C)'] },
    { months: 4, vaccines: ['Pentavalente - 2ª Dose', 'VIP - 2ª Dose', 'Pneumo 10 Valente - 2ª Dose', 'Rotavírus Humano - 2ª Dose'] },
    { months: 5, vaccines: ['Meningocócica C - 2ª Dose'] },
    { months: 6, vaccines: ['Pentavalente - 3ª Dose', 'VIP - 3ª Dose (Conclusão do esquema primário)'] },
    { months: 9, vaccines: ['Febre Amarela - Dose Inicial (Áreas de recomendação)'] },
    { months: 12, vaccines: ['Tríplice Viral (Sarampo, Caxumba, Rubéola) - 1ª Dose', 'Pneumo 10 Valente - Reforço', 'Meningocócica C - Reforço'] },
    { months: 15, vaccines: ['DTP (Reforço bacteriano)', 'VOP (Poliomielite oral/gotinha)', 'Tetraviral (Tríplice + Varicela)', 'Hepatite A'] },
    { months: 24, vaccines: ['Verificação e resgate de histórico (Ex: Febre Amarela atrasada)', 'Gripe (Influenza) - Anual'] },
    { months: 48, vaccines: ['DTP - 2º Reforço', 'VOP - 2º Reforço', 'Febre Amarela - Reforço'] },
    { months: 108, vaccines: ['HPV (Meninas e Meninos de 9 a 14 anos) - 2 doses'] }
];

export default function VaccinationPage() {
    const [ageMonths, setAgeMonths] = useState<number | ''>('');

    const calculatedStatus = ageMonths !== '' ? vaccinationSchedule.map(s => {
        if (s.months < ageMonths) return { ...s, status: 'passado' };
        if (s.months === ageMonths) return { ...s, status: 'agora' };
        return { ...s, status: 'futuro' };
    }) : [];

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h2>Guia Vacinal (PNI)</h2>
                <p className="text-muted">Consulte o calendário básico da criança e monitore o estado vacinal.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">

                {/* Calculadora */}
                <div className="card md:col-span-1 h-fit" style={{ position: 'sticky', top: '24px' }}>
                    <h3 className="flex items-center gap-2 mb-6" style={{ color: 'var(--primary)' }}>
                        <Calendar size={20} /> Calculadora de Doses
                    </h3>

                    <div className="form-group mb-4">
                        <label className="form-label">Idade da Criança (em meses)</label>
                        <input
                            type="number"
                            min="0"
                            className="form-control text-lg text-center"
                            value={ageMonths}
                            onChange={(e) => setAgeMonths(e.target.value ? parseInt(e.target.value, 10) : '')}
                            placeholder="Ex: 6"
                            autoFocus
                        />
                    </div>
                    {ageMonths !== '' && (
                        <div className="text-sm text-center text-muted border-t pt-4 mt-2" style={{ borderColor: 'var(--border)' }}>
                            <p>Mostrando esquema para: <strong>{ageMonths} meses</strong>.</p>
                            <p className="mt-2 text-xs">
                                <span className="inline-block w-3 h-3 bg-red-100 border border-red-300 rounded-full mr-1 align-middle"></span> Vacinas Atrasadas / Recebidas<br />
                                <span className="inline-block w-3 h-3 bg-green-100 border border-green-500 rounded-full mr-1 align-middle mt-1"></span> Tomar Neste Mês<br />
                                <span className="inline-block w-3 h-3 bg-gray-100 border border-gray-300 rounded-full mr-1 align-middle mt-1"></span> Próximas Vacinas
                            </p>
                        </div>
                    )}
                </div>

                {/* Linha do Tempo */}
                <div className="card md:col-span-2 overflow-y-auto" style={{ maxHeight: '70vh' }}>
                    <h3 className="flex items-center gap-2 mb-6">
                        <Syringe size={20} /> Calendário (0 a 9 anos)
                    </h3>

                    <div className="relative pl-6 border-l-2" style={{ borderColor: 'var(--border)' }}>
                        {(calculatedStatus.length > 0 ? calculatedStatus : vaccinationSchedule).map((item, idx) => {
                            let dotColor = 'var(--border)';
                            let bgColor = 'transparent';
                            let borderColor = 'var(--border)';
                            let textColor = 'var(--text-main)';

                            if ('status' in item) {
                                if (item.status === 'passado') {
                                    dotColor = '#fca5a5'; // red-300
                                    bgColor = 'rgba(254, 226, 226, 0.5)'; // red-100
                                    borderColor = '#fca5a5';
                                    textColor = 'var(--text-muted)';
                                } else if (item.status === 'agora') {
                                    dotColor = '#10b981'; // green-500
                                    bgColor = 'rgba(16, 185, 129, 0.1)';
                                    borderColor = '#10b981';
                                }
                            }

                            return (
                                <div key={idx} className="mb-8 relative p-4 rounded-lg transition-colors border" style={{ backgroundColor: bgColor, borderColor: borderColor }}>
                                    {/* Timeline Dot */}
                                    <div className="absolute w-4 h-4 rounded-full" style={{
                                        left: '-33px',
                                        top: '16px',
                                        backgroundColor: dotColor,
                                        border: '2px solid var(--surface-main)'
                                    }}></div>

                                    <h4 className="flex justify-between font-bold" style={{ color: textColor }}>
                                        <span>
                                            {item.months === 0 ? 'Ao nascer' :
                                                item.months >= 12 && item.months % 12 === 0 ? `${item.months / 12} Ano(s)` :
                                                    `${item.months} Meses`}
                                        </span>
                                        {'status' in item && item.status === 'agora' && (
                                            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full flex items-center gap-1">
                                                <CheckCircle size={12} /> APLICAR HOJE
                                            </span>
                                        )}
                                        {'status' in item && item.status === 'passado' && (
                                            <span className="text-xs text-red-500 flex items-center gap-1">
                                                <ShieldAlert size={14} /> CHECAR CADERNETA
                                            </span>
                                        )}
                                    </h4>

                                    <ul className="mt-3 space-y-2 ml-4 list-disc text-sm" style={{ color: textColor }}>
                                        {item.vaccines.map((vac, vIdx) => (
                                            <li key={vIdx}>{vac}</li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
