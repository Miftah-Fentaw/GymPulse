'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Ban, Trash2, Loader2, ServerCrash, Check } from 'lucide-react';
import { apiFetch, asArray, formatDate, initialsFrom } from '../../../lib/apiClient';

type AppUser = {
  id: string;
  email?: string;
  full_name?: string;
  created_at?: string;
  last_sign_in_at?: string;
  is_banned?: boolean;
  banned_until?: string | null;
};

export default function MembersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned'>('all');
  const [actionId, setActionId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await apiFetch('/admin/users');
    if (error) {
      setErrorMsg(error);
      setUsers([]);
      setTotal(0);
    } else {
      const list = asArray<AppUser>(data?.users ?? data);
      setUsers(list);
      setTotal(typeof data?.total === 'number' ? data.total : list.length);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleBan = async (id: string, banned: boolean) => {
    const ok = confirm(banned ? 'Unban this member?' : 'Ban this member?');
    if (!ok) return;
    setActionId(id);
    const { error } = await apiFetch(`/admin/users/${id}/${banned ? 'unban' : 'ban'}`, { method: 'POST' });
    if (error) alert(error);
    else load();
    setActionId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this member? This requires super admin.')) return;
    setActionId(id);
    const { error, status } = await apiFetch(`/admin/users/${id}`, { method: 'DELETE' });
    if (error) {
      alert(status === 403 ? 'Delete requires super admin.' : error);
    } else {
      load();
    }
    setActionId(null);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        (u.email || '').toLowerCase().includes(q) ||
        (u.full_name || '').toLowerCase().includes(q);
      if (!matchesSearch) return false;
      if (statusFilter === 'banned') return !!u.is_banned;
      if (statusFilter === 'active') return !u.is_banned;
      return true;
    });
  }, [users, search, statusFilter]);

  const activeCount = users.filter((u) => !u.is_banned).length;
  const bannedCount = users.filter((u) => u.is_banned).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Members</h1>
          <p className="text-sm text-ink-muted mt-0.5">Manage all registered members</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="card">
          <p className="text-2xl font-bold text-ink">{total}</p>
          <p className="text-xs font-semibold text-ink mt-0.5">Total Members</p>
          <p className="text-[10px] text-ink-ghost mt-0.5">From backend</p>
        </div>
        <div className="card">
          <p className="text-2xl font-bold text-ink">{activeCount}</p>
          <p className="text-xs font-semibold text-ink mt-0.5">Active</p>
          <p className="text-[10px] text-ink-ghost mt-0.5">Not banned</p>
        </div>
        <div className="card">
          <p className="text-2xl font-bold text-ink">{bannedCount}</p>
          <p className="text-xs font-semibold text-ink mt-0.5">Banned</p>
          <p className="text-[10px] text-ink-ghost mt-0.5">Restricted access</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0 text-red-500" />
          <div>
            <p className="font-bold">Backend API Unreachable</p>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost" />
            <input
              className="input pl-8 h-9 text-sm"
              placeholder="Search members…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <select
              className="input h-9 w-auto text-sm py-0"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'banned')}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
            </select>
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
                  <th className="th">Status</th>
                  <th className="th">Joined</th>
                  <th className="th">Last sign-in</th>
                  <th className="th text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-sheet/50 transition-colors">
                    <td className="td">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-sheet border border-sheet-border flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-ink">
                            {initialsFrom(m.full_name, m.email)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-ink text-sm">{m.full_name || 'Unnamed member'}</p>
                          <p className="text-xs text-ink-ghost">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="td">
                      <span className={`badge text-[10px] ${m.is_banned ? 'badge-bad' : 'badge-ok'}`}>
                        {m.is_banned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td className="td text-ink-ghost text-xs">{formatDate(m.created_at)}</td>
                    <td className="td text-ink-ghost text-xs">{formatDate(m.last_sign_in_at)}</td>
                    <td className="td text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleBan(m.id, !!m.is_banned)}
                          disabled={actionId === m.id}
                          className={`btn btn-ghost p-1.5 ${m.is_banned ? 'text-ok hover:bg-ok-light' : 'text-warn hover:bg-warn-light'}`}
                          title={m.is_banned ? 'Unban' : 'Ban'}
                        >
                          {m.is_banned ? <Check size={14} /> : <Ban size={14} />}
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          disabled={actionId === m.id}
                          className="btn btn-ghost p-1.5 text-bad hover:bg-bad-light"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && !errorMsg && (
              <p className="text-xs text-ink-ghost py-10 text-center">No members found.</p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between px-5 py-4 border-t border-sheet-border">
          <p className="text-xs text-ink-muted">
            Showing {filtered.length} of {total} members
          </p>
        </div>
      </div>
    </div>
  );
}
