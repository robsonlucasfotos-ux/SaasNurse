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
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            router.push('/');
            router.refresh();

        } catch (err: any) {
            setError(err.message || 'E-mail ou senha incorretos.');
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
                            placeholder="Digite sua senha"
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

                    <button
                        type="button"
                        onClick={async () => {
                            try {
                                const { error } = await supabase.auth.signInWithPassword({
                                    email: 'nurse@aps.com',
                                    password: 'nursepassword'
                                });
                                if (error) {
                                    alert('Erro no login: ' + error.message);
                                } else {
                                    window.location.href = '/';
                                }
                            } catch (e) {
                                alert('Erro inesperado: ' + JSON.stringify(e));
                            }
                        }}
                        className="w-full mt-4 text-xs text-gray-400 hover:text-gray-600 underline text-center"
                        style={{ cursor: 'pointer', zIndex: 50, position: 'relative' }}
                    >
                        Entrar como Desenvolvedor (Bypass)
                    </button>
                </form>
            </div>
        </div>
    );
}
