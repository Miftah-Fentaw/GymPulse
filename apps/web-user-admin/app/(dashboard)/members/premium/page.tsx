'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Crown, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch, asArray, formatDay, initialsFrom } from '../../../lib/apiClient';

type AppUser = {
  id: string;
  email?: string;
  full_name?: string;
  created_at?: string;
  last_sign_in_at?: string;
  user_metadata?: { tier?: string };
  tier?: string;
};

function isPremium(u: AppUser) {
  const tier = (u.user_metadata?.tier || u.tier || '').toLowerCase();
  return tier === 'premium';
}

export default function PremiumMembersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');

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

  const premium = useMemo(() => users.filter(isPremium), [users]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return premium.filter(
      (u) =>
        (u.email || '').toLowerCase().includes(q) ||
        (u.full_name || '').toLowerCase().includes(q)
    );
  }, [premium, search]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-warn-light flex items-center justify-center">
          <Crown size={20} className="text-warn" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-ink">Premium Members</h1>
          <p className="text-sm text-ink-muted mt-0.5">
            Premium is not assigned by a dedicated API. Members appear here only if metadata tier is premium.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost" />
            <input
              className="input pl-8 h-9 text-sm"
              placeholder="Search premium members…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12 text-ink-ghost gap-2">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-xs font-semibold">Loading members…</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-t border-sheet-border">
                  <th className="th">Member</th>
                  <th className="th">Joined</th>
                  <th className="th">Last sign-in</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-sheet/50 transition-colors">
                    <td className="td">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-warn-light flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-warn">
                            {initialsFrom(m.full_name, m.email)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-ink text-sm">{m.full_name || 'Unnamed member'}</p>
                          <p className="text-xs text-ink-ghost">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="td text-ink-ghost text-xs">{formatDay(m.created_at)}</td>
                    <td className="td text-ink-ghost text-xs">{formatDay(m.last_sign_in_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && !errorMsg && (
              <p className="text-xs text-ink-ghost py-10 text-center">
                Premium is not assigned yet. No members have user_metadata.tier = premium.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
