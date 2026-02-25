import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // Evitar loop no login
    if (request.nextUrl.pathname.startsWith('/login')) {
        return supabaseResponse;
    }

    // Ignorar arquivos estáticos e rotas de API não sensíveis
    if (request.nextUrl.pathname.startsWith('/_next') || request.nextUrl.pathname.startsWith('/api')) {
        return supabaseResponse;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user && !request.nextUrl.pathname.startsWith('/login')) {
        // não autenticado, redireciona pro login
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // VERIFICAÇÃO DE DISPOSITIVOS TEMPORARIAMENTE SUSPENSA
    // Essa camada de segurança (limitar 2 acessos) estava derrubando a conta de testes
    /*
    if (user) {
        const deviceId = request.cookies.get('device_id')?.value;
        if (deviceId) {
            const { data: sessionData } = await supabase
                .from('device_sessions')
                .select('id')
                .eq('user_id', user.id)
                .eq('device_id', deviceId)
                .single();

            // Se o aparelho não estiver na lista de permitidos do banco (foi limpo pelo trigger de máx 2)
            if (!sessionData) {
                // Desloga o cara e manda pro login
                await supabase.auth.signOut();
                const url = request.nextUrl.clone()
                url.pathname = '/login'
                url.searchParams.set('reason', 'session_expired')
                const response = NextResponse.redirect(url)
                response.cookies.delete('device_id')
                return response
            }
        }
    }
    */

    return supabaseResponse
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
