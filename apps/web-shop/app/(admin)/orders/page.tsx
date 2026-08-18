'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Eye, Loader2, ServerCrash, X } from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';
import {
  asArray, firstRecord, formatDate, labelStatus, money, ORDER_STATUSES,
  shortId, statusBadge,
} from '@/lib/shop';

const statusTabs = [
  { label: 'All', href: '/orders', status: '' },
  { label: 'Pending', href: '/orders?status=pending', status: 'pending' },
  { label: 'Processing', href: '/orders?status=processing', status: 'processing' },
  { label: 'Shipped', href: '/orders?status=shipped', status: 'shipped' },
  { label: 'Delivered', href: '/orders?status=delivered', status: 'delivered' },
  { label: 'Cancelled', href: '/orders?status=cancelled', status: 'cancelled' },
  { label: 'Refunded', href: '/orders?status=refunded', status: 'refunded' },
];

function OrdersInner() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || '';
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const params = new URLSearchParams({ page: String(page), per_page: '50' });
    if (status) params.set('status', status);
    const { data, error } = await apiFetch(`/admin/shop/orders?${params.toString()}`);
    if (error) {
      setErrorMsg(error);
      setOrders([]);
    } else {
      setOrders(asArray(data));
    }
    setLoading(false);
  };

  useEffect(() => { setPage(1); }, [status]);
  useEffect(() => { load(); }, [status, page]);

  const filtered = orders.filter((o) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [o.id, o.status, o.notes].some((v) => String(v || '').toLowerCase().includes(q));
  });

  const openDetail = async (id: string) => {
    setDetailLoading(true);
    const { data, error } = await apiFetch(`/admin/shop/orders/${id}`);
    setDetailLoading(false);
    if (error) alert(error);
    else setDetail(firstRecord(data));
  };

  const updateStatus = async (id: string, next: string) => {
    setUpdating(true);
    const { error } = await apiFetch(`/admin/shop/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: next }),
    });
    setUpdating(false);
    if (error) alert(error);
    else {
      setDetail((d: any) => (d ? { ...d, status: next } : d));
      load();
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Orders</h1>
        <p className="text-sm text-gray-400 mt-0.5">Track and manage all customer orders</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {statusTabs.map((t) => {
          const active = t.status === status;
          return (
            <Link
              key={t.label}
              href={t.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors border ${
                active
                  ? 'bg-brand text-white border-brand'
                  : 'bg-white text-gray-500 border-surface-border hover:border-brand hover:text-brand'
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input pl-8 h-9 text-xs"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-xs">Loading orders…</span>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-16">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface">
                <tr>
                  <th className="th">Order ID</th>
                  <th className="th">Items</th>
                  <th className="th">Total</th>
                  <th className="th">Status</th>
                  <th className="th">Date</th>
                  <th className="th text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => {
                  const items = Array.isArray(o.order_items) ? o.order_items : [];
                  const qty = items.reduce((sum: number, i: any) => sum + Number(i.quantity || 0), 0);
                  return (
                    <tr key={o.id} className="hover:bg-surface/60 transition-colors">
                      <td className="td font-mono text-xs text-brand font-semibold">{shortId(o.id)}</td>
                      <td className="td text-gray-500">{qty} item{qty === 1 ? '' : 's'}</td>
                      <td className="td font-bold text-gray-800">{money(o.total_amount)}</td>
                      <td className="td">
                        <span className={`badge text-[10px] ${statusBadge(o.status)}`}>{labelStatus(o.status)}</span>
                      </td>
                      <td className="td text-gray-400 text-xs">{formatDate(o.created_at)}</td>
                      <td className="td text-right">
                        <button className="btn btn-outline h-7 text-xs gap-1" onClick={() => openDetail(o.id)}>
                          <Eye size={12} /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between px-5 py-4 border-t border-surface-border">
          <p className="text-xs text-gray-400">Page {page} · {filtered.length} orders</p>
          <div className="flex items-center gap-1">
            <button className="btn btn-outline h-8 text-xs" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
            <button className="btn btn-outline h-8 text-xs" disabled={orders.length < 50} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </div>
      </div>

      {(detail || detailLoading) && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="card w-full max-w-lg space-y-3 relative max-h-[90vh] overflow-y-auto">
            <button className="absolute right-4 top-4 btn btn-ghost p-1.5" onClick={() => setDetail(null)}>
              <X size={16} />
            </button>
            {detailLoading || !detail ? (
              <div className="flex items-center justify-center py-10 text-gray-400 gap-2">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs">Loading order…</span>
              </div>
            ) : (
              <>
                <h2 className="font-semibold text-gray-700">Order {shortId(detail.id)}</h2>
                <p className="text-xs text-gray-400">{formatDate(detail.created_at)} · {money(detail.total_amount)}</p>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Status</label>
                  <select
                    className="input"
                    value={detail.status}
                    disabled={updating}
                    onChange={(e) => updateStatus(detail.id, e.target.value)}
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>{labelStatus(s)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  {(detail.order_items || []).map((item: any) => (
                    <div key={item.id || item.product_id} className="flex justify-between text-xs">
                      <span className="text-gray-700">{item.products?.name || shortId(item.product_id)}</span>
                      <span className="text-gray-500">{item.quantity} × {money(item.unit_price)}</span>
                    </div>
                  ))}
                  {(!detail.order_items || detail.order_items.length === 0) && (
                    <p className="text-xs text-gray-400">No line items.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Loading orders…</span>
      </div>
    }>
      <OrdersInner />
    </Suspense>
  );
}
