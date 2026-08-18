'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';
import { asArray } from '@/lib/shop';

export default function CreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '0',
    category_id: '',
    images: '',
    is_active: true,
  });

  useEffect(() => {
    (async () => {
      setLoadingCats(true);
      const { data, error } = await apiFetch('/admin/shop/categories');
      if (error) setErrorMsg(error);
      setCategories(asArray(data));
      setLoadingCats(false);
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    const images = form.images.split(',').map((s) => s.trim()).filter(Boolean);
    const { error } = await apiFetch('/admin/shop/products', {
      method: 'POST',
      body: JSON.stringify({
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        category_id: form.category_id || undefined,
        images,
        is_active: form.is_active,
      }),
    });
    setSaving(false);
    if (error) setErrorMsg(error);
    else router.push('/products');
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/products" className="btn btn-ghost p-2">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Add Product</h1>
          <p className="text-sm text-gray-400 mt-0.5">Fill in the details to add a new product</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-4">
          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-700 text-sm">Product Information</h2>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Product Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
              <textarea className="input resize-none h-24" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Category</label>
              {loadingCats ? (
                <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
                  <Loader2 size={14} className="animate-spin" /> Loading categories…
                </div>
              ) : (
                <select className="input" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-700 text-sm">Pricing & Stock</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Price ($)</label>
                <input type="number" step="0.01" min="0" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Quantity in Stock</label>
                <input type="number" min="0" className="input" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <h2 className="font-semibold text-gray-700 text-sm mb-3">Image URLs</h2>
            <textarea
              className="input resize-none h-24"
              placeholder="Comma-separated image URLs"
              value={form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
            />
          </div>
          <div className="card space-y-3">
            <h2 className="font-semibold text-gray-700 text-sm">Status</h2>
            <select className="input" value={form.is_active ? 'active' : 'inactive'} onChange={(e) => setForm({ ...form, is_active: e.target.value === 'active' })}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Link href="/products" className="btn btn-outline flex-1">Discard</Link>
            <button type="submit" className="btn btn-primary flex-1" disabled={saving}>
              {saving ? 'Saving…' : 'Save Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
