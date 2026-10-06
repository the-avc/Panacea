'use client';

import React, { useEffect, useState } from 'react';
import { PortalLayout } from '../../components/PortalLayout';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../lib/api';

export default function ProfilePage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchSessions = async () => {
    setLoadingSessions(true);
    const res = await apiFetch<any>('/auth/sessions');
    if (res.data) {
      setSessions(res.data);
    }
    setLoadingSessions(false);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    const res = await apiFetch<any>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify({ displayName }),
    });

    setSaving(false);
    if (res.data) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    if (confirm('Revoke this active session immediately? The device will be logged out.')) {
      await apiFetch(`/auth/sessions/${sessionId}/revoke`, { method: 'POST' });
      fetchSessions();
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-950">
            Profile & Session Security
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Manage your institutional identity, view concurrent logins, and revoke remote sessions.
          </p>
        </div>

        {/* Identity Details */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-base font-bold text-navy-950 border-b border-gray-100 pb-3 mb-4">
            Authorized Account Profile
          </h2>

          {savedSuccess && (
            <div className="mb-4 rounded bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800 font-semibold">
              Profile details updated successfully.
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500 font-mono cursor-not-allowed"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Managed by your principal financial institution.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
              <div>
                <span className="text-gray-500 block text-[11px]">Empaneled Organization:</span>
                <span className="font-semibold text-navy-950">{user?.organization?.legalName || 'None'}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[11px]">Security Role:</span>
                <span className="font-semibold text-navy-950 capitalize">{user?.role?.name?.replace(/_/g, ' ') || 'None'}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-navy-950 hover:bg-navy-900 px-4 py-2 text-xs font-semibold text-white transition-colors disabled:opacity-50"
              >
                {saving ? 'Updating...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Active Sessions & Eviction */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="font-display text-base font-bold text-navy-950">
                Active Concurrent Sessions
              </h2>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Revoke any unrecognized sessions immediately to protect institutional data.
              </p>
            </div>
            <button
              type="button"
              onClick={fetchSessions}
              className="text-xs font-semibold text-navy-900 hover:underline"
            >
              Refresh Sessions
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {loadingSessions ? (
              <div className="p-6 text-center text-xs text-gray-400">Loading active sessions...</div>
            ) : sessions.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 italic">No active sessions found.</div>
            ) : (
              sessions.map((s) => (
                <div key={s.id} className="py-4 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-navy-950 font-mono">
                        {s.deviceMetadata?.ip || '127.0.0.1'}
                      </span>
                      {s.isCurrent && (
                        <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          Current Device
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      User Agent: {s.deviceMetadata?.userAgent || 'Browser Session'}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      Created: {new Date(s.createdAt).toLocaleString()} · Expires: {new Date(s.expiresAt).toLocaleString()}
                    </div>
                  </div>

                  {!s.isCurrent && (
                    <button
                      type="button"
                      onClick={() => handleRevokeSession(s.id)}
                      className="rounded bg-burgundy-50 hover:bg-burgundy-100 text-burgundy-800 border border-burgundy-200 px-3 py-1.5 text-xs font-semibold transition-colors"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
