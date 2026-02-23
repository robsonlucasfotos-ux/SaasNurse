'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader2, Activity } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            // Se logou com sucesso, gera um ID de dispositivo para controle da clínica
            const deviceId = crypto.randomUUID();
            // Salva o cookie de device (7 dias)
            document.cookie = `device_id=${deviceId}; path=/; max-age=604800; samesite=lax`;

            // Atualiza o rastreador de sessões (o trigger no backend apaga a 3ª sessão)
            await supabase.from('device_sessions').upsert({
                user_id: data.user.id,
                device_id: deviceId,
                last_active: new Date().toISOString()
            }, { onConflict: 'user_id, device_id' });

            router.push('/');
            router.refresh();

        } catch (err: any) {
            setError('Credenciais inválidas. Verifique seu e-mail e senha.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="card w-full max-w-sm p-8 flex flex-col items-center">
                <div className="bg-primary/10 p-4 rounded-full mb-6">
                    <Activity size={32} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-center mb-2">Guia APS Health</h1>
                <p className="text-muted text-sm text-center mb-8">
                    Acesso exclusivo para profissionais de saúde gerenciarem protocolos e evoluções.
                </p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-4 w-full text-center font-medium">
                        {error}
                    </div>
                )}
                {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('reason') === 'session_expired' && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm p-3 rounded-lg mb-4 w-full text-center font-medium">
                        Sua sessão expirou por atingir o limite de aparelhos logados simultaneamente.
                    </div>
                )}

                <form onSubmit={handleLogin} className="w-full space-y-4">
                    <div>
                        <label className="form-label text-sm font-medium">E-mail Profissional</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="exemplo@clinica.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="form-label text-sm font-medium">Senha</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full flex justify-center mt-6 h-11"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Acessar Sistema'}
                    </button>
                </form>

                <p className="text-xs text-muted text-center mt-8 px-4">
                    O sistema limita a operação a um máximo de (2) dispositivos simultâneos por razões de segurança de dados (LGPD).
                </p>
            </div>
        </div>
    );
}
