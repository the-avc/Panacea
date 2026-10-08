'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export const PortalSidebar: React.FC = () => {
  const pathname = usePathname();
  const { isAdmin, isDirector, isPanaceaStaff } = useAuth();

  const renderIcon = (type: string) => {
    switch (type) {
      case 'dashboard':
        return (
          <svg className="h-4 w-4 shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'cases':
        return (
          <svg className="h-4 w-4 shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        );
      case 'documents':
        return (
          <svg className="h-4 w-4 shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'notifications':
        return (
          <svg className="h-4 w-4 shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
      case 'profile':
        return (
          <svg className="h-4 w-4 shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'admin':
        return (
          <svg className="h-4 w-4 shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'organizations':
        return (
          <svg className="h-4 w-4 shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'users':
        return (
          <svg className="h-4 w-4 shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'audit':
        return (
          <svg className="h-4 w-4 shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      case 'security':
        return (
          <svg className="h-4 w-4 shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const staffLinks = [
    { label: 'Executive Dashboard', href: '/dashboard', iconKey: 'dashboard' },
    { label: 'Institutional Dockets', href: '/cases', iconKey: 'cases' },
    { label: 'Document Vault & Dispatch', href: '/documents', iconKey: 'documents' },
    { label: 'Operations Alerts', href: '/notifications', iconKey: 'notifications' },
    { label: 'Profile & Security', href: '/profile', iconKey: 'profile' },
  ];

  const clientLinks = [
    { label: 'Portfolio Overview', href: '/dashboard', iconKey: 'dashboard' },
    { label: 'Assigned Case Dockets', href: '/cases', iconKey: 'cases' },
    { label: 'Legal Document Vault', href: '/documents', iconKey: 'documents' },
    { label: 'Recovery Updates', href: '/notifications', iconKey: 'notifications' },
    { label: 'Profile & Security', href: '/profile', iconKey: 'profile' },
  ];

  const adminLinks = [
    { label: 'Admin Command Center', href: '/admin', iconKey: 'admin' },
    { label: 'Empanelled Institutions', href: '/admin/organizations', iconKey: 'organizations' },
    { label: 'Personnel & User Directory', href: '/admin/users', iconKey: 'users' },
    { label: 'Compliance Audit Trail', href: '/admin/audit-logs', iconKey: 'audit' },
    { label: 'Security Incident Center', href: '/admin/security-events', iconKey: 'security' },
  ];

  const mainLinks = isPanaceaStaff ? staffLinks : clientLinks;

  return (
    <aside className="w-64 border-r border-gray-200 bg-white flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className={`h-16 flex flex-col justify-center px-6 border-b border-gray-200 text-white ${
        isPanaceaStaff ? 'bg-burgundy-950' : 'bg-navy-950'
      }`}>
        <span className="block font-display font-bold text-base tracking-[0.08em] leading-tight">
          PANACEA
        </span>
        <span className="block text-[9px] font-semibold tracking-[0.18em] text-gold-300 uppercase mt-0.5">
          {isPanaceaStaff
            ? isDirector
              ? 'Directorate Command'
              : 'Operations Portal'
            : 'Institutional Client Portal'}
        </span>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
        {/* Main Workspace */}
        <div>
          <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
            {isPanaceaStaff ? 'Panacea Operations Workspace' : 'Institutional Recovery Workspace'}
          </div>
          <nav className="space-y-1">
            {mainLinks.map((link) => {
              const isActive =
                link.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
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
                  {renderIcon(link.iconKey)}
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
                const isActive =
                  link.href === '/admin'
                    ? pathname === '/admin'
                    : pathname === link.href || pathname.startsWith(`${link.href}/`);
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
                    {renderIcon(link.iconKey)}
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
