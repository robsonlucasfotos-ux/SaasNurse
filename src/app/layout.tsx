import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import NurseAIChat from '@/components/NurseAIChat';

export const metadata: Metadata = {
  title: 'NurseAps - Apoio à Decisão Clínica',
  description: 'Sistema de suporte à decisão clínica e gestão de prescrições para Enfermeiros da APS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="layout-wrapper">
          <Sidebar />
          <main className="main-content">
            <Header />
            <div className="page-wrapper">
              {children}
            </div>
          </main>
        </div>
        <NurseAIChat />
      </body>
    </html>
  );
}
