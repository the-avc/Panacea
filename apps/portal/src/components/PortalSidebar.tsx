'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export const PortalSidebar: React.FC = () => {
  const pathname = usePathname();
  const { isAdmin, isDirector, isPanaceaStaff } = useAuth();

  const staffLinks = [
    { label: 'Executive Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Cross-Bank Dockets', href: '/cases', icon: '📁' },
    { label: 'Document Vault & Dispatch', href: '/documents', icon: '📄' },
    { label: 'Operations Alerts', href: '/notifications', icon: '🔔' },
    { label: 'Profile & Security', href: '/profile', icon: '🛡️' },
  ];

  const clientLinks = [
    { label: 'Bank Overview', href: '/dashboard', icon: '📊' },
    { label: 'Assigned Case Dockets', href: '/cases', icon: '📁' },
    { label: 'Legal Document Vault', href: '/documents', icon: '📄' },
    { label: 'Recovery Updates', href: '/notifications', icon: '🔔' },
    { label: 'Profile & Security', href: '/profile', icon: '🛡️' },
  ];

  const adminLinks = [
    { label: 'Admin Command Center', href: '/admin', icon: '⚙️' },
    { label: 'Empanelled Banks & Orgs', href: '/admin/organizations', icon: '🏦' },
    { label: 'Personnel & User Directory', href: '/admin/users', icon: '👥' },
    { label: 'Compliance Audit Trail', href: '/admin/audit-logs', icon: '📜' },
    { label: 'Security Incident Center', href: '/admin/security-events', icon: '🚨' },
  ];

  const mainLinks = isPanaceaStaff ? staffLinks : clientLinks;

  return (
    <aside className="w-64 border-r border-gray-200 bg-white flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className={`h-16 flex items-center gap-3 px-6 border-b border-gray-200 text-white ${
        isPanaceaStaff ? 'bg-burgundy-950' : 'bg-navy-950'
      }`}>
        <div className="h-8 w-8 rounded-md bg-white/10 border border-gold-500/40 text-gold-400 font-display font-bold flex items-center justify-center text-sm">
          P
        </div>
        <div>
          <span className="block font-display font-bold text-sm tracking-tight leading-tight">
            PANACEA
          </span>
          <span className="block text-[9px] font-semibold tracking-wider text-gold-300 uppercase">
            {isPanaceaStaff
              ? isDirector
                ? 'Directorate Command'
                : 'Operations Portal'
              : 'Client Portal'}
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
        {/* Main Workspace */}
        <div>
          <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            {isPanaceaStaff ? 'Panacea Operations Workspace' : 'Bank Recovery Workspace'}
          </div>
          <nav className="space-y-1">
            {mainLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                    isActive
                      ? isPanaceaStaff
                        ? 'bg-burgundy-900 text-white shadow-sm'
                        : 'bg-navy-900 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-navy-950'
                  }`}
                >
                  <span className="text-sm">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Administration & Directorate Section */}
        {isAdmin && (
          <div>
            <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-burgundy-700 mb-2">
              Directorate & System Admin
            </div>
            <nav className="space-y-1">
              {adminLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-navy-950 text-gold-300 shadow-sm border border-gold-500/30'
                        : 'text-gray-700 hover:bg-burgundy-50 hover:text-burgundy-900'
                    }`}
                  >
                    <span className="text-sm">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Footer Security Badge */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="rounded border border-gray-200 bg-white p-2.5 text-[10px] text-gray-500 leading-tight">
          <span className="font-semibold text-navy-950 block mb-0.5">RESTRICTED JURISDICTION</span>
          Operating under SARFAESI Act, 2002 across Bihar, Jharkhand & Chhattisgarh.
        </div>
      </div>
    </aside>
  );
};
