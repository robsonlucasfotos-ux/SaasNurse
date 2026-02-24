import type { Metadata, Viewport } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import NurseAIChat from '@/components/NurseAIChat';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-roboto',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0ea5e9'
};

export const metadata: Metadata = {
  title: 'Guia APS — Suporte Clínico',
  description: 'Hub de inteligência clínica para enfermeiros da Atenção Primária à Saúde.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-512x512.png',
    shortcut: '/icon-512x512.png',
    apple: '/icon-512x512.png',
  },
  appleWebApp: {
    title: 'Guia APS',
    statusBarStyle: 'default',
  }
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={roboto.variable}>
      <body className={roboto.variable}>
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
