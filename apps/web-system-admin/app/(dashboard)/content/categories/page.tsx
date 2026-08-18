'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '../../../../lib/apiClient';
import { asList } from '../../../../lib/utils';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [disciplines, setDisciplines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [disciplineId, setDisciplineId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const [cats, discs] = await Promise.all([
      apiFetch('/admin/content/categories'),
      apiFetch('/admin/disciplines'),
    ]);
    if (cats.error) {
      setErrorMsg(cats.error);
      setCategories([]);
    } else {
      setCategories(asList(cats.data));
    }
    setDisciplines(asList(discs.data));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;
    setSubmitting(true);
    const { error } = await apiFetch('/admin/content/categories', {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        discipline_id: disciplineId || undefined,
      }),
    });
    setSubmitting(false);
    if (error) {
      alert(error);
      return;
    }
    setName('');
    setSlug('');
    setDescription('');
    setDisciplineId('');
    load();
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Delete category "${catName}"? This cannot be undone.`)) return;
    const { error } = await apiFetch(`/admin/content/categories/${id}`, { method: 'DELETE' });
    if (error) alert(error);
    else load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Content Categories</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage content post categories</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-400 gap-2 text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading categories…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">Name</th>
                  <th className="table-th">Slug</th>
                  <th className="table-th">Description</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-surface/40 transition-colors">
                    <td className="table-td font-medium text-slate-800">{c.name}</td>
                    <td className="table-td font-mono text-xs text-slate-400">{c.slug}</td>
                    <td className="table-td text-slate-500 text-sm">{c.description || '—'}</td>
                    <td className="table-td text-right">
                      <button
                        className="btn btn-ghost p-1.5 text-danger hover:bg-danger-light"
                        onClick={() => handleDelete(c.id, c.name)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && !errorMsg && (
                  <tr>
                    <td colSpan={4} className="table-td text-center text-slate-400 py-10">
                      No categories yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <form className="card max-w-2xl" onSubmit={handleCreate}>
        <h3 className="font-semibold text-slate-800 mb-4">Add Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Slug</label>
            <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Description</label>
            <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Discipline</label>
            <select className="input" value={disciplineId} onChange={(e) => setDisciplineId(e.target.value)}>
              <option value="">None</option>
              {disciplines.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Add Category
          </button>
        </div>
      </form>
    </div>
  );
}
