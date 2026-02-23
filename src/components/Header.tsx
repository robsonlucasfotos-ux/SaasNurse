'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Bell, UserCircle } from 'lucide-react';
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
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (saved === 'dark' || (!saved && prefersDark)) {
            setIsDark(true);
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        document.documentElement.setAttribute('data-theme', next ? 'dark' : '');
        localStorage.setItem('theme', next ? 'dark' : 'light');
    };

    const title = routeNames[pathname] ?? 'Guia APS';

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <div className={styles.avatar}>
                    <UserCircle size={30} />
                </div>
                <div className={styles.titleGroup}>
                    <span className={styles.appName}>Guia <span className={styles.appAccent}>APS</span></span>
                    <span className={styles.pageTitle}>{title}</span>
                </div>
            </div>

            <div className={styles.actions}>
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
