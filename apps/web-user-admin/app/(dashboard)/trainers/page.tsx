'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader2, ServerCrash, CheckCircle, ShieldOff } from 'lucide-react';
import { apiFetch, asArray, initialsFrom } from '../../../lib/apiClient';

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await apiFetch('/admin/trainers?per_page=100');
    if (error) {
      setErrorMsg(error);
      setTrainers([]);
    } else {
      setTrainers(asArray(data));
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this trainer profile?')) return;
    setActionId(id);
    const { error } = await apiFetch(`/admin/trainers/${id}`, { method: 'DELETE' });
    if (error) alert(error);
    else load();
    setActionId(null);
  };

  const handleVerify = async (t: any) => {
    setActionId(t.id);
    const path = t.is_verified ? 'unverify' : 'verify';
    const { error } = await apiFetch(`/admin/trainers/${t.id}/${path}`, { method: 'POST' });
    if (error) alert(error);
    else load();
    setActionId(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Trainers</h1>
          <p className="text-sm text-ink-muted mt-0.5">Manage certified gym trainers</p>
        </div>
        <a href="/trainers/create" className="btn btn-ink">
          <Plus size={15} /> Add Trainer
        </a>
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
          <span className="text-xs font-semibold">Loading trainers…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trainers.map((t) => {
            const name = t.profiles?.full_name || 'Unnamed trainer';
            const email = t.profiles?.email || '';
            const specialties: string[] = Array.isArray(t.specialties) ? t.specialties : [];
            return (
              <div key={t.id} className="card text-center">
                <div className="w-14 h-14 rounded-full bg-sheet border-2 border-sheet-border flex items-center justify-center mx-auto mb-3">
                  <span className="text-base font-bold text-ink">{initialsFrom(name, email)}</span>
                </div>
                <p className="font-bold text-ink">{name}</p>
                <p className="text-xs text-ink-ghost mb-2">{email || '—'}</p>
                <div className="flex flex-wrap gap-1 justify-center mb-3">
                  {specialties.map((s) => (
                    <span key={s} className="badge badge-neutral text-[10px]">{s}</span>
                  ))}
                  {specialties.length === 0 && (
                    <span className="text-[10px] text-ink-ghost">No specialties</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-sheet-border text-xs text-ink-muted">
                  <span>{t.years_experience ?? 0}y exp</span>
                  <span>{t.hourly_rate != null ? `$${t.hourly_rate}/hr` : '—'}</span>
                  <span className={`badge text-[10px] ${t.is_verified ? 'badge-ok' : 'badge-warn'}`}>
                    {t.is_verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleVerify(t)}
                    disabled={actionId === t.id}
                    className="btn btn-outline flex-1 h-8 text-xs"
                  >
                    {t.is_verified ? <ShieldOff size={12} /> : <CheckCircle size={12} />}
                    {t.is_verified ? 'Unverify' : 'Verify'}
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    disabled={actionId === t.id}
                    className="btn btn-ghost h-8 text-xs text-bad hover:bg-bad-light"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
          {trainers.length === 0 && !errorMsg && (
            <p className="text-xs text-ink-ghost col-span-full py-10 text-center">No trainers found.</p>
          )}
        </div>
      )}
    </div>
  );
}
