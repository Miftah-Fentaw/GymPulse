'use client';

import { useEffect, useState } from 'react';
import { Users, ClipboardList, Layers, Activity, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '../../../../lib/apiClient';
import { asList, countValue } from '../../../../lib/utils';

export default function UserActivityPage() {
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

  const max = Math.max(...activity.map((r) => countValue(r.count)), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 gap-2 text-sm">
        <Loader2 size={16} className="animate-spin" /> Loading activity…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">User Activity</h1>
        <p className="text-sm text-slate-500 mt-0.5">Members, bookings, and class activity from the backend</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Members', value: countValue(overview.total_members), icon: <Users size={17} className="text-brand" />, bg: 'bg-brand/10' },
          { label: 'Active Members', value: countValue(overview.active_members), icon: <Activity size={17} className="text-success" />, bg: 'bg-success/10' },
          { label: 'Total Bookings', value: countValue(overview.total_bookings), icon: <ClipboardList size={17} className="text-warning" />, bg: 'bg-warning/10' },
          { label: 'Total Classes', value: countValue(overview.total_classes), icon: <Layers size={17} className="text-purple-500" />, bg: 'bg-purple-100' },
        ].map((s) => (
          <div key={s.label} className="card flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>{s.icon}</div>
            <div>
              <p className="text-xs text-slate-400">{s.label}</p>
              <p className="text-xl font-bold text-slate-800">{s.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <p className="font-semibold text-slate-700 mb-5">Bookings by Status</p>
        {activity.length === 0 ? (
          <p className="text-sm text-slate-400 py-8 text-center">No class activity yet</p>
        ) : (
          <div className="flex items-end gap-2 h-36">
            {activity.map((h, i) => {
              const count = countValue(h.count);
              const label = h.status || `Item ${i + 1}`;
              return (
                <div key={label} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-slate-500">{count}</span>
                  <div
                    className="w-full bg-brand/70 rounded-t-md transition-all"
                    style={{ height: `${(count / max) * 110}px` }}
                  />
                  <span className="text-[9px] text-slate-400 capitalize">{label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-border">
          <p className="font-semibold text-slate-700">Status Breakdown</p>
        </div>
        {activity.length === 0 ? (
          <p className="text-sm text-slate-400 py-10 text-center">No activity yet</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">Status</th>
                <th className="table-th">Count</th>
              </tr>
            </thead>
            <tbody>
              {activity.map((w, i) => (
                <tr key={w.status || i} className="hover:bg-surface/40 transition-colors">
                  <td className="table-td font-medium text-slate-800 capitalize">{w.status || '—'}</td>
                  <td className="table-td">{countValue(w.count).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
