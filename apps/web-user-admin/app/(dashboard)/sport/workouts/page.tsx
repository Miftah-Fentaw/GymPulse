'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Dumbbell,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Loader2,
  ServerCrash,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { apiFetch } from '../../../../lib/apiClient';

export default function SportWorkoutsPage() {
  const { activeDiscipline } = useAuth();
  const searchParams = useSearchParams();
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMins, setDurationMins] = useState(45);
  const [difficulty, setDifficulty] = useState('intermediate');

  const fetchWorkouts = async () => {
    setLoading(true);
    setErrorMsg(null);
    const endpoint = activeDiscipline?.id
      ? `/admin/content/workouts?discipline_id=${activeDiscipline.id}`
      : '/admin/content/workouts';

    const { data, error } = await apiFetch(endpoint);
    if (error) {
      setErrorMsg(error);
      setWorkouts([]);
    } else {
      setWorkouts(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkouts();
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
      duration_mins: durationMins,
      difficulty,
      discipline_id: activeDiscipline?.id,
      is_published: true,
    };

    const { error } = await apiFetch('/admin/content/workouts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (error) {
      alert(`Error creating workout via Go backend: ${error}`);
    } else {
      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      fetchWorkouts();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this workout? This cannot be undone.')) return;
    setActionId(id);
    const { error } = await apiFetch(`/admin/content/workouts/${id}`, { method: 'DELETE' });
    if (error) alert(error);
    else fetchWorkouts();
    setActionId(null);
  };

  const handleTogglePublish = async (w: any) => {
    setActionId(w.id);
    const path = w.is_published ? 'unpublish' : 'publish';
    const { error } = await apiFetch(`/admin/content/workouts/${w.id}/${path}`, { method: 'POST' });
    if (error) alert(error);
    else fetchWorkouts();
    setActionId(null);
  };

  const filteredWorkouts = workouts.filter((w) =>
    (w.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (w.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{activeDiscipline?.icon || '🥊'}</span>
            <h1 className="text-xl font-bold text-ink">
              {activeDiscipline?.name || 'Sport'} Workouts & Drills
            </h1>
          </div>
          <p className="text-xs text-ink-muted mt-0.5">
            Manage workouts strictly processed and served via the Go Backend API.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-ink h-9 text-xs gap-1.5 shrink-0"
        >
          <Plus size={15} /> Add Workout
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
            placeholder="Search workouts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-8 h-9 w-full text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-ink-muted">
            Total: <strong>{filteredWorkouts.length}</strong>
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-ink-ghost gap-2">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-xs font-semibold">Loading workouts from Go Backend…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkouts.map((w) => (
            <div key={w.id} className="card flex flex-col justify-between hover:border-ink/20 transition-all">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="badge badge-neutral text-[10px]">
                    {w.workout_categories?.name || activeDiscipline?.name || 'Workout'}
                  </span>
                  <span
                    className={`badge text-[10px] ${
                      w.difficulty === 'beginner'
                        ? 'badge-ok'
                        : w.difficulty === 'intermediate'
                        ? 'badge-warn'
                        : 'badge-bad'
                    }`}
                  >
                    {(w.difficulty || 'intermediate').toUpperCase()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-ink leading-tight">{w.title}</h3>
                <p className="text-xs text-ink-muted mt-1 line-clamp-2 leading-relaxed">
                  {w.description || 'No description provided.'}
                </p>

                <div className="flex items-center gap-4 mt-4 text-xs text-ink-ghost font-medium">
                  <span className="flex items-center gap-1">
                    <Clock size={13} /> {w.duration_mins || 30} mins
                  </span>
                  <span className="flex items-center gap-1">
                    <Dumbbell size={13} /> {w.workout_exercises?.length || 0} exercises
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-sheet-border flex items-center justify-between gap-2">
                <span className={`flex items-center gap-1 text-[10px] font-bold ${w.is_published ? 'text-emerald-600' : 'text-ink-muted'}`}>
                  <CheckCircle size={12} /> {w.is_published ? 'Published' : 'Draft'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleTogglePublish(w)}
                    disabled={actionId === w.id}
                    className="btn btn-outline h-7 text-[10px]"
                  >
                    {actionId === w.id ? <Loader2 size={12} className="animate-spin" /> : w.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleDelete(w.id)}
                    disabled={actionId === w.id}
                    className="btn btn-ghost p-1.5 text-bad hover:bg-bad-light"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredWorkouts.length === 0 && !errorMsg && (
            <div className="col-span-full py-12 text-center text-ink-ghost text-xs">
              No workouts found for this discipline in the Go backend database.
            </div>
          )}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-card border border-sheet-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-ink">New {activeDiscipline?.name} Workout</h3>
              <button onClick={() => setShowCreateModal(false)} className="btn btn-ghost p-1 text-ink-ghost">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-ink-muted block mb-1">Workout Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 6-Round Heavy Bag Power Combination"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input w-full text-xs"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-muted block mb-1">Description</label>
                <textarea
                  placeholder="Brief description of the workout routine…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input w-full text-xs p-2.5"
                  rows={2}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-ink-muted block mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={durationMins}
                    onChange={(e) => setDurationMins(Number(e.target.value))}
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
