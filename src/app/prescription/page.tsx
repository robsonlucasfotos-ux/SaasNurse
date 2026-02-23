'use client';

import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Printer, Plus, Trash2, FileText } from 'lucide-react';
import MedicationSelect from '@/components/MedicationSelect';
import { Medication } from '@/data/rename2024';

interface PrescribedMed {
    medication: Medication;
    quantity: string;
}

export default function PrescriptionPage() {
    const [patientName, setPatientName] = useState('');
    const [susCard, setSusCard] = useState('');
    const [meds, setMeds] = useState<PrescribedMed[]>([]);
    const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
    const [quantity, setQuantity] = useState('1 cx');

    const addMedication = () => {
        if (selectedMed) {
            setMeds([...meds, { medication: selectedMed, quantity }]);
            setSelectedMed(null);
            setQuantity('1 cx');
        }
    };

    const removeMedication = (idx: number) => {
        const newMeds = [...meds];
        newMeds.splice(idx, 1);
        setMeds(newMeds);
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('RECEITUÁRIO', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Sistema Único de Saúde (SUS) - Atenção Primária', 105, 30, { align: 'center' });

        // Patient Info
        doc.setFont('helvetica', 'bold');
        doc.text("Paciente:", 20, 50);
        doc.setFont('helvetica', 'normal');
        doc.text(patientName || '____________________________________________________', 45, 50);

        doc.setFont('helvetica', 'bold');
        doc.text("Cartão SUS:", 20, 60);
        doc.setFont('helvetica', 'normal');
        // Using string concat to avoid backslashes issues inside the prompt for generating JS string literals
        doc.text(susCard || '____________________________________________________', 50, 60);

        // Meds
        doc.setFont('helvetica', 'bold');
        doc.text('Uso Oral / Tópico / Injetável:', 20, 80);

        let y = 95;
        meds.forEach((m, i) => {
            doc.setFont('helvetica', 'bold');
            doc.text((i + 1) + ") " + m.medication.name + " - " + m.medication.presentation, 20, y);
            doc.text(m.quantity, 170, y);

            y += 8;
            doc.setFont('helvetica', 'normal');
            // Split posology to fit line
            const splitPosology = doc.splitTextToSize(m.medication.posology_suggestions, 160);
            doc.text(splitPosology, 25, y);

            y += (splitPosology.length * 7) + 5;
        });

        // Signature Line
        doc.line(70, y + 40, 140, y + 40);
        doc.text('Assinatura e Carimbo do Enfermeiro(a)', 105, y + 45, { align: 'center' });

        // Legal Footer
        doc.setFontSize(8);
        doc.setTextColor(100); // Gray
        const legalText = 'Prescrição realizada conforme Lei Federal nº 7.498/86, Decreto nº 94.406/87 e Portaria MS nº 2.436/17';
        doc.text(legalText, 105, 280, { align: 'center' });

        window.open(doc.output('bloburl'), '_blank');
    };

    return (
        <div className="flex flex-col h-full">
            <div className="mb-6">
                <h2>Emissor de Receituário</h2>
                <p className="text-muted">Geração rápida de receitas padronizadas (RENAME 2024) com respaldo legal do COFEN.</p>
            </div>

            <div className="grid grid-cols-2 gap-8 flex-1">
                <div className="card h-fit">
                    <h3 className="mb-4 text-lg border-b pb-2" style={{ borderColor: 'var(--border)' }}>Dados da Prescrição</h3>

                    <div className="form-group">
                        <label className="form-label">Nome do Paciente</label>
                        <input
                            type="text"
                            className="form-control"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            placeholder="Ex: Maria Joaquina da Silva"
                        />
                    </div>

                    <div className="form-group mb-6">
                        <label className="form-label">Cartão do SUS (CNS)</label>
                        <input
                            type="text"
                            className="form-control"
                            value={susCard}
                            onChange={(e) => setSusCard(e.target.value)}
                            placeholder="Ex: 700 0000 0000 0000"
                        />
                    </div>

                    <div className="border border-dashed p-4 rounded mb-6" style={{ borderColor: 'var(--border)' }}>
                        <h4 className="mb-4 text-sm font-semibold uppercase text-muted">Adicionar Item</h4>

                        <div className="mb-4">
                            <MedicationSelect
                                selectedMed={selectedMed}
                                onSelect={setSelectedMed}
                            />
                        </div>

                        <div className="flex gap-4 items-end">
                            <div className="flex-1">
                                <label className="form-label text-sm">Quantidade</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="Ex: 1 caixa, 30 comp..."
                                />
                            </div>
                            <button
                                className="btn btn-primary"
                                onClick={addMedication}
                                disabled={!selectedMed}
                            >
                                <Plus size={18} /> Incluir
                            </button>
                        </div>
                    </div>
                </div>

                <div className="card flex flex-col h-full">
                    <h3 className="mb-4 text-lg border-b pb-2 flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
                        <span>Itens da Receita ({meds.length})</span>
                        <button
                            className="btn btn-secondary text-sm py-1 px-3 h-auto"
                            onClick={generatePDF}
                            disabled={meds.length === 0}
                        >
                            <Printer size={16} /> Imprimir PDF
                        </button>
                    </h3>

                    <div className="flex-1 overflow-y-auto">
                        {meds.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted">
                                <FileText size={48} className="mb-4 opacity-50" />
                                <p>Nenhum medicamento adicionado à receita.</p>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {meds.map((m, idx) => (
                                    <li key={idx} className="p-4 border rounded relative group" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hover)' }}>
                                        <button
                                            className="absolute top-2 right-2 text-danger opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded"
                                            onClick={() => removeMedication(idx)}
                                            title="Remover Item"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="font-bold flex justify-between pr-8">
                                            <span>{idx + 1}. {m.medication.name}</span>
                                            <span className="text-primary">{m.quantity}</span>
                                        </div>
                                        <div className="text-sm text-muted mt-1">{m.medication.presentation}</div>
                                        <div className="text-sm mt-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                                            <strong>Uso:</strong> {m.medication.posology_suggestions}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {meds.length > 0 && (
                        <div className="mt-4 pt-4 border-t text-xs text-center text-muted" style={{ borderColor: 'var(--border)' }}>
                            A receita PDF será gerada com o alerta legal da Lei nº 7.498/86 no rodapé.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
