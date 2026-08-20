'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch, asArray } from '../../../../lib/apiClient';

function toIso(local: string) {
  if (!local) return '';
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return local;
  return d.toISOString();
}

export default function CreateClassPage() {
  const router = useRouter();
  const [disciplines, setDisciplines] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [disciplineId, setDisciplineId] = useState('');
  const [trainerId, setTrainerId] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('active');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);
      const [dRes, tRes] = await Promise.all([
        apiFetch('/admin/classes/disciplines'),
        apiFetch('/admin/trainers?per_page=100'),
      ]);
      if (dRes.error || tRes.error) {
        setErrorMsg(dRes.error || tRes.error);
      }
      setDisciplines(asArray(dRes.data));
      setTrainers(asArray(tRes.data));
      setLoading(false);
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startTime) return;
    setIsSubmitting(true);
    const payload: Record<string, any> = {
      title,
      description,
      difficulty_level: difficulty,
      duration_minutes: duration ? Number(duration) : 0,
      max_participants: maxParticipants ? Number(maxParticipants) : 0,
      price: price ? Number(price) : 0,
      start_time: toIso(startTime),
      end_time: toIso(endTime),
      status,
    };
    if (disciplineId) payload.discipline_id = disciplineId;
    if (trainerId) payload.trainer_id = trainerId;

    const { error } = await apiFetch('/admin/classes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (error) {
      alert(error);
      setIsSubmitting(false);
      return;
    }
    router.push('/classes');
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        <a href="/classes" className="btn btn-ghost p-2"><ArrowLeft size={18} /></a>
        <div>
          <h1 className="text-xl font-bold text-ink">Add Class</h1>
          <p className="text-sm text-ink-muted mt-0.5">Schedule a new fitness class</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-4">
        <h2 className="font-semibold text-ink text-sm border-b border-sheet-border pb-3">Class Details</h2>
        {loading ? (
          <div className="flex items-center gap-2 text-ink-ghost py-6">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-xs">Loading disciplines and trainers…</span>
          </div>
        ) : (
          <>
            <div>
              <label className="text-xs font-medium text-ink-muted mb-1 block">Class Title</label>
              <input
                className="input"
                required
                placeholder="e.g. Morning Yoga Flow"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink-muted mb-1 block">Description</label>
              <textarea
                className="input resize-none h-20"
                placeholder="Describe this class…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-ink-muted mb-1 block">Discipline</label>
                <select
                  className="input"
                  value={disciplineId}
                  onChange={(e) => setDisciplineId(e.target.value)}
                >
                  <option value="">Select discipline…</option>
                  {disciplines.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-ink-muted mb-1 block">Difficulty</label>
                <select
                  className="input"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="beginner">beginner</option>
                  <option value="intermediate">intermediate</option>
                  <option value="advanced">advanced</option>
                  <option value="all_levels">all_levels</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-ink-muted mb-1 block">Trainer</label>
                <select
                  className="input"
                  value={trainerId}
                  onChange={(e) => setTrainerId(e.target.value)}
                >
                  <option value="">Select trainer…</option>
                  {trainers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.profiles?.full_name || t.profiles?.email || t.id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-ink-muted mb-1 block">Max Participants</label>
                <input
                  type="number"
                  className="input"
                  placeholder="Capacity"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-ink-muted mb-1 block">Start Time</label>
                <input
                  type="datetime-local"
                  className="input"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-ink-muted mb-1 block">End Time</label>
                <input
                  type="datetime-local"
                  className="input"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-ink-muted mb-1 block">Duration (min)</label>
                <input
                  type="number"
                  className="input"
                  placeholder="Minutes"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-ink-muted mb-1 block">Price ($)</label>
                <input
                  type="number"
                  className="input"
                  placeholder="0 for free"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-ink-muted mb-1 block">Status</label>
                <select
                  className="input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="active">active</option>
                  <option value="scheduled">scheduled</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <a href="/classes" className="btn btn-outline">Cancel</a>
              <button type="submit" disabled={isSubmitting} className="btn btn-ink">
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : 'Create Class'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
