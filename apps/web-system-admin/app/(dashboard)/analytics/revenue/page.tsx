'use client';

import { useEffect, useMemo, useState } from 'react';
import { DollarSign, ShoppingCart, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '../../../../lib/apiClient';
import { asList } from '../../../../lib/utils';

export default function RevenueAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);
      const { data, error } = await apiFetch('/admin/analytics/revenue');
      if (error) {
        setErrorMsg(error);
        setOrders([]);
      } else {
        setOrders(asList(data?.orders ?? data));
      }
      setLoading(false);
    };
    load();
  }, []);

  const monthly = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of orders) {
      if (!o.created_at) continue;
      const d = new Date(o.created_at);
      if (Number.isNaN(d.getTime())) continue;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      map.set(key, (map.get(key) || 0) + Number(o.total_amount || 0));
    }
    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, total]) => ({ month, total }));
  }, [orders]);

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const avgOrder = orders.length ? totalRevenue / orders.length : 0;
  const maxMonth = Math.max(...monthly.map((m) => m.total), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 gap-2 text-sm">
        <Loader2 size={16} className="animate-spin" /> Loading revenue…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Revenue Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">Computed from delivered shop orders</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: <DollarSign size={17} />, bg: 'bg-brand/10 text-brand' },
          { label: 'Delivered Orders', value: String(orders.length), icon: <ShoppingCart size={17} />, bg: 'bg-success/10 text-success' },
          { label: 'Avg Order Value', value: `$${avgOrder.toFixed(2)}`, icon: <DollarSign size={17} />, bg: 'bg-warning/10 text-warning' },
        ].map((s) => (
          <div key={s.label} className="card flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>{s.icon}</div>
            <div>
              <p className="text-xs text-slate-400">{s.label}</p>
              <p className="text-lg font-bold text-slate-800">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <p className="font-semibold text-slate-700 mb-5">Monthly Revenue</p>
        {monthly.length === 0 ? (
          <p className="text-sm text-slate-400 py-8 text-center">No revenue yet</p>
        ) : (
          <div className="flex items-end gap-3 h-44">
            {monthly.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-slate-500">${d.total.toFixed(0)}</span>
                <div
                  className="w-full bg-brand rounded-t-md"
                  style={{ height: `${(d.total / maxMonth) * 140}px` }}
                />
                <span className="text-[9px] text-slate-400">{d.month}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-border">
          <p className="font-semibold text-slate-700">Recent Delivered Orders</p>
        </div>
        {orders.length === 0 ? (
          <p className="text-sm text-slate-400 py-10 text-center">No orders yet</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">Amount</th>
                <th className="table-th">Date</th>
              </tr>
            </thead>
            <tbody>
              {[...orders].reverse().slice(0, 20).map((o, i) => (
                <tr key={o.id || i} className="hover:bg-surface/40 transition-colors">
                  <td className="table-td font-bold">${Number(o.total_amount || 0).toFixed(2)}</td>
                  <td className="table-td text-slate-400">
                    {o.created_at ? new Date(o.created_at).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
