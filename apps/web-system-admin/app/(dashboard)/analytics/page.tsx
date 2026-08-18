'use client';

import { useEffect, useState } from 'react';
import { Users, ClipboardList, Layers, Activity, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '../../../lib/apiClient';
import { asList, countValue } from '../../../lib/utils';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [overview, setOverview] = useState<any>({});
  const [activity, setActivity] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);
      const [ov, act] = await Promise.all([
        apiFetch('/admin/analytics/overview'),
        apiFetch('/admin/analytics/class-activity'),
      ]);
      if (ov.error) setErrorMsg(ov.error);
      else setOverview(ov.data || {});

      if (!act.error && act.data) {
        const rows = Array.isArray(act.data?.by_status)
          ? act.data.by_status
          : asList(act.data);
        setActivity(rows);
      }
      setLoading(false);
    };
    load();
  }, []);

  const kpis = [
    { label: 'Total Members', value: countValue(overview.total_members), icon: <Users size={18} className="text-brand" />, bg: 'bg-brand/10' },
    { label: 'Active Members', value: countValue(overview.active_members), icon: <Activity size={18} className="text-success" />, bg: 'bg-success/10' },
    { label: 'Total Bookings', value: countValue(overview.total_bookings), icon: <ClipboardList size={18} className="text-warning" />, bg: 'bg-warning/10' },
    { label: 'Total Classes', value: countValue(overview.total_classes), icon: <Layers size={18} className="text-purple-500" />, bg: 'bg-purple-100' },
    { label: 'Total Trainers', value: countValue(overview.total_trainers), icon: <Users size={18} className="text-danger" />, bg: 'bg-danger/10' },
  ];

  const maxActivity = Math.max(...activity.map((r) => countValue(r.count)), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 gap-2 text-sm">
        <Loader2 size={16} className="animate-spin" /> Loading analytics…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Platform Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">Live counts from the backend</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="card flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${kpi.bg}`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-xs text-slate-400">{kpi.label}</p>
              <p className="text-lg font-bold text-slate-800">{kpi.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <p className="font-semibold text-slate-700 mb-4">Class Activity by Status</p>
        {activity.length === 0 ? (
          <p className="text-sm text-slate-400 py-8 text-center">No class activity yet</p>
        ) : (
          <div className="space-y-3">
            {activity.map((s, i) => {
              const count = countValue(s.count);
              const label = s.status || s.label || `Status ${i + 1}`;
              return (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-24 shrink-0 capitalize">{label}</span>
                  <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${(count / maxActivity) * 100}%` }} />
                  </div>
                  <span className="text-xs font-medium text-slate-700 w-12 text-right">{count.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
