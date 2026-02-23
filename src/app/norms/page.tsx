'use client';

import { BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

const norms = [
    {
        title: 'Lei Federal nº 7.498/1986',
        desc: 'Dispõe sobre a regulamentação do exercício da Enfermagem e dá outras providências.',
        link: 'http://www.planalto.gov.br/ccivil_03/leis/l7498.htm',
        highlight: 'Art. 11, inc. II, alínea "c": Prescrição de medicamentos estabelecidos em programas de saúde pública e em rotina aprovada pela instituição de saúde.'
    },
    {
        title: 'Decreto nº 94.406/1987',
        desc: 'Regulamenta a Lei nº 7.498, de 25 de junho de 1986.',
        link: 'http://www.planalto.gov.br/ccivil_03/decreto/1980-1989/d94406.htm',
        highlight: 'Art. 8º, inc. II, alínea "c": Confirma a autonomia do Enfermeiro para prescrição em protocolos institucionais.'
    },
    {
        title: 'Portaria MS/GM nº 2.436/2017',
        desc: 'Aprova a Política Nacional de Atenção Básica, estabelecendo a revisão de diretrizes para a organização da PNAB.',
        link: 'https://bvsms.saude.gov.br/bvs/saudelegis/gm/2017/prt2436_22_09_2017.html',
        highlight: 'Atribuições do Enfermeiro: Realizar consulta, solicitar exames complementares e prescrever medicações conforme protocolos do MS ou locais.'
    },
    {
        title: 'Resolução COFEN nº 736/2024',
        desc: 'Dispõe sobre a implementação do Processo de Enfermagem (PE) em todos os ambientes.',
        link: 'http://www.cofen.gov.br/resolucao-cofen-no-736-2024/',
        highlight: 'Torna obrigatório o registro da consulta de enfermagem (SOAP) e demais etapas do PE.'
    }
];

export default function NormsPage() {
    return (
        <div className="flex flex-col h-full">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h2 className="flex items-center gap-2">
                        <BookOpen size={28} color="var(--primary)" />
                        Biblioteca de Normas e Respaldo Legal
                    </h2>
                    <p className="text-muted mt-2">
                        Consulte as principais normativas que garantem a autonomia do Enfermeiro na APS.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 flex-1">
                {norms.map((norm, idx) => (
                    <div key={idx} className="card h-fit flex flex-col justify-between" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                        <div>
                            <h3 className="mb-2 text-lg">{norm.title}</h3>
                            <p className="text-muted text-sm mb-4">{norm.desc}</p>

                            <div
                                className="p-3 rounded mb-6 text-sm flex items-start gap-2"
                                style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)' }}
                            >
                                <ShieldCheck size={20} className="shrink-0 mt-0.5" />
                                <span><strong>Destaque Legal:</strong> {norm.highlight}</span>
                            </div>
                        </div>

                        <a
                            href={norm.link}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline w-fit text-sm"
                            style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}
                        >
                            <ExternalLink size={16} /> Acessar Texto Original na Íntegra
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
