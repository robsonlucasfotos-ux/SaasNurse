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
            // Bypass password using dev-login API route that generates a magic link
            const res = await fetch('/api/dev-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (!res.ok || !data.url) {
                throw new Error(data.error || 'Falha ao gerar o link de acesso');
            }

            // O redirecionamento automático concluirá o login
            window.location.href = data.url;

            // NOTE: Device session upsert is skipped here since we redirect to the magic link URL
            // and the session is actually created AFTER the redirect.

        } catch (err: any) {
            setError(err.message || 'Erro ao acessar o sistema.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="card w-full max-w-sm p-8 flex flex-col items-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Activity size={32} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-center mb-8">Guia APS</h1>

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
                            placeholder="Apenas o e-mail é necessário"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled
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
            </div>
        </div>
    );
}
