'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, ServerCrash } from 'lucide-react';
import { apiFetch, asArray, extractCount } from '../../../lib/apiClient';

export default function MemberGrowthPage() {
  const [overview, setOverview] = useState<any>(null);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);
      const [oRes, gRes] = await Promise.all([
        apiFetch('/admin/analytics/overview'),
        apiFetch('/admin/analytics/member-growth'),
      ]);
      setErrorMsg(oRes.error || gRes.error);
      setOverview(oRes.data || null);
      setMonthly(asArray(gRes.data?.monthly ?? gRes.data));
      setLoading(false);
    };
    load();
  }, []);

  const totals = useMemo(() => {
    const neu = monthly.reduce((s, d) => s + Number(d.new_members || 0), 0);
    const churn = monthly.reduce((s, d) => s + Number(d.churned || 0), 0);
    const last = monthly[monthly.length - 1] || {};
    return {
      newAll: neu,
      churnAll: churn,
      net: neu - churn,
      lastNew: Number(last.new_members || 0),
      lastChurn: Number(last.churned || 0),
    };
  }, [monthly]);

  const maxNew = Math.max(1, ...monthly.map((d) => Number(d.new_members || 0)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">Member Growth</h1>
        <p className="text-sm text-ink-muted mt-0.5">New sign-ups and churn from the analytics API</p>
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
          <span className="text-xs font-semibold">Loading growth data…</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="card">
              <p className="text-xs text-ink-muted">Total Members</p>
              <p className="text-2xl font-bold text-ink mt-1">{extractCount(overview?.total_members)}</p>
            </div>
            <div className="card">
              <p className="text-xs text-ink-muted">New (latest period)</p>
              <p className="text-2xl font-bold text-ink mt-1">{totals.lastNew}</p>
            </div>
            <div className="card">
              <p className="text-xs text-ink-muted">Churned (latest period)</p>
              <p className="text-2xl font-bold text-ink mt-1">{totals.lastChurn}</p>
            </div>
            <div className="card">
              <p className="text-xs text-ink-muted">Net (all returned periods)</p>
              <p className="text-2xl font-bold text-ink mt-1">{totals.net}</p>
            </div>
          </div>

          <div className="card">
            <p className="font-bold text-ink mb-5">New Members vs Churn</p>
            {monthly.length === 0 ? (
              <p className="text-xs text-ink-ghost py-8 text-center">No growth series returned.</p>
            ) : (
              <>
                <div className="flex items-end gap-2 h-40">
                  <div className="flex-1 flex items-end gap-1.5">
                    {monthly.map((d, i) => (
                      <div key={d.month || i} className="flex-1 flex flex-col items-center gap-0.5">
                        <div className="w-full flex items-end gap-0.5">
                          <div
                            className="flex-1 rounded-t-md bg-ink"
                            style={{ height: `${(Number(d.new_members || 0) / maxNew) * 140}px` }}
                          />
                          <div
                            className="w-1.5 rounded-t-md bg-bad"
                            style={{ height: `${(Number(d.churned || 0) / maxNew) * 140}px` }}
                          />
                        </div>
                        <span className="text-[9px] text-ink-ghost">{d.month || i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-ink-muted">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-ink inline-block" /> New Members</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-bad inline-block" /> Churned</span>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
