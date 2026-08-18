'use client';

import { useEffect, useState } from 'react';
import { Search, Truck, Pencil, Loader2, ServerCrash, X } from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';
import {
  asArray, firstRecord, formatDate, labelStatus, money, SHIPMENT_STATUSES,
  shortId, statusBadge,
} from '@/lib/shop';

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const params = new URLSearchParams({ per_page: '100' });
    if (status) params.set('status', status);
    const { data, error } = await apiFetch(`/admin/shop/shipments?${params.toString()}`);
    if (error) {
      setErrorMsg(error);
      setShipments([]);
    } else {
      setShipments(asArray(data));
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [status]);

  const filtered = shipments.filter((s) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [s.id, s.tracking_number, s.carrier, s.order_id, s.orders?.id].some((v) => String(v || '').toLowerCase().includes(q));
  });

  const openEdit = async (id: string) => {
    const { data, error } = await apiFetch(`/admin/shop/shipments/${id}`);
    if (error) alert(error);
    else {
      const rec = firstRecord(data);
      setEditing({
        ...rec,
        tracking_number: rec?.tracking_number || '',
        carrier: rec?.carrier || '',
        status: rec?.status || 'pending',
        estimated_delivery_at: rec?.estimated_delivery_at ? String(rec.estimated_delivery_at).slice(0, 10) : '',
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.id) return;
    setSaving(true);
    const { error } = await apiFetch(`/admin/shop/shipments/${editing.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        tracking_number: editing.tracking_number,
        carrier: editing.carrier,
        status: editing.status,
        estimated_delivery_at: editing.estimated_delivery_at || undefined,
      }),
    });
    setSaving(false);
    if (error) alert(error);
    else {
      setEditing(null);
      load();
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-light flex items-center justify-center">
          <Truck size={20} className="text-teal" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Shipments</h1>
          <p className="text-sm text-gray-400 mt-0.5">Track outgoing shipments</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Shipments', value: shipments.length, color: 'text-gray-800' },
          { label: 'In Transit', value: shipments.filter((s) => s.status === 'in_transit').length, color: 'text-info' },
          { label: 'Delivered', value: shipments.filter((s) => s.status === 'delivered').length, color: 'text-success' },
          { label: 'Failed', value: shipments.filter((s) => s.status === 'failed').length, color: 'text-danger' },
        ].map((s) => (
          <div key={s.label} className="card py-4">
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-8 h-9 text-xs" placeholder="Search by tracking, order..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input h-9 w-auto text-xs py-0 ml-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {SHIPMENT_STATUSES.map((s) => (
              <option key={s} value={s}>{labelStatus(s)}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-xs">Loading shipments…</span>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-16">No shipments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface">
                <tr>
                  <th className="th">Shipment</th>
                  <th className="th">Order</th>
                  <th className="th">Carrier</th>
                  <th className="th">Tracking</th>
                  <th className="th">Status</th>
                  <th className="th">ETA</th>
                  <th className="th text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-surface/60 transition-colors">
                    <td className="td font-mono text-xs font-semibold text-brand">{shortId(s.id)}</td>
                    <td className="td text-xs text-gray-500">{shortId(s.order_id || s.orders?.id)}</td>
                    <td className="td text-xs text-gray-600">{s.carrier || '—'}</td>
                    <td className="td font-mono text-[11px] text-gray-400">{s.tracking_number || '—'}</td>
                    <td className="td">
                      <span className={`badge text-[10px] ${statusBadge(s.status)}`}>{labelStatus(s.status)}</span>
                    </td>
                    <td className="td text-xs text-gray-400">{formatDate(s.estimated_delivery_at)}</td>
                    <td className="td text-right">
                      <button className="btn btn-outline h-7 text-xs gap-1" onClick={() => openEdit(s.id)}>
                        <Pencil size={12} /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="card w-full max-w-lg space-y-3 relative">
            <button type="button" className="absolute right-4 top-4 btn btn-ghost p-1.5" onClick={() => setEditing(null)}><X size={16} /></button>
            <h2 className="font-semibold text-gray-700">Shipment {shortId(editing.id)}</h2>
            {editing.orders?.total_amount != null && (
              <p className="text-xs text-gray-400">Order {shortId(editing.orders.id)} · {money(editing.orders.total_amount)}</p>
            )}
            <input className="input" placeholder="Tracking number" value={editing.tracking_number} onChange={(e) => setEditing({ ...editing, tracking_number: e.target.value })} />
            <input className="input" placeholder="Carrier" value={editing.carrier} onChange={(e) => setEditing({ ...editing, carrier: e.target.value })} />
            <select className="input" value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
              {SHIPMENT_STATUSES.map((s) => (
                <option key={s} value={s}>{labelStatus(s)}</option>
              ))}
            </select>
            <input type="date" className="input" value={editing.estimated_delivery_at} onChange={(e) => setEditing({ ...editing, estimated_delivery_at: e.target.value })} />
            <div className="flex justify-end gap-2">
              <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
