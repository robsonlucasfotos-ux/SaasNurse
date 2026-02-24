'use client';

import { useState, useRef, useEffect } from 'react';
import { Save, FileText, BookOpen, PenTool, Download, User, Mic, MicOff, Activity } from 'lucide-react';

export default function SoapEvolution() {
    const [soap, setSoap] = useState({
        paciente: '',
        motivo: '',
        subjetivo: '',
        objetivo: '',
        avaliacao: '',
        plano: ''
    });

    const [sysConfig, setSysConfig] = useState({
        name: 'Unidade Básica de Saúde',
        phone: '',
        address: ''
    });

    useEffect(() => {
        setSysConfig({
            name: localStorage.getItem('clinica_name') || 'Unidade Básica de Saúde',
            phone: localStorage.getItem('clinica_phone') || '',
            address: localStorage.getItem('clinica_address') || ''
        });
    }, []);

    const [isGenerating, setIsGenerating] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    // --- LOGICA DE VOICE-TO-TEXT ---
    const [recordingField, setRecordingField] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);
    const [isAILoading, setIsAILoading] = useState(false);

    const handleAIStructure = async () => {
        // Pega o que está escrito e tenta estruturar
        const combinedText = `
            Paciente: ${soap.paciente}
            Motivo: ${soap.motivo}
            Subjetivo: ${soap.subjetivo}
            Objetivo: ${soap.objetivo}
            Avaliação: ${soap.avaliacao}
            Plano: ${soap.plano}
        `;

        if (combinedText.trim().length < 20) {
            alert('Por favor, dite ou escreva o relato do paciente antes de estruturar com IA.');
            return;
        }

        setIsAILoading(true);
        try {
            const res = await fetch('/api/ai/structure-soap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: combinedText })
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setSoap(prev => ({
                ...prev,
                subjetivo: data.subjetivo || prev.subjetivo,
                objetivo: data.objetivo || prev.objetivo,
                avaliacao: (data.avaliacao || '') + (data.ciap2_sugestao ? `\n[Sugestão CIAP-2]: ${data.ciap2_sugestao}` : '') + (data.cid10_sugestao ? `\n[Sugestão CID-10]: ${data.cid10_sugestao}` : ''),
                plano: data.plano || prev.plano
            }));
        } catch (err) {
            console.error(err);
            alert('Houve um erro no processamento da IA.');
        } finally {
            setIsAILoading(false);
        }
    };

    const toggleRecording = (field: string) => {
        if (!recognitionRef.current) {
            alert('Reconhecimento de voz não suportado neste navegador (Tente no Chrome ou Safari).');
            return;
        }

        if (recordingField === field) {
            recognitionRef.current.stop();
            setRecordingField(null);
        } else {
            if (recordingField) {
                recognitionRef.current.stop();
            }

            recognitionRef.current.onresult = (event: any) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript + ' ';
                    }
                }

                if (finalTranscript) {
                    setSoap((prev: any) => ({
                        ...prev,
                        [field]: prev[field] + (prev[field].endsWith(' ') || prev[field] === '' ? '' : ' ') + finalTranscript
                    }));
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Mic error:", event.error);
                if (event.error !== 'no-speech') {
                    setRecordingField(null);
                    recognitionRef.current.stop();
                }
            };

            recognitionRef.current.onend = () => {
                setRecordingField(null);
            };

            setRecordingField(field);
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.warn(e);
            }
        }
    };
    // -------------------------------

    const handleGeneratePDF = async () => {
        if (!soap.paciente) {
            alert('Por favor, informe o nome do paciente antes de gerar o PDF.');
            return;
        }

        setIsGenerating(true);
        const element = contentRef.current;

        // Configurações do PDF (A4 Padrão Médico)
        // @ts-ignore
        const opt = {
            margin: 15,
            filename: `Prontuario_${soap.paciente.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Carregamento dinâmico sem SSR para evitar 'self is not defined' na Vercel
        const html2pdfModule = (await import('html2pdf.js')).default;

        try {
            // @ts-ignore
            await html2pdfModule().set(opt).from(element).save();
        } catch (error) {
            console.error('Erro ao gerar PDF: ', error);
            alert('Falha ao gerar o documento.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        alert('Evolução SOAP salva com sucesso (Simulação local)!');
    };

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2>Evolução Clínica (Metodologia SOAP)</h2>
                    <p className="text-muted">Registro estruturado pronto para exportação e e-SUS.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        className={`btn flex-1 md:flex-none flex items-center justify-center gap-2 ${isAILoading ? 'bg-indigo-100 text-indigo-400' : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'}`}
                        onClick={handleAIStructure}
                        disabled={isAILoading}
                    >
                        {isAILoading ? <span className="animate-spin text-lg">⏳</span> : <Activity size={18} />}
                        {isAILoading ? 'Processando...' : 'NurseAI: Estruturar'}
                    </button>
                    <button className="btn btn-outline flex-1 md:flex-none flex items-center justify-center gap-2" onClick={handleSave}>
                        <Save size={18} /> Salvar DB
                    </button>
                    <button
                        className="btn btn-primary flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={handleGeneratePDF}
                        disabled={isGenerating}
                    >
                        <Download size={18} /> {isGenerating ? 'Gerando...' : 'Exportar PDF'}
                    </button>
                </div>
            </div>

            {/* A div 'contentRef' é o que será capturado e "impresso" no PDF */}
            <div ref={contentRef} className="flex-1 flex flex-col gap-6 bg-white dark:bg-gray-900 px-4 py-6 rounded-xl relative" style={{ overflowWrap: 'break-word', wordWrap: 'break-word', wordBreak: 'break-word' }}>

                {/* Cabeçalho do Prontuário para o PDF */}
                <div className="w-full text-center border-b pb-4 mb-2 flex flex-col items-center">
                    <h1 className="text-xl font-black uppercase text-gray-800 dark:text-gray-100 m-0">{sysConfig.name}</h1>
                    {(sysConfig.address || sysConfig.phone) && (
                        <span className="text-xs text-muted block mt-1">
                            {sysConfig.address} {sysConfig.phone ? `• Tel: ${sysConfig.phone}` : ''}
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-muted mb-1 flex items-center gap-1"><User size={12} /> PACIENTE</label>
                        <input
                            type="text"
                            className="p-2 border-b-2 bg-transparent border-gray-200 focus:border-primary outline-none text-lg font-bold"
                            placeholder="Nome completo..."
                            value={soap.paciente}
                            onChange={e => setSoap({ ...soap, paciente: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs font-bold text-muted mb-1">MOTIVO DA CONSULTA / CIAP-2 PRINCIPAL</label>
                        <input
                            type="text"
                            className="p-2 border-b-2 bg-transparent border-gray-200 focus:border-primary outline-none text-md"
                            placeholder="Ex: W78 (Gravidez) ou Retorno de Exames..."
                            value={soap.motivo}
                            onChange={e => setSoap({ ...soap, motivo: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    <div className="flex flex-col gap-6">
                        <label className="flex items-center gap-2 mb-2 font-bold text-sm justify-between">
                            <span className="flex items-center gap-2">
                                <PenTool size={16} className="text-primary" /> SUBJETIVO (História)
                            </span>
                            <button
                                onClick={() => toggleRecording('subjetivo')}
                                className={`p-1.5 rounded-full transition-colors ${recordingField === 'subjetivo' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                title="Preencher por Voz"
                            >
                                {recordingField === 'subjetivo' ? <Mic size={16} /> : <MicOff size={16} />}
                            </button>
                        </label>
                        <textarea
                            className={`flex-1 p-3 border rounded focus:ring-2 ring-primary border-primary outline-none text-sm transition-all ${recordingField === 'subjetivo' ? 'border-red-400 ring-2 ring-red-200 bg-red-50/10' : ''}`}
                            style={{ minHeight: '120px', whiteSpace: 'pre-wrap' }}
                            placeholder="Descreva o que o paciente relata..."
                            value={soap.subjetivo}
                            onChange={(e) => setSoap({ ...soap, subjetivo: e.target.value })}
                        />
                    </div>
                    <div className="flex-1 flex flex-col">
                        <label className="flex items-center gap-2 mb-2 font-bold text-sm justify-between">
                            <span className="flex items-center gap-2">
                                <BookOpen size={16} className="text-primary" /> OBJETIVO (Exame/Sinais)
                            </span>
                            <button
                                onClick={() => toggleRecording('objetivo')}
                                className={`p-1.5 rounded-full transition-colors ${recordingField === 'objetivo' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                title="Preencher por Voz"
                            >
                                {recordingField === 'objetivo' ? <Mic size={16} /> : <MicOff size={16} />}
                            </button>
                        </label>
                        <textarea
                            className={`flex-1 p-3 border rounded focus:ring-2 ring-primary border-primary outline-none text-sm transition-all ${recordingField === 'objetivo' ? 'border-red-400 ring-2 ring-red-200 bg-red-50/10' : ''}`}
                            style={{ minHeight: '120px', whiteSpace: 'pre-wrap' }}
                            placeholder="Descreva os achados do exame físico..."
                            value={soap.objetivo}
                            onChange={(e) => setSoap({ ...soap, objetivo: e.target.value })}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex-1 flex flex-col">
                        <label className="flex items-center gap-2 mb-2 font-bold text-sm justify-between">
                            <span className="flex items-center gap-2">
                                <FileText size={16} className="text-primary" /> AVALIAÇÃO (Hipótese/CIAP)
                            </span>
                            <button
                                onClick={() => toggleRecording('avaliacao')}
                                className={`p-1.5 rounded-full transition-colors ${recordingField === 'avaliacao' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                title="Preencher por Voz"
                            >
                                {recordingField === 'avaliacao' ? <Mic size={16} /> : <MicOff size={16} />}
                            </button>
                        </label>
                        <textarea
                            className={`flex-1 p-3 border rounded focus:ring-2 ring-primary border-primary outline-none text-sm transition-all ${recordingField === 'avaliacao' ? 'border-red-400 ring-2 ring-red-200 bg-red-50/10' : ''}`}
                            style={{ minHeight: '120px', whiteSpace: 'pre-wrap' }}
                            placeholder="Impressão diagnóstica e codificação CIAP-2..."
                            value={soap.avaliacao}
                            onChange={(e) => setSoap({ ...soap, avaliacao: e.target.value })}
                        />
                    </div>
                    <div className="flex-1 flex flex-col">
                        <label className="flex items-center gap-2 mb-2 font-bold text-sm justify-between">
                            <span className="flex items-center gap-2">
                                <Save size={16} className="text-primary" /> PLANO (Condutas/Medicamentos)
                            </span>
                            <button
                                onClick={() => toggleRecording('plano')}
                                className={`p-1.5 rounded-full transition-colors ${recordingField === 'plano' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                title="Preencher por Voz"
                            >
                                {recordingField === 'plano' ? <Mic size={16} /> : <MicOff size={16} />}
                            </button>
                        </label>
                        <textarea
                            className={`flex-1 p-3 border rounded focus:ring-2 ring-primary border-primary outline-none text-sm transition-all ${recordingField === 'plano' ? 'border-red-400 ring-2 ring-red-200 bg-red-50/10' : ''}`}
                            style={{ minHeight: '120px', whiteSpace: 'pre-wrap' }}
                            placeholder="Descreva o plano terapêutico e orientações..."
                            value={soap.plano}
                            onChange={(e) => setSoap({ ...soap, plano: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Respaldo Jurídico Rodapé Automático */}
            <div className="mt-4 p-3 bg-surface rounded-lg border text-[10px] text-muted text-center italic">
                Documento gerado eletronicamente na plataforma Guia APS ({sysConfig.name}) em conformidade com a Lei 7.498/86 e Decreto 94.406/87.
                Responsabilidade técnica do Enfermeiro assistente devidamente identificado no COREN-UF correspondente.
            </div>
        </div>
    );
}
