'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ServerCrash } from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';
import { slugify } from '@/lib/shop';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    const { error } = await apiFetch('/admin/shop/categories', {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(),
        slug: (slug || slugify(name)).trim(),
        description: description.trim(),
      }),
    });
    setSaving(false);
    if (error) setErrorMsg(error);
    else router.push('/categories');
  };

  return (
    <div className="space-y-5 max-w-md">
      <div className="flex items-center gap-3">
        <Link href="/categories" className="btn btn-ghost p-2"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Add Category</h1>
          <p className="text-sm text-gray-400 mt-0.5">Create a new product category</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Category Name</label>
          <input
            className="input"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slug || slug === slugify(name)) setSlug(slugify(e.target.value));
            }}
            required
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Slug</label>
          <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          <p className="text-[11px] text-gray-400 mt-1">Used in URLs — lowercase, no spaces.</p>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
          <textarea className="input resize-none h-20" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Link href="/categories" className="btn btn-outline">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Creating…' : 'Create Category'}</button>
        </div>
      </form>
    </div>
  );
}
