export interface Medication {
    category: string;
    name: string;
    dosage: string;
    indication: string;
}

export const cofenMedications: Medication[] = [
    // 1. IST e Saúde Sexual e Reprodutiva
    { category: 'IST / Saúde Sexual', name: 'Aciclovir', dosage: '200mg', indication: 'Herpes genital' },
    { category: 'IST / Saúde Sexual', name: 'Benzilpenicilina Benzatina', dosage: '1,2 milhão UI', indication: 'Tratamento da Sífilis' },
    { category: 'IST / Saúde Sexual', name: 'Azitromicina', dosage: '500mg e 1g', indication: 'Uretrites, cervicites e clamídia' },
    { category: 'IST / Saúde Sexual', name: 'Ceftriaxona', dosage: '500mg e 1g', indication: 'Gonorreia e síndromes genitais complicadas' },
    { category: 'IST / Saúde Sexual', name: 'Ciprofloxacino', dosage: '500mg', indication: 'Cancroide e donovanose' },
    { category: 'IST / Saúde Sexual', name: 'Doxiciclina', dosage: '100mg', indication: 'Alternativa para sífilis (exceto gestantes), donovanose e uretrites' },
    { category: 'IST / Saúde Sexual', name: 'Metronidazol', dosage: '250mg e gel vaginal 100mg/g', indication: 'Tricomoníase e vaginose bacteriana' },
    { category: 'IST / Saúde Sexual', name: 'Secnidazol', dosage: '1g', indication: 'Tricomoníase' },
    { category: 'Antifúngicos (IST)', name: 'Nistatina', dosage: 'Creme vaginal', indication: 'Candidíase vulvovaginal' },
    { category: 'Antifúngicos (IST)', name: 'Miconazol', dosage: 'Creme vaginal', indication: 'Candidíase vulvovaginal' },
    { category: 'Antifúngicos (IST)', name: 'Fluconazol', dosage: '150mg', indication: 'Candidíase vaginal' },
    { category: 'Antifúngicos (IST)', name: 'Itraconazol', dosage: '100mg', indication: 'Candidíase vaginal' },
    { category: 'Antifúngicos (IST)', name: 'Clindamicina', dosage: '300mg', indication: 'Vaginose bacteriana' },
    { category: 'Tópicos HPV', name: 'Ácido Tricloroacético (ATA)', dosage: '80-90%', indication: 'Verrugas anogenitais' },
    { category: 'Tópicos HPV', name: 'Podofilina', dosage: '10-25%', indication: 'Verrugas anogenitais' },
    { category: 'Tópicos HPV', name: 'Imiquimode', dosage: '50mg/g', indication: 'Verrugas anogenitais' },

    // 2. Planejamento Familiar e Contracepção
    { category: 'Contracepção', name: 'Acetato de Medroxiprogesterona', dosage: '150mg/mL', indication: 'Anticoncepcional trimestral' },
    { category: 'Contracepção', name: 'Acetato de Medroxiprogesterona + Cipionato de Estradiol', dosage: 'Injetável mensal', indication: 'Anticoncepcional' },
    { category: 'Contracepção', name: 'Enantato de Noretisterona + Valerato de Estradiol', dosage: 'Injetável mensal combinado', indication: 'Anticoncepcional' },
    { category: 'Contracepção', name: 'Levonorgestrel', dosage: '0,75mg e 1,5mg', indication: 'Contracepção de emergência (Pílula do dia seguinte)' },
    { category: 'Contracepção', name: 'Etinilestradiol + Levonorgestrel', dosage: 'Anticoncepcional oral combinado', indication: 'Anticoncepcional' },
    { category: 'Contracepção', name: 'Etinilestradiol + Gestodeno', dosage: 'Anticoncepcional oral', indication: 'Anticoncepcional' },
    { category: 'Contracepção', name: 'Etonogestrel + Etinilestradiol', dosage: 'Anel vaginal', indication: 'Anticoncepcional' },
    { category: 'Contracepção', name: 'Implante de Etonogestrel', dosage: 'Subdérmico', indication: 'Inserção e retirada (Longo prazo)' },
    { category: 'Contracepção', name: 'DIU de Cobre / Hormonal', dosage: 'Inserção/Retirada', indication: 'Método de longa permanência' },

    // 3. Profilaxia ao HIV (PEP e PrEP)
    { category: 'HIV (PEP/PrEP)', name: 'Dolutegravir', dosage: '50mg', indication: 'Tratamento e PEP' },
    { category: 'HIV (PEP/PrEP)', name: 'Lamivudina', dosage: '150mg', indication: 'Tratamento e PEP' },
    { category: 'HIV (PEP/PrEP)', name: 'Tenofovir (TDF)', dosage: '300mg', indication: 'Tratamento, PEP e PrEP' },
    { category: 'HIV (PEP/PrEP)', name: 'TDF + Lamivudina', dosage: '300mg + 300mg', indication: 'Dose fixa combinada' },
    { category: 'HIV (PEP/PrEP)', name: 'Zidovudina/Lamivudina (AZT/3TC)', dosage: 'Esquemas alternativos', indication: 'PEP' },
    { category: 'HIV (PEP/PrEP)', name: 'Darunavir + Ritonavir', dosage: 'Esquemas alternativos', indication: 'PEP' },
    { category: 'HIV (PEP/PrEP)', name: 'TDF + Entricitabina (FTC)', dosage: 'Dose combinada', indication: 'PrEP' },

    // 4. Saúde da Mulher e Pré-natal
    { category: 'Saúde Mulher / Natal', name: 'Ácido Fólico', dosage: '5mg', indication: 'Suplementação gestacional' },
    { category: 'Saúde Mulher / Natal', name: 'Sulfato Ferroso', dosage: '40mg (ferro elementar)', indication: 'Suplementação gestacional' },
    { category: 'Saúde Mulher / Natal', name: 'Nitrofurantoína', dosage: '100mg', indication: 'Primeira linha para ITU não complicada' },
    { category: 'Saúde Mulher / Natal', name: 'Sulfametoxazol + Trimetoprima', dosage: '800mg + 160mg', indication: 'Tratamento de ITU' },
    { category: 'Saúde Mulher / Natal', name: 'Levofloxacino', dosage: 'Segunda linha', indication: 'ITU resistente' },
    { category: 'Saúde Mulher / Natal', name: 'Dimenidrato + Cloridrato de Piridoxina', dosage: 'Sintomático', indication: 'Náuseas e vômitos (Dramin B6)' },

    // 5. Doenças Crônicas
    { category: 'Diabetes', name: 'Cloridrato de Metformina', dosage: '500mg e 850mg', indication: 'Controle de Diabetes Mellitus' },
    { category: 'Diabetes', name: 'Glibenclamida', dosage: 'Variável', indication: 'Controle de Diabetes Mellitus' },
    { category: 'Diabetes', name: 'Insulinas (NPH e Regular)', dosage: 'Variável', indication: 'Controle de Diabetes Insulinodependente' },
    { category: 'Hipertensão', name: 'Captopril', dosage: 'Variável', indication: 'Paresia, Crises, Controle HA' },
    { category: 'Hipertensão', name: 'Enalapril', dosage: 'Variável', indication: 'Controle de Hipertensão' },
    { category: 'Hipertensão', name: 'Losartana', dosage: 'Variável', indication: 'Controle de Hipertensão' },
    { category: 'Hipertensão', name: 'Hidroclorotiazida', dosage: 'Variável', indication: 'Diurético para controle de HA' },
    { category: 'Hipertensão', name: 'Espironolactona', dosage: '25mg', indication: 'Diurético/Controle HA' },
    { category: 'Hipertensão', name: 'Carvedilol', dosage: '3,125mg a 25mg', indication: 'Bloqueador Beta, controle HA' },
    { category: 'Hipertensão', name: 'Anlodipino', dosage: 'Variável', indication: 'Bloqueador de canal de cálcio, controle HA' },

    // 6. Antibióticos de Uso Geral
    { category: 'Antibióticos Gerais', name: 'Amoxicilina', dosage: '500mg e suspensão 50mg/mL', indication: 'Infecções bacterianas comuns' },
    { category: 'Antibióticos Gerais', name: 'Amoxicilina + Clavulanato', dosage: 'Variável', indication: 'Infecções resistentes' },
    { category: 'Antibióticos Gerais', name: 'Azitromicina', dosage: '500mg', indication: 'Infecções respiratórias/outras' },
    { category: 'Antibióticos Gerais', name: 'Cefalexina', dosage: '500mg', indication: 'Infecções de pele/vias urinárias' },
    { category: 'Antibióticos Gerais', name: 'Eritromicina', dosage: 'Variável', indication: 'Alternativa a penicilinas' },

    // 7. Doenças Transmissíveis, Dengue e Outros
    { category: 'Transmissíveis', name: 'Etambutol, Isoniazida, Pirazinamida, Rifampicina', dosage: 'Esquemas intensivos', indication: 'Tratamento de Tuberculose' },
    { category: 'Transmissíveis', name: 'Dapsona, Rifampicina, Clofazimina', dosage: 'Poliquimioterapia', indication: 'Tratamento de Hanseníase' },
    { category: 'Epidemias/Sintomáticos', name: 'Dipirona', dosage: 'Comprimido e gotas', indication: 'Dengue, Febre, Dor' },
    { category: 'Epidemias/Sintomáticos', name: 'Paracetamol', dosage: 'Variável', indication: 'Dengue, Febre, Dor' },
    { category: 'Epidemias/Sintomáticos', name: 'Sais de Reidratação Oral (SRO)', dosage: 'Envelope', indication: 'Desidratação, Dengue, Diarreia' },
    { category: 'Epidemias/Sintomáticos', name: 'Soro Fisiológico 0,9%', dosage: '100ml a 1000ml', indication: 'Reidratação, limpeza' },
    { category: 'Tabagismo', name: 'Nicotina', dosage: 'Goma 2mg, Adesivos (7, 14, 21mg)', indication: 'Cessação do Tabagismo' },
    { category: 'Fitoterápicos', name: 'Alcachofra, Aroeira, Cáscara-sagrada, Espinheira-santa', dosage: 'Variável', indication: 'Indicações de protocolos específicos' }
];

export const authorizedExams = [
    { type: 'Laboratoriais', items: 'Hemograma, Glicemia, HbA1c, Creatinina, Ureia, Potássio, Sódio, Perfil Lipídico, Ácido Úrico, Cálcio' },
    { type: 'Infecciosos / Rápidos', items: 'Sorologias e Testes Rápidos (HIV, Sífilis, Hepatites B/C, Toxoplasmose, Dengue)' },
    { type: 'Saúde da Mulher', items: 'Papanicolau, Beta-HCG, Mamografia, Ultrassonografia de mamas' },
    { type: 'Imagem / Funcionais', items: 'Raio-X de Tórax, Eletrocardiograma (ECG), Urina I' }
];
