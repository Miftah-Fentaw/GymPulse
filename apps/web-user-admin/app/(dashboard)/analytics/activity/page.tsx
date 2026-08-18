'use client';

import { useEffect, useState } from 'react';
import { Activity, ClipboardList, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch, asArray, extractCount } from '../../../lib/apiClient';

export default function ClassActivityPage() {
  const [overview, setOverview] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);
      const [oRes, aRes] = await Promise.all([
        apiFetch('/admin/analytics/overview'),
        apiFetch('/admin/analytics/class-activity'),
      ]);
      setErrorMsg(oRes.error || aRes.error);
      setOverview(oRes.data || null);
      if (Array.isArray(aRes.data?.by_status)) {
        setActivity(aRes.data.by_status);
      } else {
        setActivity(asArray(aRes.data));
      }
      setLoading(false);
    };
    load();
  }, []);

  const max = Math.max(1, ...activity.map((d) => extractCount(d.count ?? d)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">Class Activity</h1>
        <p className="text-sm text-ink-muted mt-0.5">Booking status breakdown from the analytics API</p>
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
          <span className="text-xs font-semibold">Loading class activity…</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="card flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sheet flex items-center justify-center shrink-0">
                <ClipboardList size={17} />
              </div>
              <div>
                <p className="text-xs text-ink-muted">Total Bookings</p>
                <p className="text-xl font-bold text-ink">{extractCount(overview?.total_bookings)}</p>
              </div>
            </div>
            <div className="card flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sheet flex items-center justify-center shrink-0">
                <Activity size={17} />
              </div>
              <div>
                <p className="text-xs text-ink-muted">Total Classes</p>
                <p className="text-xl font-bold text-ink">{extractCount(overview?.total_classes)}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <p className="font-bold text-ink mb-4">Bookings by Status</p>
            {activity.length === 0 ? (
              <p className="text-xs text-ink-ghost py-8 text-center">No activity data returned.</p>
            ) : (
              <div className="space-y-3">
                {activity.map((d, i) => {
                  const count = extractCount(d.count ?? d);
                  const label = d.status || d.label || `Status ${i + 1}`;
                  const pct = Math.round((count / max) * 100);
                  return (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-sm text-ink-muted w-24 shrink-0 capitalize">{String(label).replace('_', ' ')}</span>
                      <div className="flex-1 h-2 bg-sheet rounded-full overflow-hidden">
                        <div className="h-full bg-ink rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-bold text-ink w-8 text-right">{pct}%</span>
                      <span className="text-xs text-ink-ghost w-12 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
