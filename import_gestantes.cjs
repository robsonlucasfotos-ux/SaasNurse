const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env' });

const patients = [
    { name: 'Luele Batista Lustosa', cpf: '707.824.701-90', address: 'conj. 12hc rua 02 cs 52', phone: '61981202574', acs_area: 'Area descoberta', risk_level: 'Habitual', dum: new Date().toISOString() },
    { name: 'Claudia Oliveira Araujo', cpf: '098.473.761-82', address: 'conj. 12hc rua 10 cs 11', phone: '61998157052', acs_area: 'Area descoberta', risk_level: 'Habitual', dum: new Date().toISOString() },
    { name: 'Brenda Torres de Oliveira', cpf: '060.263.311-74', address: '', phone: '61992865756', acs_area: 'Area descoberta', risk_level: 'Alto', dum: new Date().toISOString() },
    { name: 'Micaelle dos Santos Antunes', cpf: '710.729.241-29', address: 'conj. 2hi rua 30 cs 07', phone: '61992696942', acs_area: 'Area descoberta', risk_level: 'Alto', dum: new Date().toISOString() },
    { name: 'Leticia Dinelly Estaquio da Silva', cpf: '709.042.311-51', address: 'conj. 12hc rua 10 cs 17', phone: '61995839108', acs_area: 'Area descoberta', risk_level: 'Habitual', dum: new Date().toISOString() },
    { name: 'Kayllane Souza Soares de Jesus', cpf: '764.621.671-19', address: 'conj. 2hi rua 28 cs 18', phone: '61991778832', acs_area: 'Area descoberta', risk_level: 'Habitual', dum: new Date().toISOString() },
    { name: 'Michelle Silva Moura', cpf: '5.982.474.169', address: 'conj 12 hc R 8 cs 21', phone: '61993808497', acs_area: 'Area descoberta', risk_level: 'Habitual', dum: new Date().toISOString() },
    { name: 'Jhullyana Nunes da Silva', cpf: '098.936.201-98', address: 'conj. 2hc rua 8 sobrado 102', phone: '61996343410', acs_area: 'Area descoberta', risk_level: 'Habitual', dum: new Date().toISOString() },
    { name: 'BRENDA KAROLAYNY M. ALCIDES', cpf: '037.079.091-07', address: 'CONJ.12 HC AV. PERIMETRAL N 36', phone: '61992408378', acs_area: 'Area descoberta', risk_level: 'Habitual', dum: new Date().toISOString() },
    { name: 'SUZANA KELLY SILVA SABINO', cpf: '113.203.951-71', address: 'VILA UNIÃO QD 04 N 26', phone: '61981063846', acs_area: 'Area descoberta', risk_level: 'Alto', dum: new Date().toISOString() },
    { name: 'MIKAELE DE JESUS VIEIRA', cpf: '079.273.431.90', address: 'CONJ. 2HI R 10 CS 16', phone: '61996552327', acs_area: 'Area descoberta', risk_level: 'Alto', dum: new Date().toISOString() },
    { name: 'LILIAN CARVALHO NONATO DA SILVA', cpf: '065.860.241-10', address: 'CONJ. 2HI CS 70 AV PERIMETRAL', phone: '61996228365', acs_area: 'Area descoberta', risk_level: 'Alto', dum: new Date().toISOString() },
    { name: 'KAREM VITORIA RODRIGUES DE SOUSA', cpf: '084.035.281-67', address: 'CONJ. 2HI R 2 CS 52', phone: '61991001682', acs_area: 'Area descoberta', risk_level: 'Alto', dum: new Date().toISOString() },
    { name: 'GEOVANA SANTOS FARIAS', cpf: '088.121.021-82', address: '12 HC R 6 CS 45', phone: '61993671984', acs_area: 'Area descoberta', risk_level: 'Alto', dum: new Date().toISOString() },
    { name: 'DREYSI KELLY DOS SANTOS', cpf: '990.538.452-91', address: 'RUA 8 CS 39', phone: '91986101338', acs_area: 'Area descoberta', risk_level: 'Habitual', dum: new Date().toISOString() },
    { name: 'KETULLIN HORRANA MONTEIRO PONTES', cpf: '068.575.721-86', address: 'CONJ 11 HC RUA 3 BK 22 CS 31', phone: '61999563256', acs_area: 'Area descoberta', risk_level: 'Habitual', dum: new Date().toISOString() },
    { name: 'LAYANE MARIA FERREIRA TRINDADE', cpf: '712.882.171-61', address: 'CONJ.12 RUA 6 CS 94', phone: '61992380565', acs_area: 'Area descoberta', risk_level: 'Habitual', dum: new Date().toISOString() },
    { name: 'ALINE SILVA DE OLIVEIRA', cpf: '712.306.801-79', address: 'CONJ. 2HI R 32 LT 42', phone: '61993761099', acs_area: 'Area descoberta', risk_level: 'Habitual', dum: new Date().toISOString() },
    { name: 'JANAINA PEREIRA MENEZES DIAS', cpf: '020.074.821-18', address: 'CONJ 6 HC BLOCO 19 AP. 301', phone: '61974010180', acs_area: 'Area descoberta', risk_level: 'Habitual', dum: new Date().toISOString() },
    { name: 'BRENDA RODRIGUES DE ARAUJO', cpf: '075.774.491-56', address: 'CONJ. 12 HC R 2 CS 6', phone: '61991513684', acs_area: 'Area descoberta', risk_level: 'Habitual', dum: new Date().toISOString() },
    { name: 'SARAH DAYSE SILVA DOS SANTOS', cpf: '057.421.781-90', address: 'CONJ. 12 HC R 4 CS 73', phone: '61998373449', acs_area: 'Area descoberta', risk_level: 'Habitual', dum: new Date().toISOString() },
    { name: 'JOANA KARY FERNADES', cpf: '076.977.653-14', address: 'CONJ 2 HI AV.CENTRAL AP 203', phone: '61994229125', acs_area: 'Area descoberta', risk_level: 'Habitual', dum: new Date().toISOString() },
    { name: 'VITORIA DA CONCEIÇÃO SOUZA', cpf: '056.471.993-56', address: 'CONJ 12 HC R 6 SOBRADO 110', phone: '61994657011', acs_area: 'Area descoberta', risk_level: 'Habitual', dum: new Date().toISOString() }
];

