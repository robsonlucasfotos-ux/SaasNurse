'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Baby, Activity, HeartPulse,
  Syringe, FileText, BookOpen, ShieldAlert,
  Stethoscope, AlertTriangle, FilePen, Package, Thermometer
} from 'lucide-react';
import { useMobileNav } from './MobileNavProvider';
import styles from './Sidebar.module.css';

const navItems = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/prenatal', label: 'Pré-natal', icon: HeartPulse },
  { href: '/child-care', label: 'Puericultura', icon: Baby },
  { href: '/elderly-health', label: 'Saúde do Idoso', icon: ShieldAlert },
  { href: '/wound-care', label: 'Curativos / Evolução', icon: Thermometer },
  { href: '/chronic', label: 'Hipertensão/Diabetes', icon: Stethoscope },
  { href: '/vaccination', label: 'Vacinação', icon: Syringe },
  { href: '/unit-management', label: 'Gestão da Unidade', icon: Package },
  { href: '/vigilancia', label: 'Vigilância', icon: AlertTriangle },
];

const docItems = [
  { href: '/evolucao', label: 'Evolução SOAP', icon: FilePen },
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
