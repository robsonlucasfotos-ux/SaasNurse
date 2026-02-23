'use client';

import { Syringe, AlertTriangle } from 'lucide-react';

export default function VaccinationPage() {
    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h2>Vacinação (Calendário PNI)</h2>
                <p className="text-muted">Aprazamento e alertas de imunização atrasada (foco 1 a 4 anos).</p>
            </div>

            <div className="card w-full flex-1">
                <h3 className="flex items-center gap-2 mb-6" style={{ color: 'var(--warning)' }}>
                    <Syringe /> Doses de Reforço Importantes (1 a 4 Anos)
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded bg-orange-50" style={{ borderColor: 'var(--warning)' }}>
                        <strong className="text-warning flex items-center gap-2">
                            <AlertTriangle size={16} /> 15 Meses
                        </strong>
                        <ul className="mt-2 text-sm text-gray-800 ml-4 list-disc">
                            <li>DTP (1º Reforço)</li>
                            <li>VOPb (1º Reforço)</li>
                            <li>Hepatite A (Dose Única)</li>
                            <li>Tetraviral (Dose Única)</li>
                        </ul>
                    </div>

                    <div className="p-4 border rounded bg-orange-50" style={{ borderColor: 'var(--warning)' }}>
                        <strong className="text-warning flex items-center gap-2">
                            <AlertTriangle size={16} /> 4 Anos
                        </strong>
                        <ul className="mt-2 text-sm text-gray-800 ml-4 list-disc">
                            <li>DTP (2º Reforço)</li>
                            <li>VOPb (2º Reforço)</li>
                            <li>Varicela (Reforço)</li>
                            <li>Febre Amarela (Reforço)</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8">
                    <h4>CIAP-2 para Vacinação</h4>
                    <p className="text-muted text-sm mt-2">
                        Registro de procedimentos: <strong>A44 (Imunização/Medicamento preventivo)</strong>
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                    <button className="btn btn-secondary w-full" onClick={() => window.location.href = '/soap'}>
                        Registrar Administração Analítica (SOAP)
                    </button>
                </div>
            </div>
        </div>
    );
}
