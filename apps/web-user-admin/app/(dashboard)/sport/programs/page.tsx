'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Plus,
  Search,
  CheckCircle,
  Calendar,
  Dumbbell,
  Loader2,
  ServerCrash,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { apiFetch } from '../../../../lib/apiClient';

export default function SportProgramsPage() {
  const { activeDiscipline } = useAuth();
  const searchParams = useSearchParams();
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationWeeks, setDurationWeeks] = useState(6);
  const [difficulty, setDifficulty] = useState('intermediate');

  const fetchPrograms = async () => {
    setLoading(true);
    setErrorMsg(null);
    const endpoint = activeDiscipline?.id
      ? `/admin/content/programs?discipline_id=${activeDiscipline.id}`
      : '/admin/content/programs';

    const { data, error } = await apiFetch(endpoint);
    if (error) {
      setErrorMsg(error);
      setPrograms([]);
    } else {
      setPrograms(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrograms();
  }, [activeDiscipline?.id]);

  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setShowCreateModal(true);
    }
  }, [searchParams]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setIsSubmitting(true);
    const payload = {
      title,
      description,
      duration_weeks: durationWeeks,
      difficulty,
      discipline_id: activeDiscipline?.id,
      is_published: true,
    };

    const { error } = await apiFetch('/admin/content/programs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (error) {
      alert(`Error creating training program via Go backend: ${error}`);
    } else {
      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      fetchPrograms();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this program? This cannot be undone.')) return;
    setActionId(id);
    const { error } = await apiFetch(`/admin/content/programs/${id}`, { method: 'DELETE' });
    if (error) alert(error);
    else fetchPrograms();
    setActionId(null);
  };

  const handleTogglePublish = async (p: any) => {
    setActionId(p.id);
    const path = p.is_published ? 'unpublish' : 'publish';
    const { error } = await apiFetch(`/admin/content/programs/${p.id}/${path}`, { method: 'POST' });
    if (error) alert(error);
    else fetchPrograms();
    setActionId(null);
  };

  const filteredPrograms = programs.filter((p) =>
    (p.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{activeDiscipline?.icon || '🥊'}</span>
            <h1 className="text-xl font-bold text-ink">
              {activeDiscipline?.name || 'Sport'} Training Programs
            </h1>
          </div>
          <p className="text-xs text-ink-muted mt-0.5">
            Multi-week structured conditioning programs served exclusively from the Go backend.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-ink h-9 text-xs gap-1.5 shrink-0"
        >
          <Plus size={15} /> Create Program
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 flex-shrink-0 text-red-500" />
          <div>
            <p className="font-bold">Backend API Unreachable</p>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost" />
          <input
            type="text"
            placeholder="Search programs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-8 h-9 w-full text-xs"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-ink-ghost gap-2">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-xs font-semibold">Loading training programs from Go Backend…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPrograms.map((p) => (
            <div key={p.id} className="card hover:border-ink/20 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="badge badge-neutral text-[10px]">
                    {activeDiscipline?.name || 'Program'}
                  </span>
                  <span className="badge badge-ink text-[10px]">{p.duration_weeks || 6} Weeks</span>
                </div>

                <h3 className="text-base font-bold text-ink">{p.title}</h3>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  {p.description || 'No description provided.'}
                </p>

                <div className="flex items-center gap-4 mt-4 text-xs text-ink-ghost font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} /> {p.duration_weeks || 6} Weeks Duration
                  </span>
                  <span className="flex items-center gap-1">
                    <Dumbbell size={13} /> {p.program_workouts?.length || 0} Workouts Scheduled
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-sheet-border flex items-center justify-between gap-2">
                <span className={`flex items-center gap-1 text-[10px] font-bold ${p.is_published ? 'text-emerald-600' : 'text-ink-muted'}`}>
                  <CheckCircle size={12} /> {p.is_published ? 'Published' : 'Draft'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleTogglePublish(p)}
                    disabled={actionId === p.id}
                    className="btn btn-outline h-7 text-[10px]"
                  >
                    {actionId === p.id ? <Loader2 size={12} className="animate-spin" /> : p.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={actionId === p.id}
                    className="btn btn-ghost p-1.5 text-bad hover:bg-bad-light"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredPrograms.length === 0 && !errorMsg && (
            <div className="col-span-full py-12 text-center text-ink-ghost text-xs">
              No training programs found for this discipline in the Go backend database.
            </div>
          )}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-card border border-sheet-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-ink">New {activeDiscipline?.name} Program</h3>
              <button onClick={() => setShowCreateModal(false)} className="btn btn-ghost p-1 text-ink-ghost">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-ink-muted block mb-1">Program Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 6-Week Championship Boxing Conditioning"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input w-full text-xs"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-muted block mb-1">Description</label>
                <textarea
                  placeholder="Overview of training goals & weekly commitment…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input w-full text-xs p-2.5"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-ink-muted block mb-1">Duration (Weeks)</label>
                  <input
                    type="number"
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(Number(e.target.value))}
                    className="input w-full text-xs"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-muted block mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="input w-full text-xs"
                    disabled={isSubmitting}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-sheet-border">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-ghost text-xs"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-ink text-xs flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    'Create via Backend'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
