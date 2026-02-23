'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Bell, Search, UserCircle } from 'lucide-react';
import styles from './Header.module.css';

const routeNames: Record<string, string> = {
    '/': 'Início / Dashboard',
    '/prenatal': 'Pré-natal (Gestantes)',
    '/child-care': 'Puericultura (Crianças)',
    '/womens-health': 'Saúde da Mulher',
    '/elderly-health': 'Saúde do Idoso',
    '/chronic': 'Hipertensão e Diabetes',
    '/vaccination': 'Vacinação',
    '/soap': 'Gerador de SOAP',
    '/prescription': 'Emissor de Receituário',
    '/norms': 'Biblioteca de Normas'
};

export default function Header() {
    const pathname = usePathname();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check initial system or local storage preference if needed
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            setIsDark(true);
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const newMode = !isDark;
        setIsDark(newMode);

        if (newMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    };

    const title = routeNames[pathname] || 'NurseAps';

    return (
        <header className={styles.header}>
            <div className={styles.leftContent}>
                <h1 className={styles.pageTitle}>{title}</h1>
            </div>

            <div className={styles.rightContent}>
                <div className={styles.searchBar}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Busca rápida..."
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.actions}>
                    <button className={styles.iconButton} onClick={toggleTheme} aria-label="Toggle theme" title="Alternar tema">
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <button className={styles.iconButton} aria-label="Notifications">
                        <Bell size={20} />
                        <span className={styles.notificationBadge}></span>
                    </button>

                    <div className={styles.userProfile}>
                        <UserCircle size={32} className={styles.userIcon} />
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>Enfermeira</span>
                            <span className={styles.userRole}>Coren-UF 123456</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
