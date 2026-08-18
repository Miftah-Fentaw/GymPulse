'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Copy, Loader2, ServerCrash, X } from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';
import { asArray, formatDate, money } from '@/lib/shop';

const emptyForm = {
  id: '',
  code: '',
  discount_type: 'percentage',
  discount_value: '',
  min_order_amount: '0',
  max_uses: '',
  expires_at: '',
  is_active: true,
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [form, setForm] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await apiFetch('/admin/shop/coupons?per_page=100');
    if (error) {
      setErrorMsg(error);
      setCoupons([]);
    } else {
      setCoupons(asArray(data));
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openEdit = (c?: any) => {
    if (!c) {
      setForm({ ...emptyForm });
      return;
    }
    setForm({
      id: c.id,
      code: c.code || '',
      discount_type: c.discount_type || 'percentage',
      discount_value: c.discount_value ?? '',
      min_order_amount: c.min_order_amount ?? '0',
      max_uses: c.max_uses ?? '',
      expires_at: c.expires_at ? String(c.expires_at).slice(0, 10) : '',
      is_active: Boolean(c.is_active),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      code: form.code.trim(),
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      min_order_amount: Number(form.min_order_amount) || 0,
      max_uses: form.max_uses === '' ? undefined : Number(form.max_uses),
      expires_at: form.expires_at || undefined,
      is_active: Boolean(form.is_active),
    };
    const { error } = form.id
      ? await apiFetch(`/admin/shop/coupons/${form.id}`, { method: 'PATCH', body: JSON.stringify(payload) })
      : await apiFetch('/admin/shop/coupons', { method: 'POST', body: JSON.stringify(payload) });
    setSaving(false);
    if (error) alert(error);
    else {
      setForm(null);
      load();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    const { error, status } = await apiFetch(`/admin/shop/coupons/${id}`, { method: 'DELETE' });
    if (error) alert(status === 403 ? 'Only a super admin can delete coupons.' : error);
    else load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Coupons</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage discount codes and promotions</p>
        </div>
        <button className="btn btn-primary" onClick={() => openEdit()}><Plus size={15} /> Create Coupon</button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Active Coupons', value: coupons.filter((c) => c.is_active).length, color: 'text-success' },
          { label: 'Total Uses', value: coupons.reduce((sum, c) => sum + Number(c.times_used || 0), 0), color: 'text-brand' },
          { label: 'Total Coupons', value: coupons.length, color: 'text-gray-800' },
        ].map((s) => (
          <div key={s.label} className="card py-4">
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-xs">Loading coupons…</span>
          </div>
        ) : coupons.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-16">No coupons yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface">
                <tr>
                  <th className="th">Code</th>
                  <th className="th">Type</th>
                  <th className="th">Value</th>
                  <th className="th">Min Order</th>
                  <th className="th">Uses</th>
                  <th className="th">Expires</th>
                  <th className="th">Status</th>
                  <th className="th text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-surface/60 transition-colors">
                    <td className="td">
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-xs font-bold text-gray-800 bg-surface px-2 py-0.5 rounded-md">{c.code}</code>
                        <button className="text-gray-400 hover:text-brand" onClick={() => navigator.clipboard?.writeText(c.code)}>
                          <Copy size={12} />
                        </button>
                      </div>
                    </td>
                    <td className="td capitalize text-xs text-gray-500">{c.discount_type}</td>
                    <td className="td font-bold text-gray-800">
                      {c.discount_type === 'percentage' ? `${c.discount_value}%` : money(c.discount_value)}
                    </td>
                    <td className="td text-gray-500">{money(c.min_order_amount)}</td>
                    <td className="td text-xs text-gray-500">{c.times_used || 0}{c.max_uses != null ? `/${c.max_uses}` : ''}</td>
                    <td className="td text-xs text-gray-400">{formatDate(c.expires_at)}</td>
                    <td className="td">
                      <span className={`badge text-[10px] ${c.is_active ? 'badge-success' : 'badge-neutral'}`}>
                        {c.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="td text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="btn btn-ghost p-1.5" onClick={() => openEdit(c)}><Pencil size={13} /></button>
                        <button className="btn btn-ghost p-1.5 text-danger hover:bg-danger-light" onClick={() => handleDelete(c.id)}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {form && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="card w-full max-w-lg space-y-3 relative">
            <button type="button" className="absolute right-4 top-4 btn btn-ghost p-1.5" onClick={() => setForm(null)}><X size={16} /></button>
            <h2 className="font-semibold text-gray-700">{form.id ? 'Edit coupon' : 'Create coupon'}</h2>
            {!form.id && (
              <input className="input" placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
            )}
            <div className="grid grid-cols-2 gap-3">
              <select className="input" value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })}>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </select>
              <input type="number" step="0.01" className="input" placeholder="Value" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} required />
              <input type="number" step="0.01" className="input" placeholder="Min order" value={form.min_order_amount} onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })} />
              <input type="number" className="input" placeholder="Max uses" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} />
              <input type="date" className="input" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} />
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                Active
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn btn-outline" onClick={() => setForm(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
