'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Moon, Sun, Bell, UserCircle, LogOut, Settings, ShieldCheck } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import styles from './Header.module.css';

const routeNames: Record<string, string> = {
    '/': 'Início',
    '/prenatal': 'Pré-natal',
    '/child-care': 'Puericultura',
    '/womens-health': 'Saúde da Mulher',
    '/elderly-health': 'Saúde do Idoso',
    '/wound-care': 'Curativos',
    '/chronic': 'Crônicos',
    '/vaccination': 'Vacinação',
    '/ciap-search': 'Busca CIAP-2',
    '/norms': 'Normas',
    '/evolucao': 'Evolução SOAP',
    '/unit-management': 'Gestão da Unidade',
    '/vigilancia': 'Vigilância',
};

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [isDark, setIsDark] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [fontSize, setFontSize] = useState(15);
    const supabase = createClient();

    useEffect(() => {
        const saved = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (saved === 'dark' || (!saved && prefersDark)) {
            setIsDark(true);
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        // Recuperar tamanho da fonte
        const savedSize = localStorage.getItem('appFontSize');
        if (savedSize) {
            const size = parseInt(savedSize, 10);
            setFontSize(size);
            document.documentElement.style.setProperty('--base-font-size', `${size}px`);
        } else {
            document.documentElement.style.setProperty('--base-font-size', '15px');
        }
    }, []);

    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        document.documentElement.setAttribute('data-theme', next ? 'dark' : '');
        localStorage.setItem('theme', next ? 'dark' : 'light');
    };

    const changeFontSize = (delta: number) => {
        const newSize = Math.max(12, Math.min(24, fontSize + delta)); // Limites de 12px a 24px
        setFontSize(newSize);
        document.documentElement.style.setProperty('--base-font-size', `${newSize}px`);
        localStorage.setItem('appFontSize', newSize.toString());
    };

    const handleLogoff = async () => {
        await supabase.auth.signOut();
        // Limpar cookies locais relacionados ao app
        document.cookie = 'device_id=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/login');
    };

    const title = routeNames[pathname] ?? 'Guia APS';

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <div className="relative">
                    <div
                        className={styles.avatar}
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        style={{ cursor: 'pointer' }}
                        title="Opções da Conta"
                    >
                        <UserCircle size={30} />
                    </div>
                    {showUserMenu && (
                        <div className="absolute top-12 left-0 min-w-[200px] bg-white dark:bg-gray-800 shadow-xl rounded-xl border p-2 z-50">
                            <Link
                                href="/config"
                                className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-3 transition-colors mb-1"
                                onClick={() => setShowUserMenu(false)}
                            >
                                <Settings size={18} />
                                Configurações
                            </Link>
                            <Link
                                href="/sobre"
                                className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-3 transition-colors mb-1"
                                onClick={() => setShowUserMenu(false)}
                            >
                                <ShieldCheck size={18} />
                                Privacidade e Termos
                            </Link>
                            <div className="h-px bg-gray-200 dark:bg-gray-700 my-1 mx-2" />
                            <button
                                onClick={handleLogoff}
                                className="w-full text-left px-4 py-3 text-sm text-red-600 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-3 transition-colors"
                            >
                                <LogOut size={18} />
                                Encerrar Sessão
                            </button>
                        </div>
                    )}
                </div>
                <div className={styles.titleGroup}>
                    <span className={styles.appName}>Guia <span className={styles.appAccent}>APS</span></span>
                    <span className={styles.pageTitle}>{title}</span>
                </div>
            </div>

            <div className={styles.actions}>
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full mr-2 border border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => changeFontSize(-1)}
                        className="px-2 py-1 text-gray-500 hover:text-primary transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 rounded-l-full font-bold"
                        title="Diminuir Fonte"
                    >
                        A-
                    </button>
                    <button
                        onClick={() => changeFontSize(1)}
                        className="px-2 py-1 text-gray-500 hover:text-primary transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 rounded-r-full font-bold text-lg"
                        title="Aumentar Fonte"
                    >
                        A+
                    </button>
                </div>

                <button className={styles.iconBtn} onClick={toggleTheme} aria-label="Alternar tema">
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button className={styles.bellBtn} aria-label="Notificações">
                    <Bell size={18} />
                    <span className={styles.dot} />
                </button>
            </div>
        </header>
    );
}
