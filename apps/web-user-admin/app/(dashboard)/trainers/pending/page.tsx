'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck, Check, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch, asArray, formatDate, initialsFrom } from '../../../../lib/apiClient';

export default function PendingTrainersPage() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await apiFetch('/admin/trainers?verified=false&per_page=100');
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

  const handleVerify = async (id: string) => {
    if (!confirm('Verify this trainer?')) return;
    setActionId(id);
    const { error } = await apiFetch(`/admin/trainers/${id}/verify`, { method: 'POST' });
    if (error) alert(error);
    else load();
    setActionId(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-warn-light flex items-center justify-center">
          <ShieldCheck size={20} className="text-warn" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-ink">Pending Trainer Review</h1>
          <p className="text-sm text-ink-muted mt-0.5">
            {loading ? 'Loading…' : `${trainers.length} trainers awaiting verification`}
          </p>
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
          <span className="text-xs font-semibold">Loading unverified trainers…</span>
        </div>
      ) : (
        <div className="space-y-3">
          {trainers.map((t) => {
            const name = t.profiles?.full_name || 'Unnamed trainer';
            const email = t.profiles?.email || '';
            const specialties: string[] = Array.isArray(t.specialties) ? t.specialties : [];
            const certs: string[] = Array.isArray(t.certifications) ? t.certifications : [];
            return (
              <div key={t.id} className="card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-sheet border border-sheet-border flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-ink">{initialsFrom(name, email)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-ink">{name}</p>
                        <p className="text-xs text-ink-ghost">{email || '—'}</p>
                      </div>
                      <span className="text-xs text-ink-ghost shrink-0">{formatDate(t.created_at)}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {specialties.map((s) => (
                        <span key={s} className="badge badge-neutral text-[10px]">{s}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-ink-muted">
                      <span>{t.years_experience ?? 0} yrs experience</span>
                      {certs.length > 0 && <span>{certs.join(' · ')}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-sheet-border">
                  <button
                    onClick={() => handleVerify(t.id)}
                    disabled={actionId === t.id}
                    className="btn btn-ink flex-1 h-9 gap-1.5"
                  >
                    {actionId === t.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    Verify Trainer
                  </button>
                </div>
              </div>
            );
          })}
          {trainers.length === 0 && !errorMsg && (
            <p className="text-xs text-ink-ghost py-10 text-center">No unverified trainers.</p>
          )}
        </div>
      )}
    </div>
  );
}
