'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Layers, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';
import { asArray, slugify } from '@/lib/shop';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await apiFetch('/admin/shop/categories');
    if (error) {
      setErrorMsg(error);
      setCategories([]);
    } else {
      setCategories(asArray(data));
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    const { error } = await apiFetch('/admin/shop/categories', {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(),
        slug: (slug || slugify(name)).trim(),
        description: description.trim(),
      }),
    });
    setSaving(false);
    if (error) alert(error);
    else {
      setName('');
      setSlug('');
      setDescription('');
      load();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    const { error } = await apiFetch(`/admin/shop/categories/${id}`, { method: 'DELETE' });
    if (error) alert(error);
    else load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Categories</h1>
          <p className="text-sm text-gray-400 mt-0.5">Organise your products into categories</p>
        </div>
        <Link href="/categories/create" className="btn btn-primary">
          <Plus size={15} /> Add Category
        </Link>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-xs">Loading categories…</span>
        </div>
      ) : categories.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No categories yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map((c) => (
            <div key={c.id} className="card text-center">
              <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center mx-auto mb-2">
                <Layers size={18} className="text-brand" />
              </div>
              <p className="font-semibold text-sm text-gray-800">{c.name}</p>
              <p className="text-xs text-gray-400 mt-0.5 font-mono">{c.slug}</p>
            </div>
          ))}
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-border">
          <p className="font-semibold text-sm text-gray-700">All Categories</p>
        </div>
        {!loading && categories.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12">No categories found.</p>
        ) : (
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                <th className="th">Name</th>
                <th className="th">Slug</th>
                <th className="th">Description</th>
                <th className="th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-surface/60 transition-colors">
                  <td className="td font-semibold text-gray-800 text-xs">{c.name}</td>
                  <td className="td font-mono text-[11px] text-gray-400">{c.slug}</td>
                  <td className="td text-xs text-gray-500">{c.description || '—'}</td>
                  <td className="td text-right">
                    <button className="btn btn-ghost p-1.5 text-danger hover:bg-danger-light" onClick={() => handleDelete(c.id)}>
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <form onSubmit={handleCreate} className="card max-w-md space-y-3">
        <h3 className="font-semibold text-sm text-gray-700">Quick Add Category</h3>
        <input
          className="input"
          placeholder="Category name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slug || slug === slugify(name)) setSlug(slugify(e.target.value));
          }}
        />
        <input className="input" placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <input className="input" placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-outline" onClick={() => { setName(''); setSlug(''); setDescription(''); }}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Creating…' : 'Create'}</button>
        </div>
      </form>
    </div>
  );
}
