'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PortalLayout } from '../../components/PortalLayout';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../lib/api';

export default function CasesPage() {
  const { user, isDirector, isPanaceaStaff } = useAuth();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [orgFilter, setOrgFilter] = useState('');
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // New Case Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newRef, setNewRef] = useState('');
  const [newClassification, setNewClassification] = useState('confidential');
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function fetchOrgs() {
      const res = await apiFetch<any>('/organizations');
      if (res.data) {
        setOrganizations(res.data);
        // Pre-select first non-Panacea bank org if available
        const bank = res.data.find((o: any) => o.id !== '11111111-1111-1111-1111-111111111111');
        if (bank) setSelectedOrgId(bank.id);
      }
    }
    if (isPanaceaStaff) {
      fetchOrgs();
    }
  }, [isPanaceaStaff]);

  const fetchCases = async () => {
    setLoading(true);
    let url = `/cases?page=${page}&pageSize=10`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (statusFilter) url += `&status=${encodeURIComponent(statusFilter)}`;

    const res = await apiFetch<any>(url);
    if (res.data?.items) {
      let filtered = res.data.items;
      if (orgFilter) {
        filtered = filtered.filter((c: any) => c.organization_id === orgFilter);
      }
      setCases(filtered);
      setTotalPages(res.data.pagination?.totalPages || 1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCases();
  }, [page, statusFilter, orgFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCases();
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    const res = await apiFetch<any>('/cases', {
      method: 'POST',
      body: JSON.stringify({
        title: newTitle,
        external_reference: newRef,
        classification: newClassification,
        organization_id: isPanaceaStaff && selectedOrgId ? selectedOrgId : undefined,
      }),
    });

    setCreating(false);
    if (res.data?.id) {
      setShowCreateModal(false);
      setNewTitle('');
      setNewRef('');
      fetchCases();
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                isPanaceaStaff ? 'bg-burgundy-100 text-burgundy-900 font-bold' : 'bg-navy-100 text-navy-800'
              }`}>
                {isPanaceaStaff ? 'Directorate & Operations Portfolio' : 'Institutional Recovery Portfolio'}
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold text-navy-950">
              {isPanaceaStaff ? 'Cross-Institutional Enforcement Dockets' : 'Secured Case Dockets'}
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              {isPanaceaStaff
                ? 'Central repository of all institutional recovery mandates across Bihar, Jharkhand & Chhattisgarh.'
                : 'Confidential enforcement files under SARFAESI Act, 2002 and auxiliary investigation.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className={`rounded-md px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors flex items-center gap-1.5 ${
              isPanaceaStaff ? 'bg-burgundy-950 hover:bg-burgundy-900' : 'bg-navy-950 hover:bg-navy-900'
            }`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>{isPanaceaStaff ? 'Register New Mandate (Intake)' : 'New Docket Intake'}</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, borrower name, or external loan reference..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none"
              />
            </div>

            {/* Bank Filter (Only for Panacea Staff & Directors) */}
            {isPanaceaStaff && (
              <div className="w-full md:w-56">
                <select
                  value={orgFilter}
                  onChange={(e) => {
                    setOrgFilter(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none font-semibold"
                >
                  <option value="">All Empanelled Banks</option>
                  {organizations
                    .filter((o) => o.id !== '11111111-1111-1111-1111-111111111111')
                    .map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.legal_name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none"
              >
                <option value="">All Status Milestones</option>
                <option value="intake">Intake</option>
                <option value="demand_notice_served">Sec 13(2) Notice Served</option>
                <option value="possession_notice_issued">Sec 13(4) Possession Notice</option>
                <option value="sec14_application_filed">Sec 14 Application Filed</option>
                <option value="dm_order_obtained">DM Order Obtained</option>
                <option value="possession_taken">Possession Taken</option>
                <option value="auction_completed">Auction Completed</option>
                <option value="closed">Closed / Recovered</option>
              </select>
            </div>

            <button
              type="submit"
              className="rounded-md bg-gray-100 hover:bg-gray-200 px-4 py-2 text-xs font-semibold text-navy-900 transition-colors"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Dockets Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
              <thead className="bg-gray-50/75">
                <tr>
                  <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-gray-700">
                    Docket Title
                  </th>
                  {isPanaceaStaff && (
                    <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-gray-700">
                      Empanelled Bank
                    </th>
                  )}
                  <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-gray-700">
                    Bank Reference / Loan No.
                  </th>
                  <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-gray-700">
                    Milestone Status
                  </th>
                  <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-gray-700">
                    Classification
                  </th>
                  <th className="px-6 py-3.5 font-bold uppercase tracking-wider text-gray-700 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={isPanaceaStaff ? 6 : 5} className="py-12 text-center text-gray-400">
                      Loading secured dockets...
                    </td>
                  </tr>
                ) : cases.length === 0 ? (
                  <tr>
                    <td colSpan={isPanaceaStaff ? 6 : 5} className="py-12 text-center text-gray-400">
                      No case dockets found matching the active criteria.
                    </td>
                  </tr>
                ) : (
                  cases.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-navy-950 text-sm">{c.title}</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                          Docket ID: {c.id}
                        </div>
                      </td>
                      {isPanaceaStaff && (
                        <td className="px-6 py-4">
                          <span className="font-semibold text-navy-900 bg-navy-50 px-2 py-0.5 rounded border border-navy-100">
                            {c.organizationName || 'Client Bank'}
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-4 font-mono text-gray-700">
                        {c.external_reference || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-navy-100 text-navy-800">
                          {c.status?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gold-100 text-gold-900 border border-gold-300/40">
                          {c.classification}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/cases/${c.id}`}
                          className="rounded bg-navy-950 hover:bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-xs text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Modal: Register New Mandate / Case Intake */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl text-navy-950 border border-gray-100">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div>
                  <h3 className="font-display text-base font-bold text-navy-950">
                    {isPanaceaStaff ? 'Directorate Mandate Intake Registration' : 'New Docket Intake'}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Register a new secured creditor enforcement file under SARFAESI Act, 2002.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateCase} className="space-y-4">
                {/* Empanelled Institution Picker (Only for Panacea Staff & Directors) */}
                {isPanaceaStaff && (
                  <div>
                    <label className="block text-xs font-semibold text-navy-900 mb-1">
                      Empanelled Secured Creditor Institution *
                    </label>
                    <select
                      value={selectedOrgId}
                      onChange={(e) => setSelectedOrgId(e.target.value)}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none font-semibold"
                    >
                      {organizations
                        .filter((o) => o.id !== '11111111-1111-1111-1111-111111111111')
                        .map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.legal_name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">
                    Docket / Case Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. M/s Royal Agro Industries — Section 14 Enforcement"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">
                    External Bank Reference / Loan Account No.
                  </label>
                  <input
                    type="text"
                    value={newRef}
                    onChange={(e) => setNewRef(e.target.value)}
                    placeholder="e.g. ICICI-SAR-2026-PAT-0099"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">
                    Security Classification
                  </label>
                  <select
                    value={newClassification}
                    onChange={(e) => setNewClassification(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none"
                  >
                    <option value="confidential">CONFIDENTIAL (Standard Bank Enforcement)</option>
                    <option value="restricted">RESTRICTED (High-Value / Sensitive Guarantors)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="rounded-md border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className={`rounded-md px-4 py-2 text-xs font-bold text-white shadow-sm disabled:opacity-50 ${
                      isPanaceaStaff
                        ? 'bg-burgundy-950 hover:bg-burgundy-900'
                        : 'bg-navy-950 hover:bg-navy-900'
                    }`}
                  >
                    {creating ? 'Registering Mandate...' : 'Register Mandate Docket'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