async function runImport() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        console.error('Faltam variáveis NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY.');
        return;
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    try {
        // Tentar obter um usuário ativo buscando alguma paciente já cadastrada ou pegando o primeiro usuário no auth.users
        const { data: users, error: authErr } = await supabase.auth.admin.listUsers();

        let userId;
        if (users && users.users.length > 0) {
            userId = users.users[0].id;
        } else {
            // Backup: query a gestational patient to see if there's a user_id
            const { data: existingPatients } = await supabase.from('pregnant_women').select('user_id').limit(1);
            if (existingPatients && existingPatients.length > 0) {
                userId = existingPatients[0].user_id;
            } else {
                console.error("No active users found to assign the patients to.");
                return;
            }
        }

        console.log(`Using user ID: ${userId}`);

        for (const p of patients) {
            const { error: insertErr } = await supabase.from('pregnant_women').insert([{
                user_id: userId,
                name: p.name,
                dum: p.dum,
                risk_level: p.risk_level,
                phone: p.phone,
                clinical_data: {
                    cpf: p.cpf,
                    address: p.address,
                    acs_area: p.acs_area
                }
            }]);

            if (insertErr) {
                console.error(`Error inserting ${p.name}:`, insertErr);
            } else {
                console.log(`Inserted: ${p.name}`);
            }
        }

        console.log('Importação concluída com sucesso!');
    } catch (err) {
        console.error('Erro na execução da importação:', err);
    }
}

runImport();
