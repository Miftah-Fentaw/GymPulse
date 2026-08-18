'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Pencil, Trash2, ImageOff, Loader2, ServerCrash, X } from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';
import { asArray, categoryName, getLowStockThreshold, isLowStock, money } from '@/lib/shop';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const params = new URLSearchParams({ per_page: '100' });
    if (status) params.set('status', status);
    if (categoryId) params.set('category_id', categoryId);

    const [prodRes, catRes] = await Promise.all([
      apiFetch(`/admin/shop/products?${params.toString()}`),
      apiFetch('/admin/shop/categories'),
    ]);

    if (prodRes.error) {
      setErrorMsg(prodRes.error);
      setProducts([]);
    } else {
      setProducts(asArray(prodRes.data));
    }
    setCategories(asArray(catRes.data));
    setLoading(false);
  };

  useEffect(() => { load(); }, [status, categoryId]);

  const threshold = getLowStockThreshold();
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.description, categoryName(p)].some((v) => String(v || '').toLowerCase().includes(q))
    );
  }, [products, search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    const { error } = await apiFetch(`/admin/shop/products/${id}`, { method: 'DELETE' });
    if (error) alert(error);
    else load();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing?.id) return;
    setSaving(true);
    const { error } = await apiFetch(`/admin/shop/products/${editing.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: editing.name,
        description: editing.description || '',
        price: Number(editing.price),
        stock: Number(editing.stock),
        category_id: editing.category_id || undefined,
        images: Array.isArray(editing.images) ? editing.images : [],
        is_active: Boolean(editing.is_active),
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Products</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your shop catalogue</p>
        </div>
        <Link href="/products/create" className="btn btn-primary">
          <Plus size={15} /> Add Product
        </Link>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Products', value: products.length, color: 'text-brand' },
          { label: 'Active', value: products.filter((p) => p.is_active).length, color: 'text-success' },
          { label: 'Out of Stock', value: products.filter((p) => Number(p.stock) === 0).length, color: 'text-danger' },
          { label: 'Low Stock', value: products.filter((p) => isLowStock(Number(p.stock), threshold)).length, color: 'text-warning' },
        ].map((s) => (
          <div key={s.label} className="card py-4">
            <p className="text-xs text-gray-400 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input pl-8 h-9 text-xs"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <select className="input h-9 w-auto text-xs py-0" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select className="input h-9 w-auto text-xs py-0" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-xs">Loading products…</span>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-16">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface">
                <tr>
                  <th className="th">Product</th>
                  <th className="th">Category</th>
                  <th className="th">Price</th>
                  <th className="th">Stock</th>
                  <th className="th">Status</th>
                  <th className="th text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-surface/60 transition-colors">
                    <td className="td">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-surface border border-surface-border flex items-center justify-center shrink-0 overflow-hidden">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageOff size={14} className="text-gray-300" />
                          )}
                        </div>
                        <p className="font-semibold text-gray-800 text-xs">{p.name}</p>
                      </div>
                    </td>
                    <td className="td">
                      <span className="badge badge-neutral text-[10px]">{categoryName(p)}</span>
                    </td>
                    <td className="td font-semibold text-gray-800">{money(p.price)}</td>
                    <td className="td">
                      <span className={`font-medium text-xs ${Number(p.stock) === 0 ? 'text-danger' : isLowStock(Number(p.stock), threshold) ? 'text-warning' : 'text-gray-700'}`}>
                        {Number(p.stock) === 0 ? 'Out of stock' : p.stock}
                      </span>
                    </td>
                    <td className="td">
                      <span className={`badge text-[10px] ${p.is_active ? 'badge-success' : 'badge-neutral'}`}>
                        {p.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="td text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="btn btn-ghost p-1.5" onClick={() => setEditing({ ...p, category_id: p.category_id || '' })}>
                          <Pencil size={14} />
                        </button>
                        <button className="btn btn-ghost p-1.5 text-danger hover:bg-danger-light" onClick={() => handleDelete(p.id)}>
                          <Trash2 size={14} />
                        </button>
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
            <button type="button" className="absolute right-4 top-4 btn btn-ghost p-1.5" onClick={() => setEditing(null)}>
              <X size={16} />
            </button>
            <h2 className="font-semibold text-gray-700">Edit product</h2>
            <input className="input" value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
            <textarea className="input resize-none h-20" value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" step="0.01" className="input" value={editing.price ?? ''} onChange={(e) => setEditing({ ...editing, price: e.target.value })} required />
              <input type="number" className="input" value={editing.stock ?? 0} onChange={(e) => setEditing({ ...editing, stock: e.target.value })} />
            </div>
            <select className="input" value={editing.category_id || ''} onChange={(e) => setEditing({ ...editing, category_id: e.target.value })}>
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={Boolean(editing.is_active)} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} />
              Active
            </label>
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
