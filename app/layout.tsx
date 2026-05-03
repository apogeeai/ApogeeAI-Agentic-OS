import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const SITE_NAME = 'Founder OS — OpenClaw Agentic AI Desktop';
const SITE_DESCRIPTION =
  'Founder OS is the desktop control room for OpenClaw — a self-running agentic AI operating system that runs your studio, monitors revenue, ships creative work, and keeps every tenant on-brand while you sleep.';
const SITE_URL = 'https://founder-os.replit.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: '%s · Founder OS',
  },
  description: SITE_DESCRIPTION,
  applicationName: 'Founder OS',
  generator: 'Next.js',
  keywords: [
    'Founder OS',
    'OpenClaw',
    'agentic AI',
    'AI operating system',
    'autonomous agents',
    'AI dashboard',
    'creative automation',
    'multi-tenant AI',
    'AI studio',
    'GPU monitoring',
    'agent swarm',
  ],
  authors: [{ name: 'OpenClaw' }],
  creator: 'OpenClaw',
  publisher: 'OpenClaw',
  category: 'productivity',
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png', sizes: 'any' },
    ],
    apple: [{ url: '/icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/icon.png'],
  },
  openGraph: {
    type: 'website',
    siteName: 'Founder OS',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_US',
    images: [
      {
        url: '/icon.png',
        width: 1024,
        height: 1024,
        alt: 'Founder OS — OpenClaw Agentic AI Desktop',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ['/icon.png'],
    creator: '@openclaw',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#0b1020',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ldJson = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Founder OS',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    creator: { '@type': 'Organization', name: 'OpenClaw' },
  };
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
        />
      </body>
    </html>
  );
}
