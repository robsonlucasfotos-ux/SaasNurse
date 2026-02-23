export interface Medication {
    id: string;
    name: string;
    presentation: string;
    indication: string;
    posology_suggestions: string;
}

export const rename2024: Medication[] = [
    {
        id: 'm1',
        name: 'Ácido Fólico',
        presentation: 'Comprimido 5mg',
        indication: 'Prevenção de defeitos do tubo neural (Pré-Natal)',
        posology_suggestions: 'Tomar 1 comprimido, via oral, 1x ao dia. Uso contínuo até fim do 1º trimestre.',
    },
    {
        id: 'm2',
        name: 'Sulfato Ferroso',
        presentation: 'Comprimido 40mg de Fe elemental',
        indication: 'Profilaxia / Tratamento de Anemia (Pré-Natal)',
        posology_suggestions: 'Tomar 1 comprimido, via oral, 30 min antes do almoço e do jantar.',
    },
    {
        id: 'm3',
        name: 'Metronidazol',
        presentation: 'Creme vaginal 100mg/g + aplicador',
        indication: 'Vaginose Bacteriana / Tricomoníase',
        posology_suggestions: 'Aplicar 1 aplicador cheio (5g) à noite, ao deitar, por 7 dias.',
    },
    {
        id: 'm4',
        name: 'Secnidazol',
        presentation: 'Comprimido 1000mg',
        indication: 'Tricomoníase (dose única)',
        posology_suggestions: 'Tomar 2 comprimidos, via oral, em dose única.',
    },
    {
        id: 'm5',
        name: 'Ceftriaxona',
        presentation: 'Pó para solução injetável 500mg IM',
        indication: 'Tratamento de Gonorreia (PCDT IST)',
        posology_suggestions: 'Aplicar 500mg, via intramuscular, em dose única.',
    },
    {
        id: 'm6',
        name: 'Vitamina A (Megadose)',
        presentation: 'Cápsula 100.000 UI ou 200.000 UI',
        indication: 'Suplementação Puericultura (Programa Nacional)',
        posology_suggestions: '1 cápsula aos 6 meses (100.000 UI) ou 1 por ano até 59 meses (200.000 UI).',
    }
];
