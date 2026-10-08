'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PortalLayout } from '../../components/PortalLayout';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../lib/api';

export default function AdminDashboardPage() {
  const { user, isAdmin, isDirector } = useAuth();
  const [auditCount, setAuditCount] = useState(0);
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      const [aRes, sRes, uRes] = await Promise.all([
        apiFetch<any>('/admin/audit-logs?pageSize=1'),
        apiFetch<any>('/admin/security-events'),
        apiFetch<any>('/admin/users'),
      ]);

      if (aRes.data) setAuditCount(aRes.data.pagination?.totalItems || 0);
      if (sRes.data) setSecurityEvents(sRes.data);
      if (uRes.data) setUserCount(uRes.data.length || 0);
      setLoading(false);
    }

    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <PortalLayout>
        <div className="max-w-xl mx-auto my-12 p-8 text-center bg-white rounded-2xl border border-burgundy-200 shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-burgundy-50 border border-burgundy-200 text-burgundy-900 mb-4">
            <svg className="h-7 w-7 text-burgundy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
            </svg>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-burgundy-800 bg-burgundy-100/60 px-2.5 py-0.5 rounded">
            Restricted Directorate Gateway
          </span>
          <h2 className="mt-3 font-display text-xl font-bold text-navy-950">
            Directorate & Administrative Authentication Required
          </h2>
          <p className="mt-2 text-xs text-gray-600 leading-relaxed">
            {user ? (
              <>
                You are currently authenticated as <strong className="text-navy-950">{user.displayName}</strong> ({user.role?.name?.replace(/_/g, ' ')}). This governance console is strictly restricted to Managing Directors, Operations Heads, and System Administrators.
              </>
            ) : (
              'This console requires Platform Super Admin, Operations Director, or Compliance Administrator credentials.'
            )}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/admin/login"
              className="w-full sm:w-auto rounded-md bg-burgundy-950 hover:bg-burgundy-900 px-5 py-2.5 text-xs font-bold text-gold-300 shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Authenticate as Director / Admin →</span>
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto rounded-md border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2.5 text-xs font-semibold text-navy-900 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Directorate Master Banner */}
        <div className="rounded-xl border border-burgundy-900 bg-gradient-to-r from-burgundy-950 to-navy-950 p-6 shadow-sm text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gold-500/20 text-gold-300 border border-gold-500/40">
                  {isDirector ? 'Executive Directorate Command' : 'Systems Administration'}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gold-200">
                  {user?.displayName} ({user?.role?.name?.replace(/_/g, ' ')})
                </span>
              </div>
              <h1 className="font-display text-2xl font-bold text-white">
                Platform Governance & Enforcement Command Center
              </h1>
              <p className="mt-1 text-xs text-gray-300 max-w-2xl leading-relaxed">
                Centralized statutory administrative control under SARFAESI Act, 2002. Oversee client institutional tenants, onboard recovery officers, inspect cryptographic audit trails, and manage security incidents across Bihar, Jharkhand & Chhattisgarh.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link
                href="/admin/users"
                className="rounded-md bg-gold-500 hover:bg-gold-400 active:bg-gold-600 px-3.5 py-2 text-xs font-bold text-navy-950 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Onboard Officer</span>
              </Link>
              <Link
                href="/admin/organizations"
                className="rounded-md bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3.5 py-2 text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
              >
                <svg className="h-3.5 w-3.5 text-gold-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Register Institution</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Admin KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Total Managed Accounts
            </span>
            <div className="mt-2 text-3xl font-bold text-navy-950 font-display">
              {loading ? '—' : userCount}
            </div>
            <p className="mt-1 text-[11px] text-gray-500">Directors, officers & client desks</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-burgundy-700">
              Security Incidents
            </span>
            <div className="mt-2 text-3xl font-bold text-burgundy-900 font-display">
              {loading ? '—' : securityEvents.length}
            </div>
            <p className="mt-1 text-[11px] text-gray-500">Lockout triggers & anomalies</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-navy-700">
              Immutable Audit Events
            </span>
            <div className="mt-2 text-3xl font-bold text-navy-950 font-display">
              {loading ? '—' : auditCount}
            </div>
            <p className="mt-1 text-[11px] text-gray-500">Cryptographically stamped logs</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
              System Health & DB
            </span>
            <div className="mt-2 text-xl font-bold text-emerald-800 font-display">
              OPERATIONAL
            </div>
            <p className="mt-1 text-[11px] text-gray-500">Zero unhandled breaches</p>
          </div>
        </div>

        {/* Directorate & Admin Action Suites */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Core Directorate Governance Suites
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/organizations"
              className="p-5 rounded-xl border border-gray-200 bg-white hover:border-navy-400 hover:shadow-md transition-all block group"
            >
              <div className="h-8 w-8 rounded-lg bg-navy-50 text-navy-900 border border-navy-100 flex items-center justify-center mb-3">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-bold text-sm text-navy-950 group-hover:text-burgundy-800">
                Empanelled Institutions
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Empanel new scheduled commercial banks, NBFCs, ARCs, and manage tenant organizations.
              </p>
              <span className="inline-block mt-3 text-[11px] font-bold text-navy-900 group-hover:underline">
                Manage Institutions →
              </span>
            </Link>

            <Link
              href="/admin/users"
              className="p-5 rounded-xl border border-gray-200 bg-white hover:border-navy-400 hover:shadow-md transition-all block group"
            >
              <div className="h-8 w-8 rounded-lg bg-navy-50 text-navy-900 border border-navy-100 flex items-center justify-center mb-3">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-sm text-navy-950 group-hover:text-burgundy-800">
                Personnel & Access Control
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Onboard legal counsel, field recovery agents, investigators, and institutional nodal officers.
              </p>
              <span className="inline-block mt-3 text-[11px] font-bold text-navy-900 group-hover:underline">
                Manage Directory →
              </span>
            </Link>

            <Link
              href="/admin/audit-logs"
              className="p-5 rounded-xl border border-gray-200 bg-white hover:border-navy-400 hover:shadow-md transition-all block group"
            >
              <div className="h-8 w-8 rounded-lg bg-navy-50 text-navy-900 border border-navy-100 flex items-center justify-center mb-3">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-sm text-navy-950 group-hover:text-burgundy-800">
                Statutory Audit Trail
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Inspect immutable evidence trails of document dispatches, logins, and status transitions.
              </p>
              <span className="inline-block mt-3 text-[11px] font-bold text-navy-900 group-hover:underline">
                Audit Trail Explorer →
              </span>
            </Link>

            <Link
              href="/admin/security-events"
              className="p-5 rounded-xl border border-gray-200 bg-white hover:border-navy-400 hover:shadow-md transition-all block group"
            >
              <div className="h-8 w-8 rounded-lg bg-burgundy-50 text-burgundy-900 border border-burgundy-100 flex items-center justify-center mb-3">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-bold text-sm text-navy-950 group-hover:text-burgundy-800">
                Security Incident Center
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Investigate brute force lockouts, rate limit violations, and resolve security events.
              </p>
              <span className="inline-block mt-3 text-[11px] font-bold text-navy-900 group-hover:underline">
                Review Incidents →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
