'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '../../../lib/apiClient';
import { asList } from '../../../lib/utils';

export default function DisciplinesPage() {
  const [disciplines, setDisciplines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [icon, setIcon] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await apiFetch('/admin/system/disciplines');
    if (error) {
      setErrorMsg(error);
      setDisciplines([]);
    } else {
      setDisciplines(asList(data));
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;
    setSubmitting(true);
    const { error } = await apiFetch('/admin/system/disciplines', {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        color,
        icon,
        is_active: true,
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
    setColor('#3B82F6');
    setIcon('');
    load();
  };

  const handleDelete = async (id: string, dName: string) => {
    if (!confirm(`Delete discipline "${dName}"? This cannot be undone.`)) return;
    const { error } = await apiFetch(`/admin/system/disciplines/${id}`, { method: 'DELETE' });
    if (error) alert(error);
    else load();
  };

  const toggleActive = async (d: any) => {
    const { error } = await apiFetch(`/admin/system/disciplines/${d.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: !d.is_active }),
    });
    if (error) alert(error);
    else load();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Disciplines</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage sport disciplines used to categorise classes and workouts</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-400 gap-2 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading disciplines…
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {disciplines.map((d) => {
              const c = d.color || '#3B82F6';
              return (
                <div key={d.id} className="card text-center p-4">
                  <div
                    className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center"
                    style={{ background: `${c}20` }}
                  >
                    <span className="text-lg font-black" style={{ color: c }}>
                      {(d.name || '?')[0]}
                    </span>
                  </div>
                  <p className="font-semibold text-sm text-slate-800">{d.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{d.slug}</p>
                  <span className={`badge mt-2 text-[10px] ${d.is_active !== false ? 'badge-success' : 'badge-neutral'}`}>
                    {d.is_active !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="card p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-surface-border">
              <p className="font-semibold text-sm text-slate-700">All Disciplines</p>
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">Name</th>
                  <th className="table-th">Slug</th>
                  <th className="table-th">Color</th>
                  <th className="table-th">Status</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {disciplines.map((d) => (
                  <tr key={d.id} className="hover:bg-surface/40 transition-colors">
                    <td className="table-td font-semibold text-slate-800">{d.name}</td>
                    <td className="table-td font-mono text-xs text-slate-400">{d.slug}</td>
                    <td className="table-td">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md border border-surface-border inline-block" style={{ background: d.color || '#ccc' }} />
                        <span className="text-xs font-mono text-slate-500">{d.color || '—'}</span>
                      </div>
                    </td>
                    <td className="table-td">
                      <button
                        type="button"
                        className={`badge text-[10px] ${d.is_active !== false ? 'badge-success' : 'badge-neutral'}`}
                        onClick={() => toggleActive(d)}
                      >
                        {d.is_active !== false ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="table-td text-right">
                      <button
                        className="btn btn-ghost p-1.5 text-danger hover:bg-danger/10"
                        onClick={() => handleDelete(d.id, d.name)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {disciplines.length === 0 && !errorMsg && (
                  <tr>
                    <td colSpan={5} className="table-td text-center text-slate-400 py-10">
                      No disciplines yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <form className="card max-w-lg" onSubmit={handleCreate}>
        <h3 className="font-semibold text-slate-700 text-sm mb-3">Add Discipline</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Slug</label>
            <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-slate-500 mb-1 block">Description</label>
            <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Color Hex</label>
            <input className="input" value={color} onChange={(e) => setColor(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Icon</label>
            <input className="input" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="optional" />
          </div>
          <div className="col-span-2 flex justify-end">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Create
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
