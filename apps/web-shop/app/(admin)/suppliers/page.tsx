'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Pencil, Trash2, Loader2, ServerCrash, X } from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';
import { asArray } from '@/lib/shop';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const params = new URLSearchParams({ per_page: '100' });
    if (category) params.set('category', category);
    const { data, error } = await apiFetch(`/admin/shop/suppliers?${params.toString()}`);
    if (error) {
      setErrorMsg(error);
      setSuppliers([]);
    } else {
      setSuppliers(asArray(data));
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [category]);

  const categories = Array.from(new Set(suppliers.map((s) => s.category).filter(Boolean)));
  const filtered = suppliers.filter((s) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [s.name, s.contact_name, s.email, s.category].some((v) => String(v || '').toLowerCase().includes(q));
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.id) return;
    setSaving(true);
    const { error } = await apiFetch(`/admin/shop/suppliers/${editing.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: editing.name,
        contact_name: editing.contact_name,
        email: editing.email,
        phone: editing.phone,
        category: editing.category,
        address: editing.address,
        status: editing.status,
      }),
    });
    setSaving(false);
    if (error) alert(error);
    else {
      setEditing(null);
      load();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this supplier?')) return;
    const { error, status } = await apiFetch(`/admin/shop/suppliers/${id}`, { method: 'DELETE' });
    if (error) alert(status === 403 ? 'Only a super admin can delete suppliers.' : error);
    else load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Suppliers</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your product suppliers</p>
        </div>
        <Link href="/suppliers/create" className="btn btn-primary"><Plus size={15} /> Add Supplier</Link>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-8 h-9 text-xs" placeholder="Search suppliers..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input h-9 w-auto text-xs py-0 ml-auto" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-xs">Loading suppliers…</span>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-16">No suppliers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface">
                <tr>
                  <th className="th">Supplier</th>
                  <th className="th">Contact</th>
                  <th className="th">Category</th>
                  <th className="th">Status</th>
                  <th className="th text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-surface/60 transition-colors">
                    <td className="td">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-brand">
                            {String(s.name || '').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <p className="font-semibold text-xs text-gray-800">{s.name}</p>
                      </div>
                    </td>
                    <td className="td">
                      <p className="text-xs font-medium text-gray-700">{s.contact_name || '—'}</p>
                      <p className="text-[10px] text-gray-400">{s.email || s.phone || ''}</p>
                    </td>
                    <td className="td"><span className="badge badge-neutral text-[10px]">{s.category || '—'}</span></td>
                    <td className="td">
                      <span className={`badge text-[10px] ${s.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                        {s.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="td text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="btn btn-ghost p-1.5" onClick={() => setEditing({ ...s })}><Pencil size={13} /></button>
                        <button className="btn btn-ghost p-1.5 text-danger hover:bg-danger-light" onClick={() => handleDelete(s.id)}><Trash2 size={13} /></button>
                      </div>
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
            <h2 className="font-semibold text-gray-700">Edit supplier</h2>
            <input className="input" value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
            <div className="grid grid-cols-2 gap-3">
              <input className="input" placeholder="Contact name" value={editing.contact_name || ''} onChange={(e) => setEditing({ ...editing, contact_name: e.target.value })} />
              <input className="input" placeholder="Email" value={editing.email || ''} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
              <input className="input" placeholder="Phone" value={editing.phone || ''} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} />
              <input className="input" placeholder="Category" value={editing.category || ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
            </div>
            <input className="input" placeholder="Address" value={editing.address || ''} onChange={(e) => setEditing({ ...editing, address: e.target.value })} />
            <select className="input" value={editing.status || 'active'} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
