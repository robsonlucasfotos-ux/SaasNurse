'use client';

import Link from 'next/link';
import {
  HeartPulse, Baby, ShieldAlert, Stethoscope,
  Syringe, AlertTriangle, Package, Thermometer,
  FileText, FilePen, BookOpen, Search, Heart
} from 'lucide-react';
import styles from './page.module.css';

const clinicCards = [
  {
    href: '/prenatal',
    label: 'Pré-natal',
    sub: 'Gestantes',
    icon: HeartPulse,
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
    glow: '#ec489940',
  },
  {
    href: '/child-care',
    label: 'Puericultura',
    sub: 'Crescimento e Desenvolvimento',
    icon: Baby,
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #818cf8 100%)',
    glow: '#3b82f640',
  },
  {
    href: '/wound-care',
    label: 'Curativos',
    sub: 'Sistema RYB e Fotos',
    icon: Thermometer,
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
    glow: '#f43f5e40',
  },
  {
    href: '/elderly-health',
    label: 'Idoso',
    sub: 'Avaliação Geriátrica AGA',
    icon: ShieldAlert,
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    glow: '#8b5cf640',
  },
  {
    href: '/chronic',
    label: 'Crônicos',
    sub: 'HAS/DM — Metas',
    icon: Stethoscope,
    gradient: 'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)',
    glow: '#10b98140',
  },
  {
    href: '/vaccination',
    label: 'Vacinação',
    sub: 'Calendário PNI',
    icon: Syringe,
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    glow: '#f59e0b40',
  },
  {
    href: '/womens-health',
    label: 'Saúde da Mulher',
    sub: 'Preventivo e Anticoncepção',
    icon: Heart,
    gradient: 'linear-gradient(135deg, #f472b6 0%, #e879f9 100%)',
    glow: '#f472b640',
  },
  {
    href: '/vigilancia',
    label: 'Vigilância',
    sub: 'Notificações compulsórias',
    icon: AlertTriangle,
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    glow: '#ef444440',
  },
];

const toolCards = [
  { href: '/evolucao', label: 'Evolução SOAP', icon: FilePen, color: '#0ea5e9' },
  { href: '/ciap-search', label: 'Busca CIAP-2', icon: Search, color: '#22c55e' },
  { href: '/norms', label: 'Normas', icon: BookOpen, color: '#8b5cf6' },
  { href: '/unit-management', label: 'Estoque', icon: Package, color: '#f59e0b' },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function getFormattedDate() {
  return new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function HomePage() {
  const greeting = getGreeting();
  const date = getFormattedDate();

  return (
    <div className={styles.page}>
      {/* Greeting */}
      <div className={styles.greeting}>
        <div>
          <h1 className={styles.greetTitle}>{greeting}, Enfermeira 👋</h1>
          <p className={styles.greetDate}>{date} • Todos os módulos ativos</p>
        </div>
        <div className={styles.statusBadge}>
          <span className="status-dot green" />
          Em dia
        </div>
      </div>

      {/* Quick Summary */}
      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryNum}>12</span>
          <span className={styles.summaryLabel}>Módulos clínicos</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryNum}>450+</span>
          <span className={styles.summaryLabel}>Protocolos MS</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryNum}>LGPD</span>
          <span className={styles.summaryLabel}>Dados locais</span>
        </div>
      </div>

      {/* Clinical Cards Grid */}
      <p className="section-label" style={{ marginTop: '1.5rem' }}>Módulos Clínicos</p>
      <div className={styles.cardGrid}>
        {clinicCards.map(card => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href} className={styles.clinicCard} style={{ background: card.gradient }}>
              <div className={styles.cardIconWrap} style={{ background: 'rgba(255,255,255,0.2)' }}>
                <Icon size={22} color="white" strokeWidth={2} />
              </div>
              <span className={styles.cardLabel}>{card.label}</span>
              <span className={styles.cardSub}>{card.sub}</span>
            </Link>
          );
        })}
      </div>

      {/* Tool Chips */}
      <p className="section-label" style={{ marginTop: '1.75rem' }}>Ferramentas Rápidas</p>
      <div className={styles.toolRow}>
        {toolCards.map(t => {
          const Icon = t.icon;
          return (
            <Link key={t.href} href={t.href} className={styles.toolChip}>
              <span className={styles.toolIcon} style={{ background: `${t.color}18`, color: t.color }}>
                <Icon size={18} />
              </span>
              <span className={styles.toolLabel}>{t.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer note */}
      <p className={styles.footerNote}>
        Baseado nas diretrizes do Ministério da Saúde e resoluções COFEN vigentes.
      </p>
    </div>
  );
}
