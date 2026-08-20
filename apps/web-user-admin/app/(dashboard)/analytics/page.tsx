'use client';

import { useEffect, useState } from 'react';
import { Users, Dumbbell, ClipboardList, ShieldCheck, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch, asArray, extractCount } from '../../../lib/apiClient';

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<any>(null);
  const [growth, setGrowth] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);
      const [oRes, gRes, aRes] = await Promise.all([
        apiFetch('/admin/analytics/overview'),
        apiFetch('/admin/analytics/member-growth'),
        apiFetch('/admin/analytics/class-activity'),
      ]);
      setErrorMsg(oRes.error || gRes.error || aRes.error);
      setOverview(oRes.data || null);
      setGrowth(asArray(gRes.data?.monthly ?? gRes.data));
      if (Array.isArray(aRes.data?.by_status)) {
        setActivity(aRes.data.by_status);
      } else {
        setActivity(asArray(aRes.data));
      }
      setLoading(false);
    };
    load();
  }, []);

  const maxVal = Math.max(1, ...growth.map((d) => Number(d.new_members || d.members || 0)));

  const kpis = [
    { label: 'Total Members', value: extractCount(overview?.total_members), icon: <Users size={18} /> },
    { label: 'Total Classes', value: extractCount(overview?.total_classes), icon: <Dumbbell size={18} /> },
    { label: 'Total Bookings', value: extractCount(overview?.total_bookings), icon: <ClipboardList size={18} /> },
    { label: 'Total Trainers', value: extractCount(overview?.total_trainers), icon: <ShieldCheck size={18} /> },
  ];

  const activityMax = Math.max(1, ...activity.map((d) => extractCount(d.count ?? d)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">Analytics</h1>
        <p className="text-sm text-ink-muted mt-0.5">Platform-wide user & class metrics from the backend</p>
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
          <span className="text-xs font-semibold">Loading analytics…</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="card flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sheet flex items-center justify-center shrink-0">
                  {kpi.icon}
                </div>
                <div>
                  <p className="text-xs text-ink-muted">{kpi.label}</p>
                  <p className="text-lg font-bold text-ink">{kpi.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <p className="font-bold text-ink">Member Growth</p>
              <div className="flex items-center gap-4 text-xs text-ink-muted">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-ink inline-block" /> New members</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sheet-border inline-block" /> Churned</span>
              </div>
            </div>
            {growth.length === 0 ? (
              <p className="text-xs text-ink-ghost py-8 text-center">No growth data returned.</p>
            ) : (
              <div className="flex gap-3 h-44">
                <div className="flex-1 flex items-end gap-1.5">
                  {growth.map((d, i) => {
                    const neu = Number(d.new_members || d.members || 0);
                    const churn = Number(d.churned || 0);
                    return (
                      <div key={d.month || i} className="flex-1 flex flex-col items-center gap-0.5">
                        <div className="w-full flex items-end gap-0.5">
                          <div
                            className="flex-1 rounded-t-md bg-ink"
                            style={{ height: `${(neu / maxVal) * 160}px` }}
                          />
                          <div
                            className="flex-1 rounded-t-md bg-sheet-border"
                            style={{ height: `${(churn / maxVal) * 160}px` }}
                          />
                        </div>
                        <span className="text-[9px] text-ink-ghost">{d.month || i + 1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <p className="font-bold text-ink mb-4">Bookings by Status</p>
            {activity.length === 0 ? (
              <p className="text-xs text-ink-ghost py-6 text-center">No class activity data returned.</p>
            ) : (
              <div className="space-y-3">
                {activity.map((d, i) => {
                  const count = extractCount(d.count ?? d);
                  const label = d.status || d.label || `Status ${i + 1}`;
                  const pct = Math.round((count / activityMax) * 100);
                  return (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-sm text-ink-muted w-24 shrink-0 capitalize">{String(label).replace('_', ' ')}</span>
                      <div className="flex-1 h-2 bg-sheet rounded-full overflow-hidden">
                        <div className="h-full bg-ink rounded-full" style={{ width: `${pct}%` }} />
                      </div>
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
