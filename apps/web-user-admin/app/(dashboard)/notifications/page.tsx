'use client';

import { useEffect, useState } from 'react';
import { Bell, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch, asArray, formatDate } from '../../lib/apiClient';

export default function NotificationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [usedAnnouncements, setUsedAnnouncements] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);
      const { data, error, status } = await apiFetch('/admin/system/announcements');
      if (!error && status === 200) {
        setItems(asArray(data));
        setUsedAnnouncements(true);
      } else {
        setItems([]);
        setUsedAnnouncements(false);
        if (error && status !== 403) setErrorMsg(error);
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-ink">Notifications</h1>
        <p className="text-sm text-ink-muted mt-0.5">
          {usedAnnouncements ? 'Platform announcements' : 'No notifications API is available'}
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-ink-ghost gap-2">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-xs font-semibold">Loading…</span>
        </div>
      ) : items.length === 0 ? (
        <div className="card py-12 text-center">
          <Bell size={20} className="mx-auto text-ink-ghost mb-2" />
          <p className="text-sm font-semibold text-ink">No notifications</p>
          <p className="text-xs text-ink-muted mt-1">There are no tickets or alerts to display.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <div key={n.id} className="card flex items-start gap-4">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 bg-sheet text-ink">
                <Bell size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink">{n.title || 'Announcement'}</p>
                <p className="text-xs text-ink-muted mt-0.5">{n.message || n.body || ''}</p>
                <p className="text-[10px] text-ink-ghost mt-1">{formatDate(n.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
