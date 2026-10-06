'use client';

import React, { useEffect, useState } from 'react';
import { PortalLayout } from '../../../components/PortalLayout';
import { apiFetch } from '../../../lib/api';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async () => {
    setLoading(true);
    const res = await apiFetch<any>(`/admin/audit-logs?page=${page}&pageSize=20`);
    if (res.data?.items) {
      setLogs(res.data.items);
      setTotalPages(res.data.pagination?.totalPages || 1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-950">
            Immutable Audit Trail Explorer
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Chronological cryptographic log of all administrative, authentication, and document events across the platform.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-navy-950">Audit Records</h2>
            <button
              type="button"
              onClick={fetchLogs}
              className="text-xs font-semibold text-navy-900 hover:underline"
            >
              Refresh Logs
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
                    Event Type
                  </th>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-gray-600">
                    Action / Resource
                  </th>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-gray-600">
                    Result
                  </th>
                  <th className="px-6 py-3 font-semibold uppercase tracking-wider text-gray-600 font-mono">
                    Correlation Request ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">Loading audit trail...</td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400 italic">No audit events recorded.</td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-3.5 text-gray-500 font-mono text-[11px]">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5 font-bold text-navy-950">
                        {log.event_type}
                      </td>
                      <td className="px-6 py-3.5 text-gray-700">
                        <span className="font-medium">{log.action}</span> ·{' '}
                        <span className="text-gray-500">{log.resource_type}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            log.result === 'success'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : log.result === 'denied'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-burgundy-50 text-burgundy-800 border border-burgundy-200'
                          }`}
                        >
                          {log.result}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[10px] text-gray-400">
                        {log.request_id}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded border border-gray-200 px-3 py-1 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="rounded border border-gray-200 px-3 py-1 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
