import Link from 'next/link';
import {
  HeartPulse, Baby, Activity, ShieldAlert,
  Stethoscope, Syringe, FileText, BookOpen
} from 'lucide-react';

const modules = [
  { href: '/prenatal', label: 'Pré-natal (Gestantes)', icon: HeartPulse, color: '#ec4899', desc: 'Acompanhamento por trimestres, W78/W71.' },
  { href: '/child-care', label: 'Puericultura', icon: Baby, color: '#3b82f6', desc: 'Marcos de desenvolvimento, A98/D70.' },
  { href: '/womens-health', label: 'Saúde da Mulher', icon: Activity, color: '#f43f5e', desc: 'ISTs, Planejamento, Climatério.' },
  { href: '/elderly-health', label: 'Saúde do Idoso', icon: ShieldAlert, color: '#8b5cf6', desc: 'Fragilidade, Polifarmácia.' },
  { href: '/chronic', label: 'Hipertensão/Diabetes', icon: Stethoscope, color: '#10b981', desc: 'Renovação de receitas, metas.' },
  { href: '/vaccination', label: 'Vacinação', icon: Syringe, color: '#f59e0b', desc: 'Calendário vacinal e alertas.' },
];

const tools = [
  { href: '/soap', label: 'Gerador de SOAP', icon: FileText, desc: 'Estruture registros de consulta rapidamente.' },
  { href: '/prescription', label: 'Emissor de Receituário', icon: FileText, desc: 'Gere PDFs com o devido respaldo legal.' },
  { href: '/norms', label: 'Biblioteca de Normas', icon: BookOpen, desc: 'Consulte resoluções e notas técnicas.' },
];

export default function Dashboard() {
  return (
    <div>
      <div className="mb-6">
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Olá, Enfermeira Cláudia 👋</h2>
        <p className="text-muted" style={{ fontSize: '1.1rem' }}>
          Seja bem-vinda ao NurseAps. Selecione o módulo de atendimento abaixo.
        </p>
      </div>

      <h3 className="mb-4">Módulos Clínicos</h3>
      <div className="grid grid-cols-3 gap-6 mb-6">
        {modules.map(mod => {
          const Icon = mod.icon;
          return (
            <Link href={mod.href} key={mod.href}>
              <div className="card" style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    backgroundColor: `${mod.color}20`,
                    color: mod.color,
                    padding: '0.75rem',
                    borderRadius: '12px'
                  }}>
                    <Icon size={24} />
                  </div>
                  <h4 style={{ margin: 0 }}>{mod.label}</h4>
                </div>
                <p className="text-muted" style={{ fontSize: '0.875rem', margin: 0, flex: 1 }}>{mod.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <h3 className="mb-4">Ferramentas de Apoio</h3>
      <div className="grid grid-cols-3 gap-6">
        {tools.map(tool => {
          const Icon = tool.icon;
          return (
            <Link href={tool.href} key={tool.href}>
              <div className="card" style={{ cursor: 'pointer', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    backgroundColor: 'var(--surface-hover)',
                    color: 'var(--text-main)',
                    padding: '0.75rem',
                    borderRadius: '12px'
                  }}>
                    <Icon size={24} />
                  </div>
                  <h4 style={{ margin: 0 }}>{tool.label}</h4>
                </div>
                <p className="text-muted" style={{ fontSize: '0.875rem', margin: 0 }}>{tool.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
