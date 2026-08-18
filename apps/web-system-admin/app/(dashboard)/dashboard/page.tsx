'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  ShoppingCart,
  Package,
  FileText,
  Megaphone,
  Loader2,
  ServerCrash,
} from 'lucide-react';
import { apiFetch } from '../../../lib/apiClient';
import { asList, countValue } from '../../../lib/utils';

const statusBadge: Record<string, string> = {
  delivered: 'badge-success',
  processing: 'badge-info',
  pending: 'badge-warning',
  cancelled: 'badge-danger',
  shipped: 'badge-info',
  refunded: 'badge-neutral',
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, any>>({});
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);
      const [dash, orderRes, userRes] = await Promise.all([
        apiFetch('/admin/system/dashboard'),
        apiFetch('/admin/shop/orders?per_page=5'),
        apiFetch('/admin/users'),
      ]);
      const errs = [dash.error, orderRes.error, userRes.error].filter(Boolean);
      if (errs.length) setErrorMsg(errs[0] as string);
      if (dash.data) setStats(dash.data);
      setOrders(asList(orderRes.data).slice(0, 5));
      const userList = asList(userRes.data);
      setUsers(
        [...userList]
          .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
          .slice(0, 5)
      );
      setLoading(false);
    };
    load();
  }, []);

  const cards = [
    {
      label: 'Total Users',
      value: countValue(stats.total_users),
      icon: <Users size={20} className="text-brand" />,
      bg: 'bg-brand/10',
    },
    {
      label: 'Total Orders',
      value: countValue(stats.total_orders),
      icon: <ShoppingCart size={20} className="text-success" />,
      bg: 'bg-success/10',
    },
    {
      label: 'Products',
      value: countValue(stats.total_products),
      icon: <Package size={20} className="text-warning" />,
      bg: 'bg-warning/10',
    },
    {
      label: 'Content Posts',
      value: countValue(stats.total_content_posts),
      icon: <FileText size={20} className="text-danger" />,
      bg: 'bg-danger/10',
    },
  ];

  const contentSummary = [
    { label: 'Pending Orders', value: countValue(stats.pending_orders), icon: <ShoppingCart size={16} className="text-warning" /> },
    { label: 'Active Products', value: countValue(stats.active_products), icon: <Package size={16} className="text-success" /> },
    { label: 'Published Content', value: countValue(stats.published_content), icon: <FileText size={16} className="text-brand" /> },
    { label: 'Total Posts', value: countValue(stats.total_content_posts), icon: <Megaphone size={16} className="text-danger" /> },
  ];
  const maxContent = Math.max(...contentSummary.map((c) => c.value), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 gap-2 text-sm">
        <Loader2 size={16} className="animate-spin" /> Loading dashboard…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Live platform stats from the backend</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
              {s.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              <p className="text-2xl font-bold text-slate-800 mt-0.5">{s.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card xl:col-span-1">
          <p className="font-semibold text-slate-700 mb-4">Content Summary</p>
          <div className="space-y-3">
            {contentSummary.map((c) => (
              <div key={c.label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center shrink-0">
                  {c.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">{c.label}</span>
                    <span className="text-sm font-semibold text-slate-800">{c.value}</span>
                  </div>
                  <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand rounded-full"
                      style={{ width: `${Math.min((c.value / maxContent) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-slate-700">New Users</p>
            <a href="/users" className="text-xs text-brand hover:underline">View all</a>
          </div>
          {users.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">No users yet</p>
          ) : (
            <div className="space-y-3">
              {users.map((u) => {
                const name = u.full_name || u.email || 'Member';
                const initials = String(name)
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <div key={u.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-brand">{initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{name}</p>
                      <p className="text-xs text-slate-400 truncate">{u.email || u.id}</p>
                    </div>
                    <p className="text-[10px] text-slate-400 shrink-0">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <p className="font-semibold text-slate-700">Recent Orders</p>
          <a href="/shop/orders" className="btn btn-primary h-8 text-xs">View All</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">Order</th>
                <th className="table-th">Customer</th>
                <th className="table-th">Items</th>
                <th className="table-th">Amount</th>
                <th className="table-th">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const status = String(o.status || 'pending');
                const items = Array.isArray(o.order_items) ? o.order_items.length : 0;
                return (
                  <tr key={o.id} className="hover:bg-surface/50 transition-colors">
                    <td className="table-td font-medium text-brand font-mono text-xs">
                      {String(o.id).slice(0, 8)}
                    </td>
                    <td className="table-td text-slate-500 font-mono text-xs">
                      {o.user_id ? String(o.user_id).slice(0, 8) : '—'}
                    </td>
                    <td className="table-td text-slate-500">{items}</td>
                    <td className="table-td font-semibold">
                      ${Number(o.total_amount || 0).toFixed(2)}
                    </td>
                    <td className="table-td">
                      <span className={`badge ${statusBadge[status] || 'badge-neutral'}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="table-td text-center text-slate-400 py-10">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
