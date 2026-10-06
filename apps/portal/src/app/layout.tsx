import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';

export const viewport: Viewport = {
  themeColor: '#0f2145',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: '%s | Panacea Secure Portal',
    default: 'Panacea Consultancy — Institutional Client Portal',
  },
  description: 'Confidential docket management and secure document vault for authorized banking partners.',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
      </head>
      <body className="min-h-screen bg-gray-50 text-navy-950 antialiased selection:bg-navy-900 selection:text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
