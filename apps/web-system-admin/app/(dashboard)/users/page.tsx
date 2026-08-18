'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Ban, Trash2, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '../../../lib/apiClient';

type AppUser = {
  id: string;
  email?: string;
  full_name?: string;
  created_at?: string;
  last_sign_in_at?: string;
  is_banned?: boolean;
  banned_until?: string | null;
};

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await apiFetch('/admin/users');
    if (error) {
      setErrorMsg(error);
      setUsers([]);
    } else {
      const list = Array.isArray(data?.users) ? data.users : Array.isArray(data) ? data : [];
      setUsers(list);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleBan = async (id: string) => {
    if (!confirm('Ban this user?')) return;
    const { error } = await apiFetch(`/admin/users/${id}/ban`, { method: 'POST' });
    if (error) alert(error);
    else load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this user?')) return;
    const { error } = await apiFetch(`/admin/users/${id}`, { method: 'DELETE' });
    if (error) alert(error);
    else load();
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        (u.email || '').toLowerCase().includes(q) ||
        (u.full_name || '').toLowerCase().includes(q)
    );
  }, [users, search]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">App Users</h1>
        <p className="text-sm text-slate-500 mt-0.5">Members loaded from the backend</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-8 h-9 text-sm"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="text-xs text-slate-400 ml-auto">{filtered.length} users</span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-400 gap-2 text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading users…
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">User</th>
                <th className="table-th">Joined</th>
                <th className="table-th">Last sign in</th>
                <th className="table-th">Status</th>
                <th className="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-surface/40">
                  <td className="table-td">
                    <p className="font-medium text-slate-800">{u.full_name || 'Member'}</p>
                    <p className="text-xs text-slate-400">{u.email || u.id}</p>
                  </td>
                  <td className="table-td text-slate-400">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="table-td text-slate-400">
                    {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="table-td">
                    <span className={`badge ${u.is_banned || u.banned_until ? 'badge-danger' : 'badge-success'}`}>
                      {u.is_banned || u.banned_until ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td className="table-td text-right">
                    <button className="btn btn-ghost p-1.5" title="Ban" onClick={() => handleBan(u.id)}>
                      <Ban size={15} />
                    </button>
                    <button
                      className="btn btn-ghost p-1.5 text-danger hover:bg-danger-light"
                      title="Delete"
                      onClick={() => handleDelete(u.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !errorMsg && (
                <tr>
                  <td colSpan={5} className="table-td text-center text-slate-400 py-10">
                    No app users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
