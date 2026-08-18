'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '../../../../../lib/apiClient';
import { asList } from '../../../../../lib/utils';

export default function CreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [categoryId, setCategoryId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    apiFetch('/admin/shop/categories').then(({ data, error }) => {
      if (error) setErrorMsg(error);
      else setCategories(asList(data));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const parsedPrice = Number(price);
    if (!name.trim() || parsedPrice <= 0) {
      setErrorMsg('Name and a price greater than 0 are required.');
      return;
    }
    setSubmitting(true);
    const { error } = await apiFetch('/admin/shop/products', {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
        stock: Number(stock) || 0,
        category_id: categoryId || undefined,
        images: [],
        is_active: isActive,
      }),
    });
    setSubmitting(false);
    if (error) {
      setErrorMsg(error);
      return;
    }
    router.push('/shop/products');
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <a href="/shop/products" className="btn btn-ghost p-2"><ArrowLeft size={18} /></a>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Add Product</h1>
          <p className="text-sm text-slate-500 mt-0.5">Add a new product to the shop catalogue</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-4">
          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-700 text-sm">Product Information</h2>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Product Name</label>
              <input className="input" placeholder="Product name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Description</label>
              <textarea className="input resize-none h-24" placeholder="Product description…" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Category</label>
              <select className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-700 text-sm">Pricing & Inventory</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Price ($)</label>
                <input type="number" step="0.01" min="0" className="input" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Quantity in Stock</label>
                <input type="number" min="0" className="input" placeholder="0" value={stock} onChange={(e) => setStock(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card space-y-3">
            <h2 className="font-semibold text-slate-700 text-sm">Settings</h2>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Status</label>
              <select className="input" value={isActive ? 'active' : 'inactive'} onChange={(e) => setIsActive(e.target.value === 'active')}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <a href="/shop/products" className="btn btn-outline flex-1">Discard</a>
            <button type="submit" className="btn btn-primary flex-1" disabled={submitting}>
              {submitting ? <Loader2 size={14} className="animate-spin" /> : 'Save Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
