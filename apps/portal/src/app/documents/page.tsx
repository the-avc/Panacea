'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PortalLayout } from '../../components/PortalLayout';
import { apiFetch } from '../../lib/api';

export default function DocumentsPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocuments() {
      const res = await apiFetch<any>('/cases');
      if (res.data?.items) {
        setCases(res.data.items);
      }
      setLoading(false);
    }
    loadDocuments();
  }, []);

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-950">
            Document Repository & Certified Vault
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Secure, encrypted vault containing Section 13(2) notices, Section 14 petitions, magisterial orders, and panchnamas.
          </p>
        </div>

        {/* Security Advisory */}
        <div className="p-4 rounded-xl border border-navy-100 bg-white shadow-sm flex items-start gap-3">
          <span className="text-navy-800 text-lg">🛡️</span>
          <div className="text-xs text-gray-600 leading-relaxed">
            <span className="font-bold text-navy-950 block">Signed Ephemeral Access URLs</span>
            For institutional data security, document contents are never stored on public CDNs.
            All downloads utilize 5-minute single-use signed cryptographic tokens and are recorded
            in the immutable audit log.
          </div>
        </div>

        {/* Dockets with Documents */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-display text-base font-bold text-navy-950">
              Active Case Vaults
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-8 text-center text-xs text-gray-400">Loading document vaults...</div>
            ) : cases.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 italic">
                No active document vaults available for your organization.
              </div>
            ) : (
              cases.map((c) => (
                <div key={c.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-700">
                        {c.classification}
                      </span>
                      <span className="text-xs font-mono text-gray-500">
                        {c.external_reference || 'No Reference'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-navy-950 text-sm">{c.title}</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Status Milestone: <span className="capitalize text-navy-900 font-medium">{c.status.replace(/_/g, ' ')}</span>
                    </p>
                  </div>

                  <Link
                    href={`/cases/${c.id}`}
                    className="inline-flex items-center gap-1.5 rounded-md bg-navy-50 hover:bg-navy-100 text-navy-900 font-semibold px-4 py-2 text-xs transition-colors shrink-0"
                  >
                    <span>Open Case Vault</span>
                    <span>→</span>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
