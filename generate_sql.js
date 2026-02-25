const fs = require('fs');

const patients = [
    { name: 'Luele Batista Lustosa', cpf: '707.824.701-90', address: 'conj. 12hc rua 02 cs 52', phone: '(61) 98120-2574', acs_area: 'Area descoberta', risk_level: 'Habitual' },
    { name: 'Claudia Oliveira Araujo', cpf: '098.473.761-82', address: 'Conj. 12hc rua 10 cs 11', phone: '(61) 99815-7052', acs_area: 'Area descoberta', risk_level: 'Habitual' },
    { name: 'Brenda Torres de Oliveira', cpf: '060.263.311-74', address: '', phone: '(61) 99286-5756', acs_area: 'Area descoberta', risk_level: 'Alto' },
    { name: 'Micaelle dos Santos Antunes', cpf: '710.729.241-29', address: 'conj. 2hi rua 30 cs 07', phone: '(61) 992696942', acs_area: 'Area descoberta', risk_level: 'Alto' },
    { name: 'Leticia Dinelly Estaquio da Silva', cpf: '709.042.311-51', address: 'conj. 12hc rua 10 cs 17', phone: '(61) 99583-9108', acs_area: 'Area descoberta', risk_level: 'Habitual' },
    { name: 'Kayllane Souza Soares de Jesus', cpf: '764.621.671-19', address: 'conj.  2hi rua 28 cs 18', phone: '(61) 99177-8832', acs_area: 'Area descoberta', risk_level: 'Habitual' },
    { name: 'Michelle Silva Moura', cpf: '5.982.474.169', address: 'conj 12 hc R 8 cs 21', phone: '(61) 99380-8497', acs_area: 'Area descoberta', risk_level: 'Habitual' },
    { name: 'Jhullyana Nunes da Silva', cpf: '098.936.201-98', address: 'conj. 2hc rua 8 sobrado 102', phone: '(61) 99634-3410', acs_area: 'Area descoberta', risk_level: 'Habitual' },
    { name: 'BRENDA KAROLAYNY M. ALCIDES', cpf: '037.079.091-07', address: 'CONJ.12 HC AV. PERIMETRAL N 36', phone: '(61) 99240-8378', acs_area: 'Area descoberta', risk_level: 'Habitual' },
    { name: 'SUZANA KELLY SILVA SABINO', cpf: '113.203.951-71', address: 'VILA UNIÃO QD 04 N 26', phone: '(61) 98106-3846', acs_area: 'Area descoberta', risk_level: 'Alto' },
    { name: 'MIKAELE DE JESUS VIEIRA', cpf: '079.273.431.90', address: 'CONJ. 2HI R 10 CS 16', phone: '(61) 99655-2327', acs_area: 'Area descoberta', risk_level: 'Alto' },
    { name: 'LILIAN CARVALHO NONATO DA SILVA', cpf: '065.860.241-10', address: 'CONJ. 2HI CS 70 AV PERIMETRAL', phone: '(61) 99622-8365', acs_area: 'Area descoberta', risk_level: 'Alto' },
    { name: 'KAREM VITORIA RODRIGUES DE SOUSA', cpf: '084.035.281-67', address: 'CONJ. 2HI R 2 CS 52', phone: '(61) 99100-1682', acs_area: 'Area descoberta', risk_level: 'Alto' },
    { name: 'GEOVANA SANTOS FARIAS', cpf: '088.121.021-82', address: '12 HC R 6 CS 45', phone: '(61) 99367-1984', acs_area: 'Area descoberta', risk_level: 'Alto' },
    { name: 'DREYSI KELLY DOS SANTOS', cpf: '990.538.452-91', address: 'RUA 8 CS 39', phone: '(91)98610-1338', acs_area: 'Area descoberta', risk_level: 'Habitual' },
    { name: 'KETULLIN HORRANA MONTEIRO PONTES', cpf: '068.575.721-86', address: 'CONJ 11 HC RUA 3 BK 22 CS 31', phone: '(61) 99956-3256', acs_area: 'Area descoberta', risk_level: 'Habitual' },
    { name: 'LAYANE MARIA FERREIRA TRINDADE', cpf: '712.882.171-61', address: 'CONJ.12 RUA 6 CS 94', phone: '(61) 99238-0565', acs_area: 'Area descoberta', risk_level: 'Habitual' },
    { name: 'ALINE SILVA DE OLIVEIRA', cpf: '712.306.801-79', address: 'CONJ. 2HI R 32 LT 42', phone: '(61) 99376-1099', acs_area: 'Area descoberta', risk_level: 'Habitual' },
    { name: 'JANAINA PEREIRA MENEZES DIAS', cpf: '020.074.821-18', address: 'CONJ  6 HC BLOCO 19 AP. 301', phone: '(61) 97401-0180', acs_area: 'Area descoberta', risk_level: 'Habitual' },
    { name: 'BRENDA RODRIGUES DE ARAUJO', cpf: '075.774.491-56', address: 'CONJ. 12 HC R 2 CS 6', phone: '(61) 99151-3684', acs_area: 'Area descoberta', risk_level: 'Habitual' },
    { name: 'SARAH DAYSE SILVA DOS SANTOS', cpf: '057.421.781-90', address: ' CONJ. 12 HC R 4 CS 73', phone: '(61) 99837-3449', acs_area: 'Area descoberta', risk_level: 'Habitual' },
    { name: 'JOANA KARY FERNADES', cpf: '076.977.653-14', address: 'CONJ 2 HI AV.CENTRAL AP 203', phone: '(61) 99422-9125', acs_area: 'Area descoberta', risk_level: 'Habitual' },
    { name: 'VITORIA DA CONCEIÇÃO SOUZA', cpf: '056.471.993-56', address: 'CONJ 12 HC R 6 SOBRADO 110', phone: '(61) 99465-7011', acs_area: 'Area descoberta', risk_level: 'Habitual' }
];

const userId = '73bdf7da-9a61-4442-af05-aade8aaac8aa'; // Robson

let sql = `INSERT INTO public.pregnant_women (user_id, name, dum, risk_level, phone, clinical_data) VALUES\n`;

const values = patients.map(p => {
    const risk = p.risk_level.toLowerCase() === 'alto' ? 'Alto' : 'Habitual';
    const clinicalStr = JSON.stringify({
        cpf: p.cpf,
        address: p.address,
        acs_area: p.acs_area
    });
    // escape single quotes
    const safeName = p.name.replace(/'/g, "''");
    const safeClinical = clinicalStr.replace(/'/g, "''");

    return `('${userId}', '${safeName}', NOW(), '${risk}', '${p.phone}', '${safeClinical}'::jsonb)`;
});

sql += values.join(',\n') + ';';

fs.writeFileSync('insert_gestantes.sql', sql);
console.log('SQL file created.');
