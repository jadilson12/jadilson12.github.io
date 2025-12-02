import type { Metadata } from "next";
import PageTransition from "@/components/PageTransition";
import ClientLayout from "@/components/ClientLayout";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jadilson Guedes - Engenheiro de Software | IA, Cloud & DevOps",
  description: "Engenheiro de Software com 8+ anos desenvolvendo soluções completas do planejamento à implantação. Especialista em on-premise, cloud e integração com IA.",
  keywords: [
    'engenheiro de software',
    'software engineer',
    'desenvolvedor full stack',
    'on-premise',
    'cloud computing',
    'inteligência artificial',
    'kubernetes',
    'azure',
    'devops',
    'nodejs',
    'java',
    'python',
    'react',
    'typescript',
    'microserviços',
    'ci/cd',
    'chatbots',
    'government technology',
    'govtech',
  ],
  authors: [{ name: 'Jadilson Guedes' }],
  creator: 'Jadilson Guedes',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'J.Guedes',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    title: 'Jadilson Guedes - Engenheiro de Software | IA, Cloud & DevOps',
    description: 'Engenheiro de Software com 8+ anos desenvolvendo soluções do planejamento à implantação. On-premise, cloud e integração com IA.',
    siteName: 'Jadilson Guedes',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jadilson Guedes - Engenheiro de Software',
    description: 'Do planejamento à implantação | On-Premise, Cloud e IA',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#c9f31d',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-dark-950 text-dark-50`}
      >
        <ClientLayout>
          <PageTransition>{children}</PageTransition>
        </ClientLayout>
      </body>
    </html>
  );
}
