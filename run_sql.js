import { Client } from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function runSQL() {
    const args = process.argv.slice(2);
    const filename = args[0] || 'supabase_whatsapp_reminders.sql';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const regex = /https:\/\/(.*?)\.supabase\.co/;
    const match = supabaseUrl.match(regex);
    const refId = match ? match[1] : null;

    if (!refId || !process.env.SUPABASE_DB_PASSWORD) {
        console.error('Faltam variáveis para montar conexão DB Direta.');
        return;
    }

    const connectionString = `postgresql://postgres.[${refId}]:${process.env.SUPABASE_DB_PASSWORD}@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`;

    const client = new Client({ connectionString });

    try {
        await client.connect();

        const sql = fs.readFileSync(filename, 'utf8');
        await client.query(sql);

        console.log(`Arquivo ${filename} executado com sucesso!`);
    } catch (err) {
        console.error('Erro na execução SQL:', err);
    } finally {
        await client.end();
    }
}

runSQL();
