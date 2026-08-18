'use client';

import { useEffect, useMemo, useState } from 'react';
import { ShoppingCart, DollarSign, TrendingUp, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';
import { asArray, money } from '@/lib/shop';

export default function SalesReportPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [revenueHint, setRevenueHint] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [ordersRes, productsRes, revenueRes] = await Promise.all([
        apiFetch('/admin/shop/orders?per_page=100'),
        apiFetch('/admin/shop/products?per_page=100'),
        apiFetch('/admin/analytics/revenue'),
      ]);
      if (ordersRes.error && productsRes.error) setErrorMsg(ordersRes.error);
      const orderList = asArray(ordersRes.data);
      setOrders(orderList);
      setProducts(asArray(productsRes.data));
      if (revenueRes.status === 200 && revenueRes.data) {
        const revOrders = asArray((revenueRes.data as any).orders);
        setRevenueHint(revOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0));
      }
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    const delivered = orders.filter((o) => o.status === 'delivered');
    const revenue = revenueHint != null
      ? revenueHint
      : delivered.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    const avg = delivered.length ? revenue / delivered.length : 0;
    const productNames = new Map(products.map((p) => [p.id, p.name]));
    const byProduct = new Map<string, { name: string; revenue: number; orders: number }>();
    for (const o of delivered) {
      for (const item of o.order_items || []) {
        const id = item.product_id || 'unknown';
        const current = byProduct.get(id) || { name: productNames.get(id) || id, revenue: 0, orders: 0 };
        current.revenue += Number(item.unit_price || 0) * Number(item.quantity || 0);
        current.orders += Number(item.quantity || 0);
        byProduct.set(id, current);
      }
    }
    const top = Array.from(byProduct.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 8);
    const monthly = new Map<string, number>();
    for (const o of delivered) {
      if (!o.created_at) continue;
      const key = new Date(o.created_at).toLocaleString(undefined, { month: 'short', year: '2-digit' });
      monthly.set(key, (monthly.get(key) || 0) + Number(o.total_amount || 0));
    }
    const monthRows = Array.from(monthly.entries());
    return { revenue, avg, top, monthRows, deliveredCount: delivered.length };
  }, [orders, products, revenueHint]);

  const maxMonth = Math.max(1, ...stats.monthRows.map(([, v]) => v));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Loading sales report…</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Sales Report</h1>
        <p className="text-sm text-gray-400 mt-0.5">Totals computed from delivered orders</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Delivered Revenue', value: money(stats.revenue), icon: <DollarSign size={18} className="text-brand" />, bg: 'bg-brand/10' },
          { label: 'Total Orders', value: String(orders.length), icon: <ShoppingCart size={18} className="text-success" />, bg: 'bg-success/10' },
          { label: 'Avg Delivered Order', value: money(stats.avg), icon: <TrendingUp size={18} className="text-warning" />, bg: 'bg-warning/10' },
        ].map((s) => (
          <div key={s.label} className="card flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>{s.icon}</div>
            <div>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-lg font-bold text-gray-800">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <p className="font-semibold text-gray-700 mb-5">Monthly delivered revenue</p>
        {stats.monthRows.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">No delivered orders to chart.</p>
        ) : (
          <div className="flex items-end gap-2 h-36">
            {stats.monthRows.map(([month, value]) => (
              <div key={month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-full rounded-t-lg bg-brand/70" style={{ height: `${(value / maxMonth) * 100}%` }} title={money(value)} />
                <span className="text-[9px] text-gray-400">{month}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-border">
          <p className="font-semibold text-sm text-gray-700">Top Products by Revenue</p>
        </div>
        {stats.top.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12">No delivered line items yet.</p>
        ) : (
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                <th className="th">Product</th>
                <th className="th">Revenue</th>
                <th className="th">Units</th>
              </tr>
            </thead>
            <tbody>
              {stats.top.map((p) => (
                <tr key={p.name} className="hover:bg-surface/60 transition-colors">
                  <td className="td font-medium text-xs text-gray-800">{p.name}</td>
                  <td className="td font-bold text-gray-800">{money(p.revenue)}</td>
                  <td className="td text-gray-500">{p.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
