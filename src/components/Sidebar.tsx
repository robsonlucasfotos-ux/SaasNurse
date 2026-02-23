'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Baby, Activity, HeartPulse,
  Syringe, FileText, BookOpen, ShieldAlert,
  Stethoscope
} from 'lucide-react';
import { useMobileNav } from './MobileNavProvider';
import styles from './Sidebar.module.css';

const navItems = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/prenatal', label: 'Pré-natal', icon: HeartPulse },
  { href: '/child-care', label: 'Puericultura', icon: Baby },
  { href: '/womens-health', label: 'Saúde da Mulher', icon: Activity },
  { href: '/elderly-health', label: 'Saúde do Idoso', icon: ShieldAlert },
  { href: '/chronic', label: 'Hipertensão/Diabetes', icon: Stethoscope },
  { href: '/vaccination', label: 'Vacinação', icon: Syringe },
];

const docItems = [
  { href: '/ciap-search', label: 'Buscador CIAP-2', icon: FileText },
  { href: '/norms', label: 'Normas', icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, setSidebarOpen } = useMobileNav();

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`${styles.overlay} ${isSidebarOpen ? styles.visible : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.mobileOpen : ''}`}>
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}><Stethoscope size={24} color="white" /></div>
          <div className={styles.logoText}>
            <span className={styles.logoTitle}>Guia</span>
            <span className={styles.logoHighlight}>Aps</span>
          </div>
        </div>

        <nav className={styles.navBlock}>
          <p className={styles.navTitle}>Clínica</p>
          <ul className={styles.navList}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                  >
                    <Icon size={20} className={styles.icon} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <nav className={styles.navBlock}>
          <p className={styles.navTitle}>Documentação</p>
          <ul className={styles.navList}>
            {docItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                  >
                    <Icon size={20} className={styles.icon} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
