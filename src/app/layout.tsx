import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import NurseAIChat from '@/components/NurseAIChat';

export const metadata: Metadata = {
  title: 'Guia APS — Suporte Clínico',
  description: 'Hub de inteligência clínica para enfermeiros da Atenção Primária à Saúde.',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="layout-wrapper">
          <main className="main-content">
            <Header />
            <div className="page-wrapper">{children}</div>
          </main>
        </div>
        <BottomNav />
        <NurseAIChat />
      </body>
    </html>
  );
}
