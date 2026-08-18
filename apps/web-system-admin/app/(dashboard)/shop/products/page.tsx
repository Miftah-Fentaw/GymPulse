'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Trash2, ImageOff, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '../../../../lib/apiClient';
import { asList } from '../../../../lib/utils';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState('');

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const qs = new URLSearchParams();
    if (categoryId) qs.set('category_id', categoryId);
    if (status) qs.set('status', status);
    const query = qs.toString() ? `?${qs.toString()}` : '';
    const [prodRes, catRes] = await Promise.all([
      apiFetch(`/admin/shop/products${query}`),
      apiFetch('/admin/shop/categories'),
    ]);
    if (prodRes.error) {
      setErrorMsg(prodRes.error);
      setProducts([]);
    } else {
      setProducts(asList(prodRes.data));
    }
    setCategories(asList(catRes.data));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [categoryId, status]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete product "${name}"? This cannot be undone.`)) return;
    const { error } = await apiFetch(`/admin/shop/products/${id}`, { method: 'DELETE' });
    if (error) alert(error);
    else load();
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((p) => (p.name || '').toLowerCase().includes(q));
  }, [products, search]);

  const activeCount = products.filter((p) => p.is_active !== false).length;
  const outOfStock = products.filter((p) => Number(p.stock) === 0).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Products</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your shop catalogue</p>
        </div>
        <a href="/shop/products/create" className="btn btn-primary h-9 text-sm">
          <Plus size={16} />
          Add Product
        </a>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Products', value: products.length, color: 'text-brand' },
          { label: 'Active', value: activeCount, color: 'text-success' },
          { label: 'Out of Stock', value: outOfStock, color: 'text-danger' },
        ].map((s) => (
          <div key={s.label} className="card py-4">
            <p className="text-xs text-slate-400 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-8 h-9 text-sm"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <select className="input h-9 w-auto text-sm py-0" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select className="input h-9 w-auto text-sm py-0" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-400 gap-2 text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading products…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">Product</th>
                  <th className="table-th">Category</th>
                  <th className="table-th">Price</th>
                  <th className="table-th">Stock</th>
                  <th className="table-th">Status</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const catName = p.product_categories?.name || '—';
                  const stock = Number(p.stock || 0);
                  return (
                    <tr key={p.id} className="hover:bg-surface/40 transition-colors">
                      <td className="table-td">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-surface border border-surface-border flex items-center justify-center shrink-0 overflow-hidden">
                            {p.images?.[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <ImageOff size={16} className="text-slate-300" />
                            )}
                          </div>
                          <p className="font-medium text-slate-800">{p.name}</p>
                        </div>
                      </td>
                      <td className="table-td">
                        <span className="badge badge-neutral">{catName}</span>
                      </td>
                      <td className="table-td font-semibold">${Number(p.price || 0).toFixed(2)}</td>
                      <td className="table-td">
                        <span className={stock === 0 ? 'text-danger font-medium' : 'text-slate-700'}>
                          {stock === 0 ? 'Out of Stock' : stock}
                        </span>
                      </td>
                      <td className="table-td">
                        <span className={`badge ${p.is_active !== false ? 'badge-success' : 'badge-neutral'}`}>
                          {p.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="table-td text-right">
                        <button
                          className="btn btn-ghost p-1.5 text-danger hover:bg-danger-light"
                          title="Delete"
                          onClick={() => handleDelete(p.id, p.name)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && !errorMsg && (
                  <tr>
                    <td colSpan={6} className="table-td text-center text-slate-400 py-10">
                      No products yet
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
