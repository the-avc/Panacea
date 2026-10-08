'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Institutional Experience', href: '/institutional-experience' },
    { label: 'Leadership', href: '/leadership' },
    { label: 'Security & Privacy', href: '/security-confidentiality' },
    { label: 'Contact', href: '/contact' },
  ];

  const portalBase = process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:3001';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-navy-100/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-[1800px] items-center justify-between px-4 sm:px-6 lg:px-6 xl:px-8 2xl:px-14">
        {/* Brand Wordmark - authentic corporate identity without faux logo box */}
        <Link href="/" className="flex flex-col shrink-0 mr-3 xl:mr-6 2xl:mr-10 group">
          <span className="font-display text-xl sm:text-2xl font-bold tracking-[0.08em] text-navy-950 leading-none group-hover:text-burgundy-900 transition-colors">
            PANACEA
          </span>
          <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.22em] text-burgundy-800 uppercase mt-1">
            Consultancy Private Limited
          </span>
        </Link>

        {/* Desktop Nav - centered with ample breathing room */}
        <nav className="hidden lg:flex items-center justify-center gap-2.5 xl:gap-4 2xl:gap-7 flex-1 mx-2 xl:mx-4 2xl:mx-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[11px] xl:text-xs 2xl:text-[13px] font-semibold tracking-wide whitespace-nowrap py-1.5 border-b-2 transition-all ${
                  isActive
                    ? 'text-burgundy-700 font-bold border-burgundy-700'
                    : 'text-navy-800 hover:text-navy-950 border-transparent hover:border-navy-300'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Dual Portal Access Buttons - anchored right with guaranteed separation */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 2xl:gap-3.5 shrink-0 ml-3 xl:ml-5 2xl:ml-8">
          <a
            href={`${portalBase}/login?portal=client`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-navy-950 px-2.5 xl:px-3 2xl:px-4 py-2 text-[11px] xl:text-xs font-semibold text-white shadow-sm hover:bg-navy-900 active:bg-navy-950 border border-navy-700 transition-colors gap-1.5 whitespace-nowrap"
            title="Institutional Client Portal (Banks, NBFCs, ARCs, Housing Finance Companies)"
          >
            <svg
              className="h-3.5 w-3.5 text-gold-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span>
              <span className="hidden 2xl:inline">Institutional </span>Client Portal
            </span>
          </a>

          <a
            href={`${portalBase}/admin/login`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-burgundy-900 px-2.5 xl:px-3 2xl:px-4 py-2 text-[11px] xl:text-xs font-semibold text-gold-300 shadow-sm hover:bg-burgundy-800 active:bg-burgundy-950 border border-gold-500/40 transition-colors gap-1.5 whitespace-nowrap"
            title="Panacea Managing Directors & Platform Administrators"
          >
            <svg
              className="h-3.5 w-3.5 text-gold-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
              />
            </svg>
            <span>
              <span className="hidden 2xl:inline">Directorate & </span>Admin Login
            </span>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-navy-800 hover:text-navy-950 rounded-md focus:outline-none"
          aria-label="Toggle Navigation"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav dropdown */}
      {isOpen && (
        <div className="lg:hidden border-t border-navy-100 bg-white px-4 pt-3 pb-6 shadow-lg">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-sm font-medium py-2 px-3 rounded-md transition-colors ${
                  pathname === link.href
                    ? 'bg-navy-50 text-burgundy-700 font-semibold'
                    : 'text-navy-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <a
                href={`${portalBase}/login?portal=client`}
                className="flex items-center justify-center gap-2 rounded-md bg-navy-950 py-2.5 px-4 text-xs font-semibold text-white border border-navy-700"
              >
                <svg
                  className="h-4 w-4 text-gold-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span>Institutional Client Portal</span>
              </a>
              <a
                href={`${portalBase}/admin/login`}
                className="flex items-center justify-center gap-2 rounded-md bg-burgundy-900 py-2.5 px-4 text-xs font-semibold text-gold-300 border border-gold-500/40"
              >
                <svg
                  className="h-4 w-4 text-gold-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                  />
                </svg>
                <span>Directorate & Admin Login</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
