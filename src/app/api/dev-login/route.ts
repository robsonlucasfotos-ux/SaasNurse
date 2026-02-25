import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Development only route to bypass password requirement
export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email missing' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: 'Server configuration missing' }, { status: 500 });
        }

        const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: email,
        });

        if (error) {
            console.error('Error generating link:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        if (data && data.properties && data.properties.action_link) {
            return NextResponse.json({ url: data.properties.action_link });
        } else {
            return NextResponse.json({ error: 'Failed to generate action link' }, { status: 500 });
        }

    } catch (err: any) {
        console.error('Dev login error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
