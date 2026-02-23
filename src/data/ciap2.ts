export interface CIAP2Code {
    code: string;
    name: string;
    category: string;
}

export const ciap2Database: CIAP2Code[] = [
    // Saúde da Mulher / Pré-Natal
    { code: 'W78', name: 'Gravidez', category: 'Gravidez, Parto, Puerpério' },
    { code: 'W71', name: 'Infecção e outras doenças inflamatórias do aparelho genital feminino', category: 'Gravidez, Parto, Puerpério' },
    { code: 'W11', name: 'Anticoncepção oral', category: 'Planejamento Familiar' },
    { code: 'W12', name: 'Anticoncepção intrauterina', category: 'Planejamento Familiar' },
    { code: 'X14', name: 'Secreção vaginal (corrimento)', category: 'Saúde da Mulher' },

    // Puericultura
    { code: 'A98', name: 'Medicina Preventiva / Manutenção da Saúde', category: 'Puericultura' },
    { code: 'A13', name: 'Preocupação com o tratamento médico', category: 'Geral' },
    { code: 'D70', name: 'Infecção gastrintestinal', category: 'Geral' },
    { code: 'D73', name: 'Gastroenterite presumida infecção', category: 'Infantil' },
    { code: 'S82', name: 'Doença da pele', category: 'Geral' },

    // Crônicos
    { code: 'K86', name: 'Hipertensão Sem Complicação', category: 'Cardiovascular' },
    { code: 'T90', name: 'Diabetes não-insulino-dependente', category: 'Metabólico' },

    // Vacinação
    { code: 'A97', name: 'Sem doença (Exame médico periódico)', category: 'Geral' },
    { code: 'A44', name: 'Imunização / Medicamento preventivo', category: 'Manejo preventivo' },
];
