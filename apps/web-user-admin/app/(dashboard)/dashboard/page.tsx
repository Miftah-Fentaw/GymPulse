'use client';

import { useEffect, useState } from 'react';
import {
  Users, UserCheck, Dumbbell, ClipboardList, ShieldCheck,
  ArrowUpRight, Loader2, ServerCrash,
} from 'lucide-react';
import { apiFetch, asArray, extractCount, formatDate, initialsFrom } from '../../../lib/apiClient';

export default function DashboardPage() {
  const [overview, setOverview] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);
      const [oRes, bRes] = await Promise.all([
        apiFetch('/admin/analytics/overview'),
        apiFetch('/admin/bookings?per_page=10'),
      ]);
      if (oRes.error && bRes.error) {
        setErrorMsg(oRes.error);
      } else {
        setErrorMsg(oRes.error || bRes.error);
      }
      setOverview(oRes.data || null);
      setBookings(asArray(bRes.data));
      setLoading(false);
    };
    load();
  }, []);

  const stats = [
    { label: 'Total Members', value: extractCount(overview?.total_members), icon: <Users size={22} /> },
    { label: 'Active Members', value: extractCount(overview?.active_members), icon: <UserCheck size={22} /> },
    { label: 'Total Classes', value: extractCount(overview?.total_classes), icon: <Dumbbell size={22} /> },
    { label: 'Total Bookings', value: extractCount(overview?.total_bookings), icon: <ClipboardList size={22} /> },
    { label: 'Total Trainers', value: extractCount(overview?.total_trainers), icon: <ShieldCheck size={22} /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-40">
            <h2 className="text-xl font-bold text-ink">Quick Stats</h2>
            <p className="text-xs text-ink-muted mt-1 leading-snug">
              Live counts from<br />the Go backend.
            </p>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center py-8 text-ink-ghost gap-2">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-xs font-semibold">Loading overview…</span>
            </div>
          ) : (
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-3">
              {stats.map((s, i) => (
                <div key={s.label} className="stat-pill">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-1 ${i === 2 ? 'bg-ink text-white' : 'bg-sheet text-ink'}`}>
                    {s.icon}
                  </div>
                  <p className="text-lg font-bold text-ink leading-none">{s.value}</p>
                  <p className="text-[10px] text-ink-muted leading-snug mt-0.5 text-center">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          <a href="/analytics" className="shrink-0 w-8 h-8 rounded-xl bg-ink text-white flex items-center justify-center self-start mt-1 hover:bg-ink-soft transition-colors">
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="text-lg font-bold text-ink">Recent Bookings</h3>
          <a href="/bookings" className="btn btn-ink h-9 text-sm gap-1.5">
            View All <ArrowUpRight size={14} />
          </a>
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
                  <th className="th">Member</th>
                  <th className="th">Class</th>
                  <th className="th">Status</th>
                  <th className="th">Created</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-sheet/60 transition-colors">
                    <td className="td">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-sheet border border-sheet-border flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-ink">
                            {initialsFrom(b.profiles?.full_name, b.profiles?.email)}
                          </span>
                        </div>
                        <span className="font-medium text-ink">
                          {b.profiles?.full_name || b.profiles?.email || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="td text-ink-muted">{b.classes?.title || '—'}</td>
                    <td className="td">
                      <span className="badge badge-neutral text-[10px]">{b.status || '—'}</span>
                    </td>
                    <td className="td text-ink-muted text-xs">{formatDate(b.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {bookings.length === 0 && !errorMsg && (
              <p className="text-xs text-ink-ghost py-10 text-center">No recent bookings.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
