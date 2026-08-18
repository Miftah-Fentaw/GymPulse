'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '../../../../../lib/apiClient';
import { asList } from '../../../../../lib/utils';

export default function CreateWorkoutPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [disciplines, setDisciplines] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMins, setDurationMins] = useState('45');
  const [difficulty, setDifficulty] = useState('beginner');
  const [categoryId, setCategoryId] = useState('');
  const [disciplineId, setDisciplineId] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiFetch('/admin/content/workout-categories'),
      apiFetch('/admin/disciplines'),
    ]).then(([cats, discs]) => {
      setCategories(asList(cats.data));
      setDisciplines(asList(discs.data));
      if (cats.error || discs.error) setErrorMsg(cats.error || discs.error);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!title.trim()) return;
    setSubmitting(true);
    const { error } = await apiFetch('/admin/content/workouts', {
      method: 'POST',
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim(),
        duration_mins: Number(durationMins) || 0,
        difficulty,
        category_id: categoryId || undefined,
        discipline_id: disciplineId || undefined,
        is_published: isPublished,
      }),
    });
    setSubmitting(false);
    if (error) {
      setErrorMsg(error);
      return;
    }
    router.push('/content/workouts');
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <a href="/content/workouts" className="btn btn-ghost p-2"><ArrowLeft size={18} /></a>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Create Workout</h1>
          <p className="text-sm text-slate-500 mt-0.5">Build a new workout</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-4">
          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-700 text-sm">Workout Details</h2>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Title</label>
              <input className="input" placeholder="Workout title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Description</label>
              <textarea className="input resize-none h-20" placeholder="Describe this workout…" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Difficulty</label>
                <select className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="beginner">beginner</option>
                  <option value="intermediate">intermediate</option>
                  <option value="advanced">advanced</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Duration (mins)</label>
                <input type="number" min="0" className="input" value={durationMins} onChange={(e) => setDurationMins(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Category</label>
                <select className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                  <option value="">None</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
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
          </div>
        </div>

        <div className="space-y-4">
          <div className="card space-y-3">
            <h2 className="font-semibold text-slate-700 text-sm">Settings</h2>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Status</label>
              <select className="input" value={isPublished ? 'published' : 'draft'} onChange={(e) => setIsPublished(e.target.value === 'published')}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <a href="/content/workouts" className="btn btn-outline flex-1">Discard</a>
            <button type="submit" className="btn btn-primary flex-1" disabled={submitting}>
              {submitting ? <Loader2 size={14} className="animate-spin" /> : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
