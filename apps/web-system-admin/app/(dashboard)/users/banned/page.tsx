'use client';

import { useEffect, useState } from 'react';
import { Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '../../../../lib/apiClient';

type AppUser = {
  id: string;
  email?: string;
  full_name?: string;
  banned_until?: string | null;
};

export default function BannedUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await apiFetch('/admin/users?status=banned');
    if (error) {
      setErrorMsg(error);
      setUsers([]);
    } else {
      setUsers(Array.isArray(data?.users) ? data.users : []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const unban = async (id: string) => {
    const { error } = await apiFetch(`/admin/users/${id}/unban`, { method: 'POST' });
    if (error) alert(error);
    else load();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Banned Users</h1>
        <p className="text-sm text-slate-500 mt-0.5">Users currently banned via the backend</p>
      </div>
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-400 gap-2 text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading…
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">User</th>
                <th className="table-th">Banned until</th>
                <th className="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="table-td">
                    <p className="font-medium text-slate-800">{u.full_name || 'Member'}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </td>
                  <td className="table-td text-slate-400">
                    {u.banned_until ? new Date(u.banned_until).toLocaleString() : 'Indefinite'}
                  </td>
                  <td className="table-td text-right">
                    <button className="btn btn-outline text-xs" onClick={() => unban(u.id)}>
                      Unban
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !errorMsg && (
                <tr>
                  <td colSpan={3} className="table-td text-center text-slate-400 py-10">
                    No banned users.
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
