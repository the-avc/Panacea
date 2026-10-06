'use client';

import React, { useEffect, useState } from 'react';
import { PortalLayout } from '../../../components/PortalLayout';
import { apiFetch } from '../../../lib/api';

export default function AdminSecurityEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    const res = await apiFetch<any>('/admin/security-events');
    if (res.data) {
      setEvents(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleResolveEvent = async (id: string) => {
    if (confirm('Mark this security incident as reviewed and resolved?')) {
      await apiFetch(`/admin/security-events/${id}/resolve`, { method: 'POST' });
      fetchEvents();
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-950">
            Security Incidents & Anomaly Monitoring
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Real-time threat detection, failed login lockout tracking, and operational security incident logs.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-navy-950">
              Security Incident Center ({events.length})
            </h2>
            <button
              type="button"
              onClick={fetchEvents}
              className="text-xs font-semibold text-navy-900 hover:underline"
            >
              Refresh Incidents
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
              <thead className="bg-gray-50/75">
                <tr>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-gray-600">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-gray-600">
                    Severity
                  </th>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-gray-600">
                    Incident Type
                  </th>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-gray-600">
                    Source IP
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
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400">Loading security incidents...</td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400 italic">No security incidents detected. System normal.</td>
                  </tr>
                ) : (
                  events.map((evt) => (
                    <tr key={evt.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-3.5 text-gray-500 font-mono text-[11px]">
                        {new Date(evt.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            evt.severity === 'critical'
                              ? 'bg-burgundy-100 text-burgundy-900 border border-burgundy-300'
                              : evt.severity === 'high'
                              ? 'bg-burgundy-50 text-burgundy-800 border border-burgundy-200'
                              : evt.severity === 'medium'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}
                        >
                          {evt.severity}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-bold text-navy-950">{evt.event_type}</td>
                      <td className="px-6 py-3.5 font-mono text-[11px] text-gray-600">{evt.source_ip || '127.0.0.1'}</td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold ${
                            evt.resolved_at
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {evt.resolved_at ? 'RESOLVED' : 'ACTIVE INVESTIGATION'}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        {!evt.resolved_at && (
                          <button
                            type="button"
                            onClick={() => handleResolveEvent(evt.id)}
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline"
                          >
                            Mark Resolved
                          </button>
                        )}
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
