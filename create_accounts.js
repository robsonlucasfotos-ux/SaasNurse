require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // ESSENTIAL FOR ADMIN ACTIONS
);

async function createUsers() {
    const users = [
        { email: 'valeriaassessoria1@gmail.com', password: 'ReV1903' },
        { email: 'Robsonlucasfotos@gmail.com', password: 'ReV1903' }
    ];

    for (const u of users) {
        const { data, error } = await supabase.auth.admin.createUser({
            email: u.email,
            password: u.password,
            email_confirm: true // bypass email confirmation for MVP
        });

        if (error) {
            if (error.message.includes('already registered')) {
                console.log(`✅ User ${u.email} already exists.`);
            } else {
                console.error(`❌ Error creating ${u.email}:`, error.message);
            }
        } else {
            console.log(`🚀 User created successfully: ${u.email}`);
        }
    }
}

createUsers();
