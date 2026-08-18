'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch, asArray, extractCount, formatDate } from '../../../lib/apiClient';

const statusBadge: Record<string, string> = {
  confirmed: 'badge-ok',
  pending: 'badge-warn',
  checked_in: 'badge-info',
  cancelled: 'badge-bad',
  no_show: 'badge-neutral',
  refunded: 'badge-info',
};

const STATUSES = ['pending', 'confirmed', 'checked_in', 'no_show', 'cancelled', 'refunded'] as const;

function pretty(s: string) {
  return (s || '').replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function BookingsPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || '';
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const q = status ? `?status=${encodeURIComponent(status)}&per_page=100` : '?per_page=100';
    const [bRes, sRes] = await Promise.all([
      apiFetch(`/admin/bookings${q}`),
      apiFetch('/admin/bookings/stats'),
    ]);
    if (bRes.error) {
      setErrorMsg(bRes.error);
      setBookings([]);
    } else {
      setBookings(asArray(bRes.data));
    }
    if (!sRes.error && sRes.data && typeof sRes.data === 'object') {
      const next: Record<string, number> = {};
      for (const key of STATUSES) {
        next[key] = extractCount(sRes.data[key]);
      }
      setStats(next);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [status]);

  const handleStatus = async (id: string, next: string) => {
    setActionId(id);
    const { error } = await apiFetch(`/admin/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: next }),
    });
    if (error) alert(error);
    else load();
    setActionId(null);
  };

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    const member = b.profiles?.full_name || b.profiles?.email || '';
    const title = b.classes?.title || '';
    return (
      (b.id || '').toLowerCase().includes(q) ||
      member.toLowerCase().includes(q) ||
      title.toLowerCase().includes(q)
    );
  });

  const tabs = [
    { label: 'All', href: '/bookings', key: '' },
    { label: 'Pending', href: '/bookings?status=pending', key: 'pending' },
    { label: 'Confirmed', href: '/bookings?status=confirmed', key: 'confirmed' },
    { label: 'Checked In', href: '/bookings?status=checked_in', key: 'checked_in' },
    { label: 'Cancelled', href: '/bookings?status=cancelled', key: 'cancelled' },
    { label: 'No Shows', href: '/bookings?status=no_show', key: 'no_show' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-ink">Bookings</h1>
        <p className="text-sm text-ink-muted mt-0.5">All class bookings across the platform</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => {
          const active = (t.key || '') === (status || '');
          const count = t.key ? stats[t.key] : Object.values(stats).reduce((a, b) => a + b, 0);
          return (
            <Link
              key={t.label}
              href={t.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors border ${
                active
                  ? 'bg-ink text-white border-ink'
                  : 'bg-white text-ink-muted border-sheet-border hover:border-ink hover:text-ink'
              }`}
            >
              {t.label}
              {t.key && count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold ${active ? 'bg-white/20 text-white' : 'bg-sheet text-ink-muted'}`}>
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost" />
            <input
              className="input pl-8 h-9 text-sm"
              placeholder="Search bookings…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-ink-ghost gap-2">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-xs font-semibold">Loading bookings…</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-t border-sheet-border">
                  <th className="th">Booking ID</th>
                  <th className="th">Member</th>
                  <th className="th">Class</th>
                  <th className="th">Status</th>
                  <th className="th">Date & Time</th>
                  <th className="th text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-sheet/50 transition-colors">
                    <td className="td font-mono text-xs font-semibold text-ink">{b.id}</td>
                    <td className="td font-medium text-ink">
                      {b.profiles?.full_name || b.profiles?.email || '—'}
                    </td>
                    <td className="td text-ink-muted text-sm">{b.classes?.title || '—'}</td>
                    <td className="td">
                      <span className={`badge text-[10px] ${statusBadge[b.status] || 'badge-neutral'}`}>
                        {pretty(b.status)}
                      </span>
                    </td>
                    <td className="td text-ink-ghost text-xs">
                      {formatDate(b.classes?.start_time || b.created_at)}
                    </td>
                    <td className="td text-right">
                      <select
                        className="input h-8 w-auto text-xs py-0"
                        value={b.status || ''}
                        disabled={actionId === b.id}
                        onChange={(e) => handleStatus(b.id, e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{pretty(s)}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && !errorMsg && (
              <p className="text-xs text-ink-ghost py-10 text-center">No bookings found.</p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between px-5 py-4 border-t border-sheet-border">
          <p className="text-xs text-ink-muted">Showing {filtered.length} bookings</p>
        </div>
      </div>
    </div>
  );
}
