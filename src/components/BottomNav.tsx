'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    Home, HeartPulse, Thermometer, Search, Grid3x3,
    X, Baby, ShieldAlert, Stethoscope, Syringe,
    AlertTriangle, Package, BookOpen, FileText, FilePen,
    Heart, BarChart3, Bandage
} from 'lucide-react';
import styles from './BottomNav.module.css';

const clinicModules = [
    { href: '/prenatal', label: 'Pré-natal', icon: HeartPulse, color: '#ec4899' },
    { href: '/child-care', label: 'Puericultura', icon: Baby, color: '#3b82f6' },
    { href: '/elderly-health', label: 'Saúde do Idoso', icon: ShieldAlert, color: '#8b5cf6' },
    { href: '/chronic', label: 'Crônicos', icon: Stethoscope, color: '#10b981' },
    { href: '/vaccination', label: 'Vacinação', icon: Syringe, color: '#f59e0b' },
    { href: '/womens-health', label: 'Saúde da Mulher', icon: Heart, color: '#f43f5e' },
    { href: '/vigilancia', label: 'Vigilância', icon: AlertTriangle, color: '#ef4444' },
    { href: '/unit-management', label: 'Gestão da Unidade', icon: Package, color: '#6366f1' },
    { href: '/gestao-estrategica', label: 'Gestão Estratégica', icon: BarChart3, color: '#8b5cf6' },
];

const toolModules = [
    { href: '/evolucao', label: 'Evolução SOAP', icon: FilePen, color: '#0ea5e9' },
    { href: '/norms', label: 'Normas', icon: BookOpen, color: '#64748b' },
    { href: '/ciap-search', label: 'CIAP-2', icon: FileText, color: '#22c55e' },
];

const isModulePath = (path: string) =>
    clinicModules.some(m => m.href === path) || toolModules.some(m => m.href === path);

export default function BottomNav() {
    const pathname = usePathname();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const isClinicActive = isModulePath(pathname);

    const tabs = [
        { href: '/', label: 'Início', icon: Home },
        { href: '/wound-care', label: 'Curativos', icon: Bandage },
        { href: '/ciap-search', label: 'CIAP-2', icon: Search },
    ];

    return (
        <>
            {/* Drawer overlay */}
            {drawerOpen && (
                <div className={styles.drawerOverlay} onClick={() => setDrawerOpen(false)} />
            )}

            {/* Modules Drawer */}
            <div className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ''}`}>
                <div className={styles.drawerHandle} />
                <div className={styles.drawerHeader}>
                    <span className={styles.drawerTitle}>Módulos Clínicos</span>
                    <button className={styles.drawerClose} onClick={() => setDrawerOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <p className={styles.drawerSection}>Clínica</p>
                <div className={styles.drawerGrid}>
                    {clinicModules.map(m => {
                        const Icon = m.icon;
                        const active = pathname === m.href;
                        return (
                            <Link
                                key={m.href}
                                href={m.href}
                                onClick={() => setDrawerOpen(false)}
                                className={`${styles.drawerItem} ${active ? styles.drawerItemActive : ''}`}
                            >
                                <span className={styles.drawerIcon} style={{ background: `${m.color}18`, color: m.color }}>
                                    <Icon size={20} />
                                </span>
                                <span className={styles.drawerLabel}>{m.label}</span>
                            </Link>
                        );
                    })}
                </div>

                <p className={styles.drawerSection}>Ferramentas</p>
                <div className={styles.drawerGrid}>
                    {toolModules.map(m => {
                        const Icon = m.icon;
                        const active = pathname === m.href;
                        return (
                            <Link
                                key={m.href}
                                href={m.href}
                                onClick={() => setDrawerOpen(false)}
                                className={`${styles.drawerItem} ${active ? styles.drawerItemActive : ''}`}
                            >
                                <span className={styles.drawerIcon} style={{ background: `${m.color}18`, color: m.color }}>
                                    <Icon size={20} />
                                </span>
                                <span className={styles.drawerLabel}>{m.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Bar */}
            <nav className={styles.nav}>
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    const active = pathname === tab.href;
                    return (
                        <Link key={tab.href} href={tab.href} className={`${styles.tab} ${active ? styles.tabActive : ''}`}>
                            <span className={styles.tabIcon}><Icon size={22} strokeWidth={active ? 2.5 : 1.8} /></span>
                            <span className={styles.tabLabel}>{tab.label}</span>
                        </Link>
                    );
                })}

                {/* Modules (Drawer trigger) */}
                <button
                    className={`${styles.tab} ${isClinicActive ? styles.tabActive : ''}`}
                    onClick={() => setDrawerOpen(v => !v)}
                >
                    <span className={styles.tabIcon}>
                        <Grid3x3 size={22} strokeWidth={isClinicActive ? 2.5 : 1.8} />
                    </span>
                    <span className={styles.tabLabel}>Módulos</span>
                </button>
            </nav>
        </>
    );
}
