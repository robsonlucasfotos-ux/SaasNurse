export interface Medication {
    id: string;
    name: string;
    presentation: string;
    indication: string;
    posology_suggestions: string;
    competenciaEnfermagem: boolean;
}

export const rename2024: Medication[] = [
    // Suplementação Pré-Natal
    {
        id: 'm1',
        name: 'Ácido Fólico',
        presentation: 'Comprimido 5mg',
        indication: 'Prevenção de defeitos do tubo neural (Pré-Natal)',
        posology_suggestions: 'Tomar 1 comprimido, via oral, 1x ao dia. Uso contínuo até fim do 1º trimestre.',
        competenciaEnfermagem: true,
    },
    {
        id: 'm2',
        name: 'Sulfato Ferroso',
        presentation: 'Comprimido 40mg de Fe elemental',
        indication: 'Profilaxia / Tratamento de Anemia (Pré-Natal)',
        posology_suggestions: 'Tomar 1 comprimido, via oral, 30 min antes do almoço e do jantar.',
        competenciaEnfermagem: true,
    },
    {
        id: 'm7',
        name: 'Carbonato de Cálcio',
        presentation: 'Comprimido 500mg',
        indication: 'Prevenção Pré-Eclâmpsia / Suplementação (2º Tri)',
        posology_suggestions: 'Tomar 1 a 2 comprimidos ao dia (intervalo do Ferro).',
        competenciaEnfermagem: true,
    },

    // Tratamentos Infecciosos (ITU, ISTs, etc)
    {
        id: 'm12',
        name: 'Penicilina G Benzatina',
        presentation: 'Pó para suspensão injetável 1.200.000 UI',
        indication: 'Tratamento de Sífilis (Adquirida / Gestacional)',
        posology_suggestions: 'Sífilis recente: 2,4 milhões UI (IM). Tardia: 7,2 milhões UI (3 semanas de 2,4M UI).',
        competenciaEnfermagem: true,
    },
    {
        id: 'm13',
        name: 'Azitromicina',
        presentation: 'Comprimido 500mg',
        indication: 'Cancroide (Cancro Mole) / ISTs',
        posology_suggestions: 'Tomar 1g (2 comprimidos) via oral, em dose única.',
        competenciaEnfermagem: true,
    },
    {
        id: 'm14',
        name: 'Aciclovir',
        presentation: 'Comprimido 200mg ou 400mg',
        indication: 'Herpes Genital (Primeiro episódio)',
        posology_suggestions: '400mg (VO) 3x/dia ou 200mg (VO) 5x/dia por 7 dias.',
        competenciaEnfermagem: true,
    },
    {
        id: 'm15',
        name: 'Miconazol',
        presentation: 'Creme vaginal 20mg/g + aplicador',
        indication: 'Candidíase Vulvovaginal',
        posology_suggestions: 'Aplicar 1 aplicador cheio vaginal profundo à noite, por 7 a 14 dias.',
        competenciaEnfermagem: true,
    },
    {
        id: 'm16',
        name: 'Nistatina',
        presentation: 'Creme vaginal 25.000 UI/g',
        indication: 'Candidíase Vulvovaginal',
        posology_suggestions: 'Aplicar 1 aplicador cheio (4g) 1 ou 2x ao dia, por 14 dias.',
        competenciaEnfermagem: true,
    },
    {
        id: 'm17',
        name: 'Amoxicilina',
        presentation: 'Cápsula 500mg',
        indication: 'Infecções bacterianas do trator respiratório superior (Otite/Sinusite)',
        posology_suggestions: 'Tomar 1 cápsula 500mg, via oral, de 8/8 horas por 7 a 10 dias.',
        competenciaEnfermagem: true,
    },
    {
        id: 'm3',
        name: 'Metronidazol',
        presentation: 'Creme vaginal 100mg/g + aplicador',
        indication: 'Vaginose Bacteriana / Tricomoníase',
        posology_suggestions: 'Aplicar 1 aplicador cheio (5g) à noite, ao deitar, por 7 dias.',
        competenciaEnfermagem: true,
    },
    {
        id: 'm4',
        name: 'Secnidazol',
        presentation: 'Comprimido 1000mg',
        indication: 'Tricomoníase (dose única)',
        posology_suggestions: 'Tomar 2 comprimidos, via oral, em dose única.',
        competenciaEnfermagem: true,
    },
    {
        id: 'm5',
        name: 'Ceftriaxona',
        presentation: 'Pó para solução injetável 500mg IM',
        indication: 'Tratamento de Gonorreia / Cervicite (PCDT IST)',
        posology_suggestions: 'Aplicar 500mg, via intramuscular, em dose única.',
        competenciaEnfermagem: true,
    },
    {
        id: 'm8',
        name: 'Cefalexina',
        presentation: 'Cápsula 500mg',
        indication: 'Infecção do Trato Urinário (ITU) na Gestação',
        posology_suggestions: 'Tomar 1 cápsula, via oral, de 6/6 horas por 7 dias.',
        competenciaEnfermagem: true,
    },
    {
        id: 'm9',
        name: 'Nitrofurantoína',
        presentation: 'Cápsula 100mg',
        indication: 'Infecção do Trato Urinário (ITU) Não Complicada (Exceto 3º Tri)',
        posology_suggestions: 'Tomar 1 cápsula, de 6/6 horas por 5 a 7 dias.',
        competenciaEnfermagem: true,
    },

    // Sintomáticos / Outros
    {
        id: 'm10',
        name: 'Meclizina (Cloridrato)',
        presentation: 'Comprimido 25mg',
        indication: 'Manejo de náuseas e vômitos (1º Trimestre)',
        posology_suggestions: 'Tomar 1 comprimido, via oral, de 8/8h (Máximo 100mg/dia).',
        competenciaEnfermagem: true, // Variável conforme protocolo local, mas comum na obstetrícia
    },
    {
        id: 'm6',
        name: 'Vitamina A (Megadose)',
        presentation: 'Cápsula 100.000 UI ou 200.000 UI',
        indication: 'Suplementação Puericultura (Programa Nacional)',
        posology_suggestions: '1 cápsula aos 6 meses (100.000 UI) ou 1 por ano até 59 meses (200.000 UI).',
        competenciaEnfermagem: true,
    },
    {
        id: 'm18',
        name: 'Paracetamol',
        presentation: 'Comprimido 500mg',
        indication: 'Analgesia / Antitérmico',
        posology_suggestions: '500mg a 750mg, via oral, de 6/6 ou 8/8 horas (Max 4g/dia).',
        competenciaEnfermagem: true,
    },
    {
        id: 'm19',
        name: 'Dipirona Sódica',
        presentation: 'Comprimido 500mg ou Solução 500mg/mL',
        indication: 'Analgesia / Antitérmico',
        posology_suggestions: '500mg a 1g (comprimido ou 40 gotas), via oral, a cada 6 horas.',
        competenciaEnfermagem: true,
    },
    {
        id: 'm20',
        name: 'Ibuprofeno',
        presentation: 'Comprimido 400mg ou 600mg',
        indication: 'AINE (Dores musculoesqueléticas / Inflamações)',
        posology_suggestions: '400mg a 600mg, via oral, de 8/8 horas por 5 a 7 dias.',
        competenciaEnfermagem: true,
    },
    {
        id: 'm21',
        name: 'Dexametasona',
        presentation: 'Ampola injetável 4mg/mL',
        indication: 'Reações alérgicas sistêmicas / Exacerbação inflamatória aguda',
        posology_suggestions: 'Administração IM em dose única sob avaliação clínica aguda.',
        competenciaEnfermagem: true,
    },
    {
        id: 'm22',
        name: 'Sais para Reidratação Oral (SRO)',
        presentation: 'Envelope de pó',
        indication: 'Diarreia Aguda / Desidratação',
        posology_suggestions: 'Diluir envelope em 1L de água. 100 a 150ml/kg fracionado em 4 a 6h.',
        competenciaEnfermagem: true,
    }
];
