'use client';

import React, { useEffect, useState } from 'react';
import { PortalLayout } from '../../../components/PortalLayout';
import { apiFetch } from '../../../lib/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [roleName, setRoleName] = useState('panacea_legal_recovery_user');
  const [organizationId, setOrganizationId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    setLoading(true);
    const [uRes, oRes] = await Promise.all([
      apiFetch<any>('/admin/users'),
      apiFetch<any>('/organizations'),
    ]);

    if (uRes.data) {
      setUsers(uRes.data);
    }
    if (oRes.data) {
      setOrgs(oRes.data);
      if (oRes.data.length > 0 && !organizationId) {
        setOrganizationId(oRes.data[0].id);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleUser = async (user: any) => {
    const isDisabling = user.status === 'active';
    const action = isDisabling ? 'disable' : 'enable';

    if (
      confirm(
        `${isDisabling ? 'Disable' : 'Re-enable'} user account for ${user.email}? ${
          isDisabling ? 'All active sessions will be terminated immediately.' : ''
        }`,
      )
    ) {
      await apiFetch(`/admin/users/${user.id}/${action}`, { method: 'POST' });
      loadData();
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    const res = await apiFetch<any>('/admin/users', {
      method: 'POST',
      body: JSON.stringify({
        displayName,
        email,
        roleName,
        organizationId,
      }),
    });

    setSubmitting(false);

    if (res.error) {
      setFormError(res.error.message || 'Failed to onboard user.');
      return;
    }

    // Reset & reload
    setDisplayName('');
    setEmail('');
    setShowModal(false);
    loadData();
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-burgundy-700">
              Platform Governance
            </span>
            <h1 className="mt-1 font-display text-2xl font-bold text-navy-950">
              Personnel Directory & Access Control
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Manage Directorate leadership, legal counsel, field recovery officers, and bank nodal officers.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="rounded-md bg-burgundy-950 hover:bg-burgundy-900 active:bg-burgundy-950 px-4 py-2 text-xs font-bold text-gold-300 shadow-sm transition-colors flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>➕</span>
            <span>Onboard Personnel / Officer</span>
          </button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-navy-950">
              Registered Accounts ({users.length})
            </h2>
            <button
              type="button"
              onClick={loadData}
              className="text-xs font-semibold text-navy-900 hover:underline"
            >
              Refresh Directory
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
              <thead className="bg-gray-50/75">
                <tr>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-gray-600">
                    Personnel Name & Email
                  </th>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-gray-600">
                    Entity / Bank
                  </th>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-gray-600">
                    Assigned Role
                  </th>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-gray-600">
                    Status
                  </th>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-gray-600 text-right">
                    Administrative Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">Loading directory...</td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-navy-950">{u.displayName}</div>
                        <div className="text-[11px] text-gray-500 font-mono">{u.email}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">{u.organizationName}</td>
                      <td className="px-6 py-4">
                        <span className="rounded bg-navy-50 text-navy-900 px-2.5 py-1 text-[10px] font-semibold border border-navy-100">
                          {u.roleName.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            u.status === 'active'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-burgundy-50 text-burgundy-800 border border-burgundy-200'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleUser(u)}
                          className={`text-xs font-semibold underline ${
                            u.status === 'active'
                              ? 'text-burgundy-700 hover:text-burgundy-900'
                              : 'text-emerald-700 hover:text-emerald-900'
                          }`}
                        >
                          {u.status === 'active' ? 'Disable Account' : 'Re-enable Account'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Onboard Personnel */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 text-navy-950">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-navy-950">
                    Onboard New Personnel / Officer
                  </h3>
                  <p className="text-xs text-gray-500">
                    Issue credentials for Panacea operations staff or client bank nodal desks.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  ✕
                </button>
              </div>

              {formError && (
                <div className="mb-4 rounded-md bg-burgundy-50 p-2.5 text-xs text-burgundy-800 border border-burgundy-200 font-semibold">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">
                    Full Legal Name / Officer Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Adv. Amit Saxena or Rajiv Kumar (Nodal Lead)"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">
                    Official Corporate / Institutional Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@panaceaconsultancy.in or lead@icicibank.com"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-navy-900 mb-1">
                      Employing Entity / Bank *
                    </label>
                    <select
                      value={organizationId}
                      onChange={(e) => setOrganizationId(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none bg-white"
                    >
                      {orgs.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.legal_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-navy-900 mb-1">
                      System Role & Permissions *
                    </label>
                    <select
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none bg-white"
                    >
                      <option value="panacea_legal_recovery_user">Legal Recovery Officer</option>
                      <option value="panacea_investigation_user">Field Investigator</option>
                      <option value="operations_admin">Operations Administrator</option>
                      <option value="platform_super_admin">Director / Super Admin</option>
                      <option value="institutional_client_admin">Bank Nodal Officer (Admin)</option>
                      <option value="institutional_client_user">Bank Recovery Desk User</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-md border border-gray-200 text-[11px] text-gray-500">
                  <span className="font-semibold text-navy-950 block mb-0.5">Secure Credential Provisioning:</span>
                  A cryptographically unique temporary password will be generated upon creation. The user will be required to configure mandatory MFA upon initial authentication.
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-3.5 py-2 text-xs font-medium text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-md bg-burgundy-950 hover:bg-burgundy-900 px-4 py-2 text-xs font-bold text-gold-300 disabled:opacity-50 transition-colors shadow-sm"
                  >
                    {submitting ? 'Registering Officer...' : 'Confirm & Issue Credentials'}
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
