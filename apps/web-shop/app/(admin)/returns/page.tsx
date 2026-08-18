'use client';

import { useEffect, useState } from 'react';
import { Search, Eye, Loader2, ServerCrash, X } from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';
import {
  asArray, firstRecord, formatDate, labelStatus, money, RETURN_STATUSES,
  shortId, statusBadge,
} from '@/lib/shop';

export default function ReturnsPage() {
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState<any | null>(null);
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const params = new URLSearchParams({ per_page: '100' });
    if (status) params.set('status', status);
    const { data, error } = await apiFetch(`/admin/shop/returns?${params.toString()}`);
    if (error) {
      setErrorMsg(error);
      setReturns([]);
    } else {
      setReturns(asArray(data));
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [status]);

  const filtered = returns.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [r.id, r.reason, r.profiles?.full_name, r.profiles?.email].some((v) => String(v || '').toLowerCase().includes(q));
  });

  const openDetail = async (id: string) => {
    const { data, error } = await apiFetch(`/admin/shop/returns/${id}`);
    if (error) alert(error);
    else {
      const rec = firstRecord(data);
      setDetail(rec);
      setNotes(rec?.admin_notes || '');
    }
  };

  const updateStatus = async (next: string) => {
    if (!detail?.id) return;
    setUpdating(true);
    const { error } = await apiFetch(`/admin/shop/returns/${detail.id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: next, notes }),
    });
    setUpdating(false);
    if (error) alert(error);
    else {
      setDetail(null);
      load();
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Returns</h1>
        <p className="text-sm text-gray-400 mt-0.5">Review and process return requests</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Returns', value: returns.length, color: 'text-gray-800' },
          { label: 'Pending', value: returns.filter((r) => r.status === 'pending').length, color: 'text-warning' },
          { label: 'Approved', value: returns.filter((r) => r.status === 'approved').length, color: 'text-success' },
          { label: 'Rejected', value: returns.filter((r) => r.status === 'rejected').length, color: 'text-danger' },
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
            <input className="input pl-8 h-9 text-xs" placeholder="Search returns..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input h-9 w-auto text-xs py-0 ml-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {RETURN_STATUSES.map((s) => (
              <option key={s} value={s}>{labelStatus(s)}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-xs">Loading returns…</span>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-16">No returns found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface">
                <tr>
                  <th className="th">Return ID</th>
                  <th className="th">Order</th>
                  <th className="th">Customer</th>
                  <th className="th">Reason</th>
                  <th className="th">Status</th>
                  <th className="th">Date</th>
                  <th className="th text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-surface/60 transition-colors">
                    <td className="td font-mono text-xs text-brand font-semibold">{shortId(r.id)}</td>
                    <td className="td text-xs text-gray-500">{shortId(r.order_id || r.orders?.id)}</td>
                    <td className="td text-xs font-medium text-gray-800">{r.profiles?.full_name || r.profiles?.email || '—'}</td>
                    <td className="td text-xs text-gray-400">{r.reason || '—'}</td>
                    <td className="td">
                      <span className={`badge text-[10px] ${statusBadge(r.status)}`}>{labelStatus(r.status)}</span>
                    </td>
                    <td className="td text-xs text-gray-400">{formatDate(r.created_at)}</td>
                    <td className="td text-right">
                      <button className="btn btn-outline h-7 text-xs gap-1" onClick={() => openDetail(r.id)}>
                        <Eye size={12} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="card w-full max-w-lg space-y-3 relative">
            <button className="absolute right-4 top-4 btn btn-ghost p-1.5" onClick={() => setDetail(null)}><X size={16} /></button>
            <h2 className="font-semibold text-gray-700">Return {shortId(detail.id)}</h2>
            <p className="text-xs text-gray-500">{detail.reason || 'No reason provided.'}</p>
            <p className="text-xs text-gray-400">{detail.profiles?.full_name || detail.profiles?.email || '—'} · {money(detail.orders?.total_amount)}</p>
            <textarea className="input resize-none h-20" placeholder="Admin notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            <div className="flex flex-wrap gap-2">
              {RETURN_STATUSES.map((s) => (
                <button
                  key={s}
                  className={`btn h-8 text-xs ${detail.status === s ? 'btn-primary' : 'btn-outline'}`}
                  disabled={updating}
                  onClick={() => updateStatus(s)}
                >
                  {labelStatus(s)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
