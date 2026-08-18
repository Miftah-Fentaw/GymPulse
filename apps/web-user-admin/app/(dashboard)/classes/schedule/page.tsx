'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch, asArray } from '../../../lib/apiClient';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function trainerName(c: any) {
  return c.trainers?.profiles?.full_name || 'Unassigned';
}

const colors = [
  'bg-bad-light text-bad',
  'bg-warn-light text-warn',
  'bg-ok-light text-ok',
  'bg-info-light text-info',
  'bg-violet-light text-violet',
];

export default function ClassSchedulePage() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const weekEnd = addDays(weekStart, 7);
  const today = new Date();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);
      const start = ymd(weekStart);
      const end = ymd(weekEnd);
      const { data, error } = await apiFetch(`/admin/classes/schedule?start_date=${start}&end_date=${end}`);
      if (error) {
        setErrorMsg(error);
        setClasses([]);
      } else {
        setClasses(asArray(data));
      }
      setLoading(false);
    };
    load();
  }, [weekStart]);

  const byDay = useMemo(() => {
    const map: Record<number, any[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    classes.forEach((c) => {
      if (!c.start_time) return;
      const d = new Date(c.start_time);
      const idx = Math.floor((d.getTime() - weekStart.getTime()) / 86400000);
      if (idx >= 0 && idx < 7) map[idx].push(c);
    });
    return map;
  }, [classes, weekStart]);

  const rangeLabel = `${weekStart.toLocaleDateString()} – ${addDays(weekStart, 6).toLocaleDateString()}`;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Class Schedule</h1>
          <p className="text-sm text-ink-muted mt-0.5">Weekly view — {rangeLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-outline h-9 p-2"
            onClick={() => setWeekStart(addDays(weekStart, -7))}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className="btn btn-outline h-9 text-sm px-3"
            onClick={() => setWeekStart(startOfWeek(new Date()))}
          >
            Today
          </button>
          <button
            className="btn btn-outline h-9 p-2"
            onClick={() => setWeekStart(addDays(weekStart, 7))}
          >
            <ChevronRight size={16} />
          </button>
          <a href="/classes/create" className="btn btn-ink h-9 text-sm">
            <Plus size={15} /> Add Class
          </a>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-ink-ghost gap-2">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-xs font-semibold">Loading schedule…</span>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-sheet-border">
            {days.map((d, i) => {
              const date = addDays(weekStart, i);
              const isToday = date.toDateString() === today.toDateString();
              return (
                <div
                  key={d}
                  className={`px-3 py-3 text-center border-r border-sheet-border last:border-r-0 ${isToday ? 'bg-ink' : ''}`}
                >
                  <p className={`text-xs font-semibold ${isToday ? 'text-white' : 'text-ink-muted'}`}>{d}</p>
                  <p className={`text-lg font-bold mt-0.5 ${isToday ? 'text-white' : 'text-ink'}`}>
                    {date.getDate()}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-7 min-h-[320px]">
            {days.map((d, i) => {
              const date = addDays(weekStart, i);
              const isToday = date.toDateString() === today.toDateString();
              const items = byDay[i] || [];
              return (
                <div
                  key={d}
                  className={`p-2 space-y-1.5 border-r border-sheet-border last:border-r-0 ${isToday ? 'bg-sheet' : ''}`}
                >
                  {items.map((cls, ci) => {
                    const t = cls.start_time ? new Date(cls.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                    return (
                      <div
                        key={cls.id}
                        className={`rounded-xl px-2 py-1.5 ${colors[ci % colors.length]}`}
                      >
                        <p className="text-[11px] font-bold leading-tight">{cls.title}</p>
                        <p className="text-[10px] mt-0.5 opacity-70">
                          {t} · {trainerName(cls)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          {classes.length === 0 && !errorMsg && (
            <p className="text-xs text-ink-ghost py-8 text-center border-t border-sheet-border">
              No classes scheduled this week.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
