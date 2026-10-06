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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-navy-100/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-950 text-gold-400 font-display text-xl font-bold border border-gold-500/30 shadow-sm group-hover:bg-navy-900 transition-colors">
            P
          </div>
          <div>
            <span className="block font-display text-lg font-bold tracking-tight text-navy-950 leading-tight">
              PANACEA
            </span>
            <span className="block text-[10px] font-semibold tracking-widest text-burgundy-700 uppercase">
              Consultancy Pvt Ltd
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-semibold tracking-wide transition-colors ${
                  isActive
                    ? 'text-burgundy-700 font-bold border-b-2 border-burgundy-700 pb-1'
                    : 'text-navy-800 hover:text-navy-950 hover:border-b-2 hover:border-navy-300 pb-1'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Dual Portal Access Buttons */}
        {(() => {
          const portalBase = process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:3001';
          return (
            <div className="hidden sm:flex items-center gap-2.5">
              <a
                href={`${portalBase}/login?portal=client`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-navy-950 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-navy-900 active:bg-navy-950 border border-navy-700 transition-colors gap-1.5"
                title="Secured Creditor Bank Officer Portal"
              >
                <span>🏦</span>
                <span>Bank Client Portal</span>
              </a>

              <a
                href={`${portalBase}/admin/login`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-burgundy-900 px-3.5 py-2 text-xs font-semibold text-gold-300 shadow-sm hover:bg-burgundy-800 active:bg-burgundy-950 border border-gold-500/40 transition-colors gap-1.5"
                title="Panacea Managing Directors & Platform Administrators"
              >
                <span>🏛️</span>
                <span>Directorate & Admin Login</span>
              </a>
            </div>
          );
        })()}

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
          <div className="flex flex-col gap-3">
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
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              <a
                href={`${process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:3001'}/login?portal=client`}
                className="flex items-center justify-center gap-2 rounded-md bg-navy-950 py-2.5 px-4 text-xs font-semibold text-white border border-navy-700"
              >
                <span>🏦</span>
                <span>Bank Client Portal</span>
              </a>
              <a
                href={`${process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:3001'}/admin/login`}
                className="flex items-center justify-center gap-2 rounded-md bg-burgundy-900 py-2.5 px-4 text-xs font-semibold text-gold-300 border border-gold-500/40"
              >
                <span>🏛️</span>
                <span>Directorate & Admin Login</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
