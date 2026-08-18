'use client';

import { useEffect, useState } from 'react';
import {
  Trophy,
  Users,
  Dumbbell,
  Layers,
  BookOpen,
  Calendar,
  CheckCircle,
  Plus,
  ArrowUpRight,
  Sparkles,
  Loader2,
  ServerCrash,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { apiFetch } from '../../../lib/apiClient';

export default function SportOverviewPage() {
  const { activeDiscipline } = useAuth();
  const [workoutsCount, setWorkoutsCount] = useState(0);
  const [programsCount, setProgramsCount] = useState(0);
  const [articlesCount, setArticlesCount] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setErrorMsg(null);
    const discId = activeDiscipline?.id;
    const query = discId ? `?discipline_id=${discId}` : '';

    const [wRes, pRes, cRes, catRes] = await Promise.all([
      apiFetch(`/admin/content/workouts${query}`),
      apiFetch(`/admin/content/programs${query}`),
      apiFetch(`/admin/content${query}`),
      apiFetch(`/admin/content/categories${query}`),
    ]);

    if (wRes.error || pRes.error || cRes.error || catRes.error) {
      setErrorMsg(wRes.error || pRes.error || cRes.error || catRes.error);
    }

    setWorkoutsCount(Array.isArray(wRes.data) ? wRes.data.length : 0);
    setProgramsCount(Array.isArray(pRes.data) ? pRes.data.length : 0);
    setArticlesCount(Array.isArray(cRes.data) ? cRes.data.length : 0);
    setCategories(Array.isArray(catRes.data) ? catRes.data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMetrics();
  }, [activeDiscipline?.id]);

  const discName = activeDiscipline?.name || 'Sport Discipline';
  const discIcon = activeDiscipline?.icon || '🥊';
  const discColor = activeDiscipline?.color || '#18181b';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div
        className="rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-card transition-all"
        style={{
          background: `linear-gradient(135deg, ${discColor} 0%, #111111 100%)`,
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/20">
              {discIcon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                  Active Managed Discipline
                </span>
                <span className="bg-emerald-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle size={10} /> Active
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold mt-1 tracking-tight">{discName}</h1>
              <p className="text-xs text-white/80 max-w-xl mt-1 leading-relaxed">
                {activeDiscipline?.description || 'All data operations for this discipline are served strictly via the Go Backend.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Backend Connection Error */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 flex-shrink-0 text-red-500" />
          <div>
            <p className="font-bold">Backend Communication Notice</p>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-ink-ghost gap-2">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-xs font-semibold">Fetching live metrics from Go Backend…</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="card p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-ink-muted mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">Workouts</span>
              <Dumbbell size={16} />
            </div>
            <p className="text-2xl font-bold text-ink">{workoutsCount}</p>
            <a
              href="/sport/workouts"
              className="text-[10px] text-ink-muted hover:text-ink font-semibold mt-1 flex items-center gap-0.5"
            >
              Manage <ArrowUpRight size={10} />
            </a>
          </div>

          <div className="card p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-ink-muted mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">Programs</span>
              <Layers size={16} />
            </div>
            <p className="text-2xl font-bold text-ink">{programsCount}</p>
            <a
              href="/sport/programs"
              className="text-[10px] text-ink-muted hover:text-ink font-semibold mt-1 flex items-center gap-0.5"
            >
              Manage <ArrowUpRight size={10} />
            </a>
          </div>

          <div className="card p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-ink-muted mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">Articles</span>
              <BookOpen size={16} />
            </div>
            <p className="text-2xl font-bold text-ink">{articlesCount}</p>
            <a
              href="/sport/content"
              className="text-[10px] text-ink-muted hover:text-ink font-semibold mt-1 flex items-center gap-0.5"
            >
              Manage <ArrowUpRight size={10} />
            </a>
          </div>

          <div className="card p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-ink-muted mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">Categories</span>
              <Calendar size={16} />
            </div>
            <p className="text-2xl font-bold text-ink">{categories.length}</p>
            <a
              href="/sport/categories"
              className="text-[10px] text-ink-muted hover:text-ink font-semibold mt-1 flex items-center gap-0.5"
            >
              View Categories <ArrowUpRight size={10} />
            </a>
          </div>
        </div>
      )}

      {/* Two column section: Categories & Quick Management Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Categories */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-ink">{discName} Categories</h3>
              <p className="text-xs text-ink-muted">Content and workout taxonomy from Go Backend.</p>
            </div>
            <a href="/sport/categories" className="btn btn-outline h-8 text-xs gap-1">
              <Plus size={14} /> Add Category
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((cat: any) => (
              <div
                key={cat.id}
                className="p-3.5 rounded-2xl bg-sheet border border-sheet-border flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: discColor }} />
                  <span className="text-xs font-bold text-ink">{cat.name}</span>
                </div>
                <span className="text-[10px] text-ink-ghost font-semibold">{cat.slug}</span>
              </div>
            ))}
            {categories.length === 0 && !loading && (
              <p className="text-xs text-ink-ghost col-span-full py-4">
                No categories created yet for this discipline in backend database.
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-base font-bold text-ink mb-3 flex items-center gap-2">
            <Sparkles size={16} /> Quick Actions
          </h3>
          <div className="space-y-2">
            <a
              href="/sport/workouts?create=true"
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-sheet hover:bg-sheet-hover border border-sheet-border transition-colors text-xs font-semibold text-ink"
            >
              <span className="flex items-center gap-2">
                <Dumbbell size={15} /> Create {discName} Workout
              </span>
              <ArrowUpRight size={14} />
            </a>

            <a
              href="/sport/programs?create=true"
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-sheet hover:bg-sheet-hover border border-sheet-border transition-colors text-xs font-semibold text-ink"
            >
              <span className="flex items-center gap-2">
                <Layers size={15} /> Create Training Program
              </span>
              <ArrowUpRight size={14} />
            </a>

            <a
              href="/sport/content?create=true"
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-sheet hover:bg-sheet-hover border border-sheet-border transition-colors text-xs font-semibold text-ink"
            >
              <span className="flex items-center gap-2">
                <BookOpen size={15} /> Publish Article / Tip
              </span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
