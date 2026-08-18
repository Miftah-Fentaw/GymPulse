'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Trash2, Globe, EyeOff, Dumbbell, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '../../../../lib/apiClient';
import { asList } from '../../../../lib/utils';

const diffBadge: Record<string, string> = {
  beginner: 'badge-success',
  intermediate: 'badge-warning',
  advanced: 'badge-danger',
};

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [published, setPublished] = useState('');

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const qs = new URLSearchParams();
    if (difficulty) qs.set('difficulty', difficulty);
    if (published === 'true') qs.set('published', 'true');
    const query = qs.toString() ? `?${qs.toString()}` : '';
    const { data, error } = await apiFetch(`/admin/content/workouts${query}`);
    if (error) {
      setErrorMsg(error);
      setWorkouts([]);
    } else {
      setWorkouts(asList(data));
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [difficulty, published]);

  const togglePublish = async (w: any) => {
    const path = w.is_published
      ? `/admin/content/workouts/${w.id}/unpublish`
      : `/admin/content/workouts/${w.id}/publish`;
    const { error } = await apiFetch(path, { method: 'POST' });
    if (error) alert(error);
    else load();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete workout "${title}"? This cannot be undone.`)) return;
    const { error } = await apiFetch(`/admin/content/workouts/${id}`, { method: 'DELETE' });
    if (error) alert(error);
    else load();
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return workouts.filter((w) => {
      const matchSearch = (w.title || '').toLowerCase().includes(q);
      if (published === 'false') return matchSearch && !w.is_published;
      return matchSearch;
    });
  }, [workouts, search, published]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Workouts</h1>
          <p className="text-sm text-slate-500 mt-0.5">Create and manage workout content</p>
        </div>
        <a href="/content/workouts/create" className="btn btn-primary h-9 text-sm">
          <Plus size={16} />
          Create Workout
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
          { label: 'Total', value: workouts.length, color: 'text-brand' },
          { label: 'Published', value: workouts.filter((w) => w.is_published).length, color: 'text-success' },
          { label: 'Drafts', value: workouts.filter((w) => !w.is_published).length, color: 'text-warning' },
        ].map((s) => (
          <div key={s.label} className="card py-4">
            <p className="text-xs text-slate-400">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-8 h-9 text-sm" placeholder="Search workouts..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <select className="input h-9 w-auto text-sm py-0" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <select className="input h-9 w-auto text-sm py-0" value={published} onChange={(e) => setPublished(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-400 gap-2 text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading workouts…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">Workout</th>
                  <th className="table-th">Category</th>
                  <th className="table-th">Difficulty</th>
                  <th className="table-th">Duration</th>
                  <th className="table-th">Status</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((w) => {
                  const diff = String(w.difficulty || '');
                  return (
                    <tr key={w.id} className="hover:bg-surface/40 transition-colors">
                      <td className="table-td">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                            <Dumbbell size={16} className="text-brand" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{w.title}</p>
                            <p className="text-xs text-slate-400">
                              {w.created_at ? new Date(w.created_at).toLocaleDateString() : '—'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="table-td">
                        <span className="badge badge-neutral">{w.workout_categories?.name || '—'}</span>
                      </td>
                      <td className="table-td">
                        {diff ? (
                          <span className={`badge ${diffBadge[diff] || 'badge-neutral'}`}>{diff}</span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="table-td">{w.duration_mins ? `${w.duration_mins} min` : '—'}</td>
                      <td className="table-td">
                        <span className={`badge ${w.is_published ? 'badge-success' : 'badge-neutral'}`}>
                          {w.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="table-td text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            className={`btn btn-ghost p-1.5 ${w.is_published ? 'text-warning hover:bg-warning-light' : 'text-success hover:bg-success-light'}`}
                            title={w.is_published ? 'Unpublish' : 'Publish'}
                            onClick={() => togglePublish(w)}
                          >
                            {w.is_published ? <EyeOff size={15} /> : <Globe size={15} />}
                          </button>
                          <button
                            className="btn btn-ghost p-1.5 text-danger hover:bg-danger-light"
                            title="Delete"
                            onClick={() => handleDelete(w.id, w.title)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && !errorMsg && (
                  <tr>
                    <td colSpan={6} className="table-td text-center text-slate-400 py-10">
                      No workouts yet
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
