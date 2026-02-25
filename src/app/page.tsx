'use client';

import Link from 'next/link';
import {
  HeartPulse, Baby, ShieldAlert, Stethoscope,
  Syringe, AlertTriangle, Package, Bandage,
  FileText, FilePen, BookOpen, Search, Heart, Activity, Settings,
  Users, MessageCircle, ExternalLink, ArrowRight, Bell, BarChart3
} from 'lucide-react';
import styles from './page.module.css';
import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';

interface Prompt {
  title: string;
  desc: string;
  phone: string | null;
}

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
    icon: Bandage,
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
  {
    href: '/gestao-estrategica',
    label: 'Gestão Estratégica',
    sub: 'Indicadores Previne Brasil',
    icon: BarChart3,
    gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    glow: '#6366f140',
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

  const [stats, setStats] = useState({
    pregnant: 0,
    children: 0,
    inventory: 0,
    isLoading: true,
    pregnantByTrim: [0, 0, 0],
    childrenByAge: [0, 0, 0]
  });

  const [highRiskPatients, setHighRiskPatients] = useState<any[]>([]);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [clinicName, setClinicName] = useState('Unidade Básica de Saúde');
  const [userEmail, setUserEmail] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const storedName = localStorage.getItem('clinica_name');
    if (storedName) setClinicName(storedName);

    async function loadStats() {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        const userId = userData.user.id;
        const rawName = userData.user.user_metadata?.full_name || userData.user.email || '';
        const firstName = rawName.includes('@')
          ? rawName.split('@')[0].split('.')[0]
          : rawName.split(' ')[0];
        setUserEmail(firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase());

        // Fetch parallel data
        const [resP, resC, resI] = await Promise.all([
          supabase.from('pregnant_women').select('*').eq('user_id', userId),
          supabase.from('children').select('*').eq('user_id', userId),
          supabase.from('inventory_notes').select('*', { count: 'exact', head: true }).eq('user_id', userId)
        ]);

        let pData = resP.data || [];
        let cData = resC.data || [];
        let i = resI.count || 0;

        // Process High Risk
        const hrP = pData.filter(p => p.risk_level === 'Alto').map(p => ({ ...p, type: 'pregnant' }));
        const hrC = cData.filter(c => c.risk_level === 'Alto').map(c => ({ ...c, type: 'child' }));
        setHighRiskPatients([...hrP, ...hrC]);

        // Process Stats for Charts
        let trim = [0, 0, 0];
        pData.forEach(p => {
          const dumDate = new Date(p.dum);
          const diffWeeks = Math.floor(Math.abs(Date.now() - dumDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
          if (diffWeeks <= 12) trim[0]++;
          else if (diffWeeks <= 27) trim[1]++;
          else trim[2]++;
        });

        let ages = [0, 0, 0];
        cData.forEach(c => {
          const birth = new Date(c.birth_date);
          const diffMonths = (new Date().getFullYear() - birth.getFullYear()) * 12 + (new Date().getMonth() - birth.getMonth());
          if (diffMonths <= 6) ages[0]++;
          else if (diffMonths <= 12) ages[1]++;
          else ages[2]++;
        });

        setStats({
          pregnant: pData.length,
          children: cData.length,
          inventory: i,
          isLoading: false,
          pregnantByTrim: trim,
          childrenByAge: ages
        });

        // Generate Clinical Prompts (Automations)
        const newPrompts: Prompt[] = [];
        pData.forEach(p => {
          const dumDate = new Date(p.dum);
          const diffWeeks = Math.floor(Math.abs(Date.now() - dumDate.getTime()) / (1000 * 60 * 60 * 24 * 7));

          if (diffWeeks === 28) {
            newPrompts.push({
              title: `3º Trimestre: ${p.name.split(' ')[0]}`,
              desc: `Acabou de entrar no 3º trimestre. Agendar Swab em breve?`,
              phone: p.phone
            });
          }
          if (diffWeeks >= 35 && diffWeeks <= 37) {
            newPrompts.push({
              title: `Rastreio GBS: ${p.name.split(' ')[0]}`,
              desc: `Está na ${diffWeeks}ª semana. Oferecer Swab vaginal/anal.`,
              phone: p.phone
            });
          }
          if (diffWeeks === 20 || diffWeeks === 21) {
            newPrompts.push({
              title: `dTpa p/ ${p.name.split(' ')[0]}`,
              desc: `20 semanas atingidas. Hora de imunizar contra Pertussis.`,
              phone: p.phone
            });
          }
        });
        setPrompts(newPrompts.slice(0, 3)); // Max 3 prompts

      } catch (error) {
        console.error('Error fetching dashboard stats', error);
        setStats(s => ({ ...s, isLoading: false }));
      }
    }

    loadStats();
  }, [supabase]);

  return (
    <div className={styles.page}>
      {/* Greeting */}
      <div className={styles.greeting}>
        <div>
          <h1 className={styles.greetTitle} style={{ fontWeight: 900 }}>{greeting}, {userEmail} 👋</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className={styles.greetDate}>{date} &bull; <span className="font-bold text-gray-800 dark:text-gray-200">{clinicName}</span></p>
            <Link href="/config" className="text-primary hover:text-primary-light" title="Configurar Nome da Unidade"><Settings size={14} /></Link>
          </div>
        </div>
        <div className={styles.statusBadge}>
          <span className="status-dot green" />
          Unidade Operacional
        </div>
      </div>

      {/* High Risk Alerts Section */}
      {highRiskPatients.length > 0 && (
        <div className="mb-6">
          <h3 className="section-label flex items-center gap-2 mb-3 text-red-600 font-bold">
            <Bell size={18} className="animate-bounce" /> ALERTAS CRÍTICOS (ALTO RISCO)
          </h3>
          <div className={styles.highRiskGrid}>
            {highRiskPatients.slice(0, 4).map((p, idx) => (
              <div key={idx} className={styles.highRiskCard}>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-700">
                    {p.type === 'pregnant' ? 'Gestante' : 'Criança'}
                  </span>
                  {p.phone && (
                    <a href={`https://wa.me/55${p.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:scale-110 transition-transform">
                      <MessageCircle size={18} />
                    </a>
                  )}
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white">{p.name}</h4>
                <p className="text-xs text-red-600 font-medium">Motivo: {p.risk_reason || p.observations || 'Avaliação prioritária necessária'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prompts Inteligentes */}
      {prompts.length > 0 && (
        <div className="mb-6">
          <p className="section-label mb-3">Prompts Clínicos (Automação)</p>
          {prompts.map((p, idx) => (
            <div key={idx} className={styles.promptCard}>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-primary">{p.title}</span>
                <span className="text-[11px] text-muted">{p.desc}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => window.open(`https://wa.me/55${p.phone?.replace(/\D/g, '')}`, '_blank')} className="btn btn-sm btn-ghost text-green-600">
                  <MessageCircle size={16} />
                </button>
                <ArrowRight size={16} className="text-muted opacity-40" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tool Chips */}
      <p className="section-label">Ferramentas Rápidas</p>
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

      {/* Analytics Visual Section */}
      {!stats.isLoading && (
        <div className={styles.chartContainer}>
          <div className={styles.chartBox}>
            <span className="text-xs font-bold text-muted uppercase">Evolução Pré-natal</span>
            <div className="flex items-end gap-2 h-20 w-full justify-around px-4">
              {stats.pregnantByTrim.map((val, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 w-full">
                  <div
                    className="bg-primary rounded-t w-full transition-all duration-500"
                    style={{ height: `${(val / (stats.pregnant || 1)) * 100}%`, minHeight: '4px', opacity: 0.7 + idx * 0.1 }}
                  />
                  <span className="text-[9px] font-bold">{idx + 1}º Tri</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.chartBox}>
            <span className="text-xs font-bold text-muted uppercase">Proporção Puericultura</span>
            <div className="flex items-center justify-center relative h-20 w-20">
              {/* SVG Donut Mockup */}
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#e2e8f0" strokeWidth="4" />
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#3b82f6" strokeWidth="4"
                  strokeDasharray={`${(stats.childrenByAge[0] / (stats.children || 1)) * 100} 100`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold">AME</span>
                <span className="text-[8px] opacity-60">(&lt; 6m)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Cards Grid */}
      <p className="section-label" style={{ marginTop: '1.75rem' }}>Módulos Clínicos</p>
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

      {/* Relatório Clínico (Summary) */}
      <h3 className="section-label flex items-center gap-2" style={{ marginTop: '2rem', marginBottom: '1rem', color: '#111827', fontWeight: 700 }}>
        <Activity size={18} color="#0ea5e9" /> Relatório Consolidado
      </h3>
      <div className={styles.summaryRow}>
        <div className={styles.summaryCard} style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', borderColor: '#f9a8d4' }}>
          <span className={styles.summaryNum} style={{ color: '#be185d' }}>{stats.isLoading ? '...' : stats.pregnant}</span>
          <span className={styles.summaryLabel} style={{ color: '#db2777' }}>Pré-natal</span>
        </div>
        <div className={styles.summaryCard} style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', borderColor: '#a5b4fc' }}>
          <span className={styles.summaryNum} style={{ color: '#4338ca' }}>{stats.isLoading ? '...' : stats.children}</span>
          <span className={styles.summaryLabel} style={{ color: '#4f46e5' }}>Crianças</span>
        </div>
        <div className={styles.summaryCard} style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', borderColor: '#fcd34d' }}>
          <span className={styles.summaryNum} style={{ color: '#b45309' }}>{stats.isLoading ? '...' : stats.inventory}</span>
          <span className={styles.summaryLabel} style={{ color: '#d97706' }}>Estoque</span>
        </div>
      </div>

      <div className={styles.footerNote} style={{ marginTop: '3rem', padding: '1.5rem', background: 'var(--surface-alt)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Baseado nas diretrizes do Ministério da Saúde e resoluções COFEN vigentes.
        </p>
        <Link href="/sobre" className="btn btn-outline bg-white dark:bg-gray-800" style={{ fontWeight: 'bold' }}>
          <ShieldAlert size={18} />
          Termos e LGPD
        </Link>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-subtle)', marginTop: '0.5rem', marginBottom: '1rem' }}>
        Desenvolvido por <strong>Connect IA</strong> — Marketing e Automações
      </p>
    </div>
  );
}
