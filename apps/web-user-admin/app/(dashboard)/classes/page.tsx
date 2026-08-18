'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Trash2, Loader2, ServerCrash, Ban } from 'lucide-react';
import { apiFetch, asArray, formatDate } from '../../../lib/apiClient';

const diffBadge: Record<string, string> = {
  beginner: 'badge-ok',
  intermediate: 'badge-warn',
  advanced: 'badge-bad',
  all_levels: 'badge-neutral',
};
const statusBadge: Record<string, string> = {
  active: 'badge-ok',
  full: 'badge-ink',
  cancelled: 'badge-bad',
  scheduled: 'badge-info',
};

function trainerName(c: any) {
  return c.trainers?.profiles?.full_name || c.trainer_name || 'Unassigned';
}

function disciplineName(c: any) {
  return c.disciplines?.name || c.discipline_name || '—';
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [disciplineFilter, setDisciplineFilter] = useState('all');
  const [actionId, setActionId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await apiFetch('/admin/classes?per_page=100');
    if (error) {
      setErrorMsg(error);
      setClasses([]);
    } else {
      setClasses(asArray(data));
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this class? This cannot be undone.')) return;
    setActionId(id);
    const { error } = await apiFetch(`/admin/classes/${id}`, { method: 'DELETE' });
    if (error) alert(error);
    else load();
    setActionId(null);
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this class?')) return;
    setActionId(id);
    const { error } = await apiFetch(`/admin/classes/${id}/cancel`, { method: 'POST' });
    if (error) alert(error);
    else load();
    setActionId(null);
  };

  const disciplines = useMemo(() => {
    const names = new Set<string>();
    classes.forEach((c) => {
      const n = disciplineName(c);
      if (n && n !== '—') names.add(n);
    });
    return Array.from(names);
  }, [classes]);

  const filtered = classes.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (c.title || '').toLowerCase().includes(q) ||
      trainerName(c).toLowerCase().includes(q);
    const matchesDisc = disciplineFilter === 'all' || disciplineName(c) === disciplineFilter;
    return matchesSearch && matchesDisc;
  });

  const activeCount = classes.filter((c) => c.status === 'active').length;
  const cancelledCount = classes.filter((c) => c.status === 'cancelled').length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Classes</h1>
          <p className="text-sm text-ink-muted mt-0.5">Manage all fitness classes</p>
        </div>
        <a href="/classes/create" className="btn btn-ink">
          <Plus size={15} /> Add Class
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="card">
          <p className="text-2xl font-bold text-ink">{classes.length}</p>
          <p className="text-xs text-ink-muted mt-0.5">Total Classes</p>
        </div>
        <div className="card">
          <p className="text-2xl font-bold text-ink">{activeCount}</p>
          <p className="text-xs text-ink-muted mt-0.5">Active</p>
        </div>
        <div className="card">
          <p className="text-2xl font-bold text-ink">{cancelledCount}</p>
          <p className="text-xs text-ink-muted mt-0.5">Cancelled</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost" />
            <input
              className="input pl-8 h-9 text-sm"
              placeholder="Search classes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <select
              className="input h-9 w-auto text-sm py-0"
              value={disciplineFilter}
              onChange={(e) => setDisciplineFilter(e.target.value)}
            >
              <option value="all">All Disciplines</option>
              {disciplines.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-ink-ghost gap-2">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-xs font-semibold">Loading classes…</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-t border-sheet-border">
                  <th className="th">Class</th>
                  <th className="th">Trainer</th>
                  <th className="th">Difficulty</th>
                  <th className="th">Capacity</th>
                  <th className="th">Price</th>
                  <th className="th">Schedule</th>
                  <th className="th">Status</th>
                  <th className="th text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-sheet/50 transition-colors">
                    <td className="td">
                      <p className="font-semibold text-ink">{c.title}</p>
                      <p className="text-xs text-ink-ghost">{disciplineName(c)}</p>
                    </td>
                    <td className="td text-ink-muted text-sm">{trainerName(c)}</td>
                    <td className="td">
                      <span className={`badge text-[10px] ${diffBadge[c.difficulty_level] || 'badge-neutral'}`}>
                        {(c.difficulty_level || '—').replace('_', ' ')}
                      </span>
                    </td>
                    <td className="td text-sm text-ink">{c.max_participants ?? '—'}</td>
                    <td className="td font-semibold text-ink">
                      {!c.price ? 'Free' : `$${c.price}`}
                    </td>
                    <td className="td text-ink-muted text-xs">{formatDate(c.start_time)}</td>
                    <td className="td">
                      <span className={`badge text-[10px] ${statusBadge[c.status] || 'badge-neutral'}`}>
                        {c.status || '—'}
                      </span>
                    </td>
                    <td className="td text-right">
                      <div className="flex items-center justify-end gap-1">
                        {c.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancel(c.id)}
                            disabled={actionId === c.id}
                            className="btn btn-ghost p-1.5 text-warn hover:bg-warn-light"
                            title="Cancel class"
                          >
                            <Ban size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(c.id)}
                          disabled={actionId === c.id}
                          className="btn btn-ghost p-1.5 text-bad hover:bg-bad-light"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && !errorMsg && (
              <p className="text-xs text-ink-ghost py-10 text-center">No classes found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
