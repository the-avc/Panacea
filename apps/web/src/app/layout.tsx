import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ConsentBanner } from '../components/ConsentBanner';

export const viewport: Viewport = {
  themeColor: '#0a1830',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: '%s | Panacea Consultancy Private Limited',
    default: 'Panacea Consultancy Private Limited — Institutional Enforcement & Investigation',
  },
  description:
    'Dedicated para-legal and enforcement ancillary services for financial institutions across Bihar, Jharkhand, and Chhattisgarh. SARFAESI enforcement, Section 14 processing, asset verification, and third-party investigation.',
  keywords: [
    'SARFAESI enforcement Bihar',
    'Section 14 SARFAESI Jharkhand',
    'Asset verification Chhattisgarh',
    'Secured asset recovery',
    'Financial institution ancillary enforcement',
    'Panacea Consultancy Private Limited',
    'Prashant Kumar Panacea',
  ],
  authors: [{ name: 'Panacea Consultancy Private Limited' }],
  metadataBase: new URL('https://panaceaconsultancy.in'),
  openGraph: {
    title: 'Panacea Consultancy Private Limited',
    description:
      'Institutional enforcement and investigation services for secured creditors across Bihar, Jharkhand, and Chhattisgarh.',
    siteName: 'Panacea Consultancy Private Limited',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#fbfcfd] text-navy-950 antialiased selection:bg-gold-200 selection:text-navy-950">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ConsentBanner />
      </body>
    </html>
  );
}
