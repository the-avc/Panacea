'use client';

import React, { useEffect, useState } from 'react';
import { PortalLayout } from '../../components/PortalLayout';
import { apiFetch } from '../../lib/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    setLoading(true);
    const res = await apiFetch<any>('/notifications');
    if (res.data) {
      setNotifications(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
    fetchNotifs();
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-950">
            Institutional Notifications & Alerts
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Real-time status updates, statutory order acquisitions, and possession scheduling alerts.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-navy-950">Alerts Feed</h2>
            <span className="text-xs text-gray-500">{notifications.length} Total Alerts</span>
          </div>

          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-8 text-center text-xs text-gray-400">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 italic">
                No active notifications found for your profile.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-6 flex items-start justify-between gap-4 transition-colors ${
                    n.read_at ? 'bg-white opacity-70' : 'bg-navy-50/20'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-navy-800" />
                      <h4 className="font-bold text-navy-950 text-xs">{n.title}</h4>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {new Date(n.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed pl-4">{n.body}</p>
                  </div>

                  {!n.read_at && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(n.id)}
                      className="text-[11px] font-semibold text-navy-900 hover:text-burgundy-700 underline shrink-0"
                    >
                      Mark as read
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
