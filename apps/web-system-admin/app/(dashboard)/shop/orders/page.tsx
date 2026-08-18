'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '../../../../lib/apiClient';
import { asList } from '../../../../lib/utils';

const statusBadge: Record<string, string> = {
  delivered: 'badge-success',
  processing: 'badge-info',
  pending: 'badge-warning',
  cancelled: 'badge-danger',
  shipped: 'badge-info',
  refunded: 'badge-neutral',
};

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

function OrdersPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const statusFilter = searchParams.get('status') || '';
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const qs = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : '';
    const { data, error } = await apiFetch(`/admin/shop/orders${qs}`);
    if (error) {
      setErrorMsg(error);
      setOrders([]);
    } else {
      setOrders(asList(data));
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const handleStatus = async (id: string, status: string) => {
    const { error } = await apiFetch(`/admin/shop/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    if (error) alert(error);
    else load();
  };

  const setFilter = (status: string) => {
    router.push(status ? `/shop/orders?status=${status}` : '/shop/orders');
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter(
      (o) =>
        String(o.id || '').toLowerCase().includes(q) ||
        String(o.user_id || '').toLowerCase().includes(q) ||
        String(o.status || '').toLowerCase().includes(q)
    );
  }, [orders, search]);

  const counts = useMemo(() => {
    const all = orders.length;
    const byStatus: Record<string, number> = {};
    for (const s of STATUSES) byStatus[s] = orders.filter((o) => o.status === s).length;
    return { all, ...byStatus };
  }, [orders]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Orders</h1>
        <p className="text-sm text-slate-500 mt-0.5">All customer orders across the platform</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Loaded', value: counts.all, key: '' },
          { label: 'Pending', value: counts.pending, key: 'pending' },
          { label: 'Processing', value: counts.processing, key: 'processing' },
          { label: 'Delivered', value: counts.delivered, key: 'delivered' },
        ].map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => setFilter(s.key)}
            className={`card py-4 text-center cursor-pointer hover:border-brand transition-colors ${statusFilter === s.key ? 'border-brand' : ''}`}
          >
            <p className="text-xs text-slate-400">{s.label}</p>
            <p className="text-xl font-bold mt-1 text-slate-800">{s.value}</p>
          </button>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-8 h-9 text-sm"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input h-9 w-auto text-sm py-0 ml-auto"
            value={statusFilter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-400 gap-2 text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading orders…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">Order ID</th>
                  <th className="table-th">Customer</th>
                  <th className="table-th">Items</th>
                  <th className="table-th">Total</th>
                  <th className="table-th">Status</th>
                  <th className="table-th">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => {
                  const status = String(o.status || 'pending');
                  const items = Array.isArray(o.order_items) ? o.order_items.length : 0;
                  return (
                    <tr key={o.id} className="hover:bg-surface/40 transition-colors">
                      <td className="table-td font-medium text-brand font-mono text-xs">{String(o.id).slice(0, 8)}</td>
                      <td className="table-td font-mono text-xs text-slate-500">{o.user_id ? String(o.user_id).slice(0, 8) : '—'}</td>
                      <td className="table-td text-slate-500">{items}</td>
                      <td className="table-td font-semibold">${Number(o.total_amount || 0).toFixed(2)}</td>
                      <td className="table-td">
                        <select
                          className={`badge ${statusBadge[status] || 'badge-neutral'} border-0 cursor-pointer bg-transparent`}
                          value={status}
                          onChange={(e) => handleStatus(o.id, e.target.value)}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="table-td text-slate-400">
                        {o.created_at ? new Date(o.created_at).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && !errorMsg && (
                  <tr>
                    <td colSpan={6} className="table-td text-center text-slate-400 py-10">
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12 text-slate-400 gap-2 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading orders…
        </div>
      }
    >
      <OrdersPageInner />
    </Suspense>
  );
}
