'use client';

import { useEffect, useState } from 'react';
import { Dumbbell, Loader2, Plus, ServerCrash, Trash2 } from 'lucide-react';
import { apiFetch } from '../../../../lib/apiClient';
import { asList } from '../../../../lib/utils';

export default function ExercisesPage() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [workoutId, setWorkoutId] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [durationSec, setDurationSec] = useState('');
  const [restSec, setRestSec] = useState('30');
  const [order, setOrder] = useState('1');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadWorkouts = async () => {
      setLoading(true);
      setErrorMsg(null);
      const { data, error } = await apiFetch('/admin/content/workouts');
      if (error) {
        setErrorMsg(error);
        setWorkouts([]);
      } else {
        const list = asList(data);
        setWorkouts(list);
        if (list[0]?.id) setWorkoutId(list[0].id);
      }
      setLoading(false);
    };
    loadWorkouts();
  }, []);

  const loadExercises = async (id: string) => {
    if (!id) {
      setExercises([]);
      return;
    }
    const { data, error } = await apiFetch(`/admin/content/workouts/${id}/exercises`);
    if (error) {
      setErrorMsg(error);
      setExercises([]);
    } else {
      setExercises(asList(data));
    }
  };

  useEffect(() => {
    if (workoutId) loadExercises(workoutId);
  }, [workoutId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workoutId || !name.trim()) return;
    setSubmitting(true);
    const { error } = await apiFetch(`/admin/content/workouts/${workoutId}/exercises`, {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(),
        sets: Number(sets) || 0,
        reps: Number(reps) || 0,
        duration_sec: durationSec ? Number(durationSec) : undefined,
        rest_sec: restSec ? Number(restSec) : undefined,
        order: Number(order) || 0,
      }),
    });
    setSubmitting(false);
    if (error) {
      alert(error);
      return;
    }
    setName('');
    setOrder(String((exercises.length || 0) + 2));
    loadExercises(workoutId);
  };

  const handleDelete = async (id: string, exName: string) => {
    if (!confirm(`Delete exercise "${exName}"? This cannot be undone.`)) return;
    const { error } = await apiFetch(`/admin/content/workouts/${workoutId}/exercises/${id}`, {
      method: 'DELETE',
    });
    if (error) alert(error);
    else loadExercises(workoutId);
  };

  const selectedWorkout = workouts.find((w) => w.id === workoutId);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Exercises</h1>
        <p className="text-sm text-slate-500 mt-0.5">Exercises for a selected workout</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border">
          <select
            className="input h-9 w-auto text-sm py-0"
            value={workoutId}
            onChange={(e) => setWorkoutId(e.target.value)}
          >
            {workouts.length === 0 && <option value="">No workouts yet</option>}
            {workouts.map((w) => (
              <option key={w.id} value={w.id}>{w.title}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-400 gap-2 text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">Exercise</th>
                  <th className="table-th">Workout</th>
                  <th className="table-th">Sets</th>
                  <th className="table-th">Reps</th>
                  <th className="table-th">Duration</th>
                  <th className="table-th">Rest</th>
                  <th className="table-th">Order</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exercises.map((e) => (
                  <tr key={e.id} className="hover:bg-surface/40 transition-colors">
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                          <Dumbbell size={14} className="text-brand" />
                        </div>
                        <span className="font-medium text-slate-800">{e.name}</span>
                      </div>
                    </td>
                    <td className="table-td">
                      <span className="badge badge-neutral">{selectedWorkout?.title || '—'}</span>
                    </td>
                    <td className="table-td">{e.sets ?? '—'}</td>
                    <td className="table-td">{e.reps ?? '—'}</td>
                    <td className="table-td">{e.duration_sec != null ? `${e.duration_sec}s` : '—'}</td>
                    <td className="table-td">{e.rest_sec != null ? `${e.rest_sec}s` : '—'}</td>
                    <td className="table-td">#{e.order ?? 0}</td>
                    <td className="table-td text-right">
                      <button
                        className="btn btn-ghost p-1.5 text-danger hover:bg-danger-light"
                        onClick={() => handleDelete(e.id, e.name)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {exercises.length === 0 && !errorMsg && (
                  <tr>
                    <td colSpan={8} className="table-td text-center text-slate-400 py-10">
                      No exercises yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {workoutId && (
        <form className="card max-w-2xl" onSubmit={handleCreate}>
          <h3 className="font-semibold text-slate-700 text-sm mb-3">Add Exercise</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="col-span-2 sm:col-span-3">
              <label className="text-xs font-medium text-slate-500 mb-1 block">Name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Sets</label>
              <input type="number" className="input" value={sets} onChange={(e) => setSets(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Reps</label>
              <input type="number" className="input" value={reps} onChange={(e) => setReps(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Duration (sec)</label>
              <input type="number" className="input" value={durationSec} onChange={(e) => setDurationSec(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Rest (sec)</label>
              <input type="number" className="input" value={restSec} onChange={(e) => setRestSec(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Order</label>
              <input type="number" className="input" value={order} onChange={(e) => setOrder(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Add Exercise
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
