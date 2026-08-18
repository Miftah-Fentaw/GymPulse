'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Globe, EyeOff, Layers, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '../../../../lib/apiClient';
import { asList } from '../../../../lib/utils';

const diffBadge: Record<string, string> = {
  beginner: 'badge-success',
  intermediate: 'badge-warning',
  advanced: 'badge-danger',
};

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await apiFetch('/admin/content/programs');
    if (error) {
      setErrorMsg(error);
      setPrograms([]);
    } else {
      setPrograms(asList(data));
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const togglePublish = async (p: any) => {
    const path = p.is_published
      ? `/admin/content/programs/${p.id}/unpublish`
      : `/admin/content/programs/${p.id}/publish`;
    const { error } = await apiFetch(path, { method: 'POST' });
    if (error) alert(error);
    else load();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete program "${title}"? This cannot be undone.`)) return;
    const { error } = await apiFetch(`/admin/content/programs/${id}`, { method: 'DELETE' });
    if (error) alert(error);
    else load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Programs</h1>
          <p className="text-sm text-slate-500 mt-0.5">Multi-week fitness programs for users</p>
        </div>
        <a href="/content/programs/create" className="btn btn-primary h-9 text-sm">
          <Plus size={16} />
          Create Program
        </a>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-400 gap-2 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading programs…
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((p) => {
            const diff = String(p.difficulty || '');
            return (
              <div key={p.id} className="card hover:border-brand transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                    <Layers size={18} className="text-brand" />
                  </div>
                  <span className={`badge ${p.is_published ? 'badge-success' : 'badge-neutral'}`}>
                    {p.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">{p.title}</h3>
                <p className="text-xs text-slate-400 mb-3">
                  {p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  {diff && <span className={`badge ${diffBadge[diff] || 'badge-neutral'}`}>{diff}</span>}
                  {p.duration_weeks != null && <span>{p.duration_weeks} weeks</span>}
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-surface-border">
                  <button
                    className={`btn h-8 text-xs flex-1 ${p.is_published ? 'btn-outline text-warning' : 'btn-primary'}`}
                    onClick={() => togglePublish(p)}
                  >
                    {p.is_published ? <EyeOff size={13} /> : <Globe size={13} />}
                    {p.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    className="btn btn-ghost h-8 text-xs text-danger hover:bg-danger-light"
                    onClick={() => handleDelete(p.id, p.title)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
          <a href="/content/programs/create" className="card border-dashed flex flex-col items-center justify-center gap-2 hover:border-brand hover:bg-brand/5 transition-all cursor-pointer min-h-[180px]">
            <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center">
              <Plus size={20} className="text-slate-400" />
            </div>
            <p className="text-sm text-slate-400 font-medium">Create New Program</p>
          </a>
          {programs.length === 0 && !errorMsg && (
            <div className="card col-span-full text-center py-8 text-slate-400 text-sm">
              No programs yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}
