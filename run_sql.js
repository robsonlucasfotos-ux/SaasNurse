import { Client } from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function runSQL() {
    // Usar as credenciais do Pooler Supabase (formato postgreSQL uri)
    // Precisaremos montar isso pegando as variáveis soltas.
    // Como estamos sem a string exata, montaremos através das docs do db
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const regex = /https:\/\/(.*?)\.supabase\.co/;
    const match = supabaseUrl.match(regex);
    const refId = match ? match[1] : null;

    if (!refId || !process.env.SUPABASE_DB_PASSWORD) {
        console.error('Faltam variáveis para montar conexão DB Direta.');
        return;
    }

    // URI padrão Supabase Transaction Pooler
    const connectionString = `postgresql://postgres.[${refId}]:${process.env.SUPABASE_DB_PASSWORD}@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`;

    const client = new Client({ connectionString });

    try {
        await client.connect();

        const sql = fs.readFileSync('supabase_whatsapp_reminders.sql', 'utf8');
        await client.query(sql);

        console.log('Tabela whatsapp_reminders criada com sucesso!');
    } catch (err) {
        console.error('Erro na execução SQL:', err);
    } finally {
        await client.end();
    }
}

runSQL();
