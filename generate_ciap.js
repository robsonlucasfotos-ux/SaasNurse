const fs = require('fs');

const rawData = fs.readFileSync('raw_ciap.txt', 'utf-8');
const lines = rawData.split('\n').filter(line => line.trim().length > 0);
const db = [];

const categoryMapping = {
    '-': 'Procedimentos e Avaliação',
    'A': 'Geral e Inespecífico',
    'B': 'Sangue, Org. Hemato e Baço',
    'D': 'Aparelho Digestivo',
    'F': 'Olho e Anexos',
    'H': 'Aparelho Auditivo',
    'K': 'Aparelho Circulatório',
    'L': 'Aparelho Locomotor',
    'N': 'Sistema Nervoso',
    'P': 'Problemas Psicológicos',
    'R': 'Aparelho Respiratório',
    'S': 'Pele',
    'T': 'Endócrino, Metabólico e Nutricional',
    'U': 'Aparelho Urinário',
    'W': 'Gravidez, Parto e Planejamento Familiar',
    'X': 'Aparelho Genital Feminino',
    'Y': 'Aparelho Genital Masculino',
    'Z': 'Problemas Sociais'
};

lines.forEach(line => {
    let codeComponent = line.substring(0, 3).trim();
    if (codeComponent.includes(' ')) {
        codeComponent = line.substring(0, 2).trim();
    }

    if (line.startsWith('-')) {
        codeComponent = line.substring(0, 3).trim();
    }

    const name = line.substring(codeComponent.length).trim();
    if (codeComponent && name) {
        const catKey = codeComponent.startsWith('-') ? '-' : codeComponent[0];
        const category = categoryMapping[catKey] || 'Outros';
        db.push({
            code: codeComponent,
            name: name,
            category: category
        });
    }
});

const tsContent = `export interface CIAP2Code {
    code: string;
    name: string;
    category: string;
}

export const ciap2Database: CIAP2Code[] = ${JSON.stringify(db, null, 4)};\n`;

fs.writeFileSync('src/data/ciap2.ts', tsContent);
console.log("Arquivo ciap2.ts gerado com ", db.length, " codigos.");

let promptKnowledge = "==== TABELA DE CÓDIGOS CIAP-2 COMPLETA ====\n";
db.forEach(c => {
    promptKnowledge += `${c.code}: ${c.name} (${c.category})\n`;
});
fs.writeFileSync('ciap2_prompt_string.txt', promptKnowledge);
