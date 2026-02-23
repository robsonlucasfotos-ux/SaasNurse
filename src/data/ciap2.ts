export interface CIAP2Code {
    code: string;
    name: string;
    category: string;
    isNotificacaoCompulsoria?: boolean;
    prazoNotificacao?: 'IMEDIATA' | 'SEMANAL';
    linkFichaSinan?: string;
}

export const ciap2Database: CIAP2Code[] = [
    // Saúde da Mulher / Pré-Natal
    { code: 'W78', name: 'Gravidez', category: 'Gravidez, Parto, Puerpério' },
    { code: 'W84', name: 'Gravidez confirmada', category: 'Gravidez, Parto, Puerpério' },
    { code: 'W80', name: 'Gravidez ectópica', category: 'Gravidez, Parto, Puerpério' },
    { code: 'W92', name: 'Trabalho de parto / Parto com ou sem complicações', category: 'Gravidez, Parto, Puerpério' },
    { code: 'W05', name: 'Náuseas / Vômitos na Gravidez', category: 'Gravidez, Parto, Puerpério' },
    { code: 'W71', name: 'Infecção e outras doenças inflamatórias do aparelho genital feminino', category: 'Gravidez, Parto, Puerpério' },
    { code: 'W81', name: 'Toxemia da gravidez (DHEG / Pré-eclâmpsia)', category: 'Gravidez, Parto, Puerpério' },
    { code: 'W85', name: 'Diabetes gestacional (DMG)', category: 'Gravidez, Parto, Puerpério' },
    { code: 'W11', name: 'Anticoncepção oral', category: 'Planejamento Familiar' },
    { code: 'W12', name: 'Anticoncepção intrauterina', category: 'Planejamento Familiar' },
    { code: 'X14', name: 'Secreção vaginal (corrimento/vaginose)', category: 'Saúde da Mulher' },
    { code: 'X72', name: 'Candidíase Vulvovaginal', category: 'Saúde da Mulher' },

    // Infecções
    { code: 'U71', name: 'Cistite / Infecção urinária (ITU)', category: 'Aparelho Urinário' },

    // Doenças de Notificação Compulsória (Portaria 5201/2024)
    {
        code: 'A77',
        name: 'Dengue ou outras doenças viróticas não especificadas',
        category: 'Infecciosas',
        isNotificacaoCompulsoria: true,
        prazoNotificacao: 'SEMANAL', // Grave ou óbito = imediata
        linkFichaSinan: 'https://portalsinan.saude.gov.br/images/documentos/Agravos/Dengue/Ficha_Dengue_Chikungunya_Zika_Atualizada.pdf'
    },
    {
        code: 'A75',
        name: 'Rubéola / Zika',
        category: 'Infecciosas',
        isNotificacaoCompulsoria: true,
        prazoNotificacao: 'IMEDIATA', // Se gestante
        linkFichaSinan: 'https://portalsinan.saude.gov.br/images/documentos/Agravos/Zika/Ficha_ZIKA_Gestante.pdf'
    },
    {
        code: 'A92',
        name: 'Efeito adverso de medicamento (Acidente Biológico)',
        category: 'Geral',
        isNotificacaoCompulsoria: true,
        prazoNotificacao: 'SEMANAL',
        linkFichaSinan: 'https://portalsinan.saude.gov.br/images/documentos/Agravos/Acidente_Trabalho/Ficha_AT_Acidente_Biologico_Atualizada.pdf'
    },

    // Puericultura
    { code: 'A98', name: 'Medicina Preventiva / Manutenção da Saúde / Puericultura', category: 'Puericultura' },
    { code: 'A13', name: 'Preocupação com o tratamento médico', category: 'Geral' },
    { code: 'D70', name: 'Infecção gastrintestinal', category: 'Geral' },
    { code: 'D73', name: 'Gastroenterite presumida infecção', category: 'Infantil' },
    { code: 'S82', name: 'Doença da pele', category: 'Geral' },

    // Sintomas Gerais / Outros
    { code: 'A03', name: 'Febre', category: 'Sintomas e Queixas' },
    { code: 'A01', name: 'Dor generalizada / Múltipla', category: 'Sintomas e Queixas' },
    { code: 'N01', name: 'Cefaleia (Dor de cabeça)', category: 'Neurológico' },
    { code: 'L01', name: 'Dor cervical / pescoço', category: 'Musculoesquelético' },
    { code: 'L14', name: 'Dor na perna/coxa', category: 'Musculoesquelético' },
    { code: 'H71', name: 'Otite Média Aguda', category: 'Ouvido' },
    { code: 'R75', name: 'Sinusite Aguda', category: 'Respiratório' },
    { code: 'D11', name: 'Diarreia', category: 'Digestivo' },

    // Crônicos / Idoso
    { code: 'K86', name: 'Hipertensão Sem Complicação', category: 'Cardiovascular' },
    { code: 'T90', name: 'Diabetes não-insulino-dependente', category: 'Metabólico' },
    { code: 'P70', name: 'Demência / Declínio cognitivo', category: 'Psicológico' },
    { code: 'P20', name: 'Alterações da memória', category: 'Psicológico' },

    // Vacinação
    { code: 'A97', name: 'Sem doença (Exame médico periódico)', category: 'Geral' },
    { code: 'A44', name: 'Imunização / Medicamento preventivo', category: 'Manejo preventivo' },
];
