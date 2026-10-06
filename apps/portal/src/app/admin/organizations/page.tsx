'use client';

import React, { useEffect, useState } from 'react';
import { PortalLayout } from '../../../components/PortalLayout';
import { apiFetch } from '../../../lib/api';

export default function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newOrgName, setNewOrgName] = useState('');
  const [creating, setCreating] = useState(false);

  const loadOrgs = async () => {
    setLoading(true);
    const res = await apiFetch<any>('/organizations');
    if (res.data) {
      setOrganizations(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrgs();
  }, []);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName) return;
    setCreating(true);

    const res = await apiFetch<any>('/organizations', {
      method: 'POST',
      body: JSON.stringify({ legalName: newOrgName }),
    });

    setCreating(false);
    if (res.data?.id) {
      setNewOrgName('');
      loadOrgs();
    }
  };

  const handleSuspendOrg = async (id: string) => {
    if (confirm('Suspend this organization? All assigned user accounts will lose access.')) {
      await apiFetch(`/organizations/${id}/suspend`, { method: 'POST' });
      loadOrgs();
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-950">
            Organization Directory & Client Entities
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Manage banks, housing finance corporations, and asset reconstruction entities empaneled with Panacea.
          </p>
        </div>

        {/* Create Organization Form */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-base font-bold text-navy-950 mb-3">
            Add New Client Institution
          </h2>
          <form onSubmit={handleCreateOrg} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              placeholder="e.g. HDFC Bank Limited / Cholamandalam Investment"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none"
            />
            <button
              type="submit"
              disabled={creating}
              className="rounded-md bg-navy-950 hover:bg-navy-900 px-4 py-2 text-xs font-semibold text-white transition-colors disabled:opacity-50 shrink-0"
            >
              {creating ? 'Registering...' : '+ Register Institution'}
            </button>
          </form>
        </div>

        {/* Organizations Table */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-display text-base font-bold text-navy-950">
              Registered Organizations
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
              <thead className="bg-gray-50/75">
                <tr>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-gray-600">
                    Legal Name
                  </th>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-gray-600">
                    Tenant UUID
                  </th>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-gray-600 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60 bg-white">
                {organizations.map((org) => (
                  <tr key={org.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-semibold text-navy-950">{org.legal_name}</td>
                    <td className="px-6 py-4 font-mono text-[11px] text-gray-500">{org.id}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 border border-emerald-200 capitalize">
                        {org.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {org.id !== '11111111-1111-1111-1111-111111111111' && (
                        <button
                          type="button"
                          onClick={() => handleSuspendOrg(org.id)}
                          className="text-xs font-semibold text-burgundy-700 hover:text-burgundy-900 underline"
                        >
                          Suspend Tenant
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
