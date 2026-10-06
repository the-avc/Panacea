'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PortalLayout } from '../../components/PortalLayout';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../lib/api';

export default function DashboardPage() {
  const { user, isDirector, isPanaceaStaff } = useAuth();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCases() {
      const res = await apiFetch<any>('/cases?pageSize=10');
      if (res.data?.items) {
        setCases(res.data.items);
      }
      setLoading(false);
    }
    loadCases();
  }, []);

  const totalCases = cases.length;
  const inPossession = cases.filter((c) => c.status === 'possession_taken').length;
  const orderObtained = cases.filter((c) => c.status === 'dm_order_obtained').length;
  const inNotice = cases.filter((c) => c.status === 'demand_notice_served' || c.status === 'possession_notice_issued').length;
  const inCourt = cases.filter((c) => c.status === 'sec14_application_filed').length;

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Welcome & Command Banner */}
        <div className={`rounded-xl border p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
          isPanaceaStaff ? 'bg-gradient-to-r from-burgundy-950 to-navy-950 text-white border-burgundy-900' : 'bg-white border-navy-100'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                isPanaceaStaff ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40' : 'bg-navy-100 text-navy-800'
              }`}>
                {isPanaceaStaff
                  ? isDirector
                    ? '🏛️ Directorate Executive Oversight'
                    : '🛡️ Panacea Enforcement Operations'
                  : '🏦 Secured Creditor Client Desk'}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className={`text-xs ${isPanaceaStaff ? 'text-gray-300' : 'text-gray-500'}`}>
                {user?.organization?.legalName}
              </span>
            </div>
            <h1 className={`font-display text-2xl font-bold ${isPanaceaStaff ? 'text-white' : 'text-navy-950'}`}>
              Welcome, {user?.displayName}
            </h1>
            <p className={`mt-1 text-xs max-w-2xl ${isPanaceaStaff ? 'text-gray-300' : 'text-gray-600'}`}>
              {isPanaceaStaff
                ? 'Secured Creditor enforcement oversight under the SARFAESI Act, 2002 across Bihar, Jharkhand, and Chhattisgarh jurisdictions.'
                : 'Direct monitoring portal for your institutional recovery dockets, Section 14 petitions, and physical asset possession orders.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {isPanaceaStaff && (
              <Link
                href="/cases"
                className="rounded-md bg-gold-500 hover:bg-gold-400 active:bg-gold-600 px-3.5 py-2 text-xs font-bold text-navy-950 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span>➕</span>
                <span>Register New Mandate</span>
              </Link>
            )}
            <Link
              href="/cases"
              className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-colors shadow-sm ${
                isPanaceaStaff
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  : 'bg-navy-950 hover:bg-navy-900 text-white'
              }`}
            >
              Browse All Dockets →
            </Link>
          </div>
        </div>

        {/* Directorate Action Shortcuts (Only for Panacea Company & Directors) */}
        {isPanaceaStaff && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center justify-between">
              <span>Directorate & Operations Action Center</span>
              <span className="text-burgundy-700 font-semibold">Jurisdiction: Bihar • Jharkhand • Chhattisgarh</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link
                href="/cases"
                className="p-3 rounded-lg border border-gray-200 hover:border-burgundy-700 hover:bg-burgundy-50/50 transition-all text-left group"
              >
                <div className="text-base mb-1">📁</div>
                <div className="text-xs font-bold text-navy-950 group-hover:text-burgundy-800">
                  Cross-Bank Dockets
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">
                  Inspect ICICI, Axis & SBI enforcement cases
                </div>
              </Link>

              <Link
                href="/documents"
                className="p-3 rounded-lg border border-gray-200 hover:border-burgundy-700 hover:bg-burgundy-50/50 transition-all text-left group"
              >
                <div className="text-base mb-1">📄</div>
                <div className="text-xs font-bold text-navy-950 group-hover:text-burgundy-800">
                  Document Vault
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">
                  Upload & dispatch certified DM Section 14 orders
                </div>
              </Link>

              <Link
                href="/admin/organizations"
                className="p-3 rounded-lg border border-gray-200 hover:border-burgundy-700 hover:bg-burgundy-50/50 transition-all text-left group"
              >
                <div className="text-base mb-1">🏦</div>
                <div className="text-xs font-bold text-navy-950 group-hover:text-burgundy-800">
                  Empanelled Banks
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">
                  Manage bank client branches & institutional users
                </div>
              </Link>

              <Link
                href="/admin/audit-logs"
                className="p-3 rounded-lg border border-gray-200 hover:border-burgundy-700 hover:bg-burgundy-50/50 transition-all text-left group"
              >
                <div className="text-base mb-1">📜</div>
                <div className="text-xs font-bold text-navy-950 group-hover:text-burgundy-800">
                  Compliance Audit Trail
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">
                  Inspect immutable statutory access logs
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              {isPanaceaStaff ? 'Total Cross-Bank Dockets' : 'Total Active Bank Dockets'}
            </span>
            <div className="mt-2 text-3xl font-bold text-navy-950 font-display">
              {loading ? '—' : totalCases}
            </div>
            <p className="mt-1 text-[11px] text-gray-500">Under SARFAESI enforcement</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
              Possessions Secured
            </span>
            <div className="mt-2 text-3xl font-bold text-emerald-800 font-display">
              {loading ? '—' : inPossession}
            </div>
            <p className="mt-1 text-[11px] text-gray-500">Physical handover to creditor complete</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
              DM Section 14 Orders Obtained
            </span>
            <div className="mt-2 text-3xl font-bold text-amber-800 font-display">
              {loading ? '—' : orderObtained}
            </div>
            <p className="mt-1 text-[11px] text-gray-500">Certified DM / CMM orders secured</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
              Petitions Filed & Notices Served
            </span>
            <div className="mt-2 text-3xl font-bold text-sky-800 font-display">
              {loading ? '—' : inCourt + inNotice}
            </div>
            <p className="mt-1 text-[11px] text-gray-500">Active DM hearings / Sec 13(2) statutory window</p>
          </div>
        </div>

        {/* Recent Dockets Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-bold text-navy-950">
                {isPanaceaStaff ? 'Active Cross-Bank Case Dockets' : 'Your Bank Recovery Dockets'}
              </h2>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {isPanaceaStaff
                  ? 'Real-time enforcement movements across all empanelled banks'
                  : 'Real-time milestone updates for your institution'}
              </p>
            </div>
            <Link href="/cases" className="text-xs font-semibold text-burgundy-700 hover:text-burgundy-900">
              View Complete Docket List →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
              <thead className="bg-gray-50/75">
                <tr>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-gray-600">
                    Docket / Case Title
                  </th>
                  {isPanaceaStaff && (
                    <th className="px-6 py-3 font-semibold uppercase tracking-wider text-gray-600">
                      Bank Institution
                    </th>
                  )}
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-gray-600">
                    External Reference
                  </th>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-gray-600">
                    Enforcement Status
                  </th>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-gray-600">
                    Classification
                  </th>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-gray-600 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={isPanaceaStaff ? 6 : 5} className="py-8 text-center text-gray-400">
                      Loading active dockets...
                    </td>
                  </tr>
                ) : cases.length === 0 ? (
                  <tr>
                    <td colSpan={isPanaceaStaff ? 6 : 5} className="py-8 text-center text-gray-400">
                      No case dockets registered.
                    </td>
                  </tr>
                ) : (
                  cases.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="font-bold text-navy-950">{c.title}</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {c.id}</div>
                      </td>
                      {isPanaceaStaff && (
                        <td className="px-6 py-3.5">
                          <span className="font-semibold text-navy-900 bg-navy-50 px-2 py-0.5 rounded border border-navy-100">
                            {c.organizationName || 'Client Bank'}
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-3.5 font-mono text-gray-600">
                        {c.external_reference || '—'}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-navy-100 text-navy-800">
                          {c.status?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold-100 text-gold-900 border border-gold-300/40">
                          {c.classification}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <Link
                          href={`/cases/${c.id}`}
                          className="font-bold text-burgundy-700 hover:text-burgundy-900 transition-colors"
                        >
                          View Docket →
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
