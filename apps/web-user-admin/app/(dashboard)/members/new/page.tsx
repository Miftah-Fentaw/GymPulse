'use client';

import { useEffect, useMemo, useState } from 'react';
import { UserPlus, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch, asArray, formatDate, initialsFrom } from '../../../../lib/apiClient';

type AppUser = {
  id: string;
  email?: string;
  full_name?: string;
  created_at?: string;
  last_sign_in_at?: string;
};

export default function NewMembersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);
      const { data, error } = await apiFetch('/admin/users');
      if (error) {
        setErrorMsg(error);
        setUsers([]);
      } else {
        setUsers(asArray<AppUser>(data?.users ?? data));
      }
      setLoading(false);
    };
    load();
  }, []);

  const newest = useMemo(() => {
    return [...users]
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .slice(0, 20);
  }, [users]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-ok-light flex items-center justify-center">
          <UserPlus size={20} className="text-ok" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-ink">New Registrations</h1>
          <p className="text-sm text-ink-muted mt-0.5">Most recent members, sorted by created date</p>
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
          <span className="text-xs font-semibold">Loading new members…</span>
        </div>
      ) : (
        <div className="space-y-2">
          {newest.map((m) => (
            <div key={m.id} className="card flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-ok-light flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-ok">
                  {initialsFrom(m.full_name, m.email)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink">{m.full_name || 'Unnamed member'}</p>
                <p className="text-xs text-ink-ghost">{m.email}</p>
              </div>
              <span className="text-xs text-ink-ghost shrink-0">{formatDate(m.created_at)}</span>
            </div>
          ))}
          {newest.length === 0 && !errorMsg && (
            <p className="text-xs text-ink-ghost py-10 text-center">No members found.</p>
          )}
        </div>
      )}
    </div>
  );
}
