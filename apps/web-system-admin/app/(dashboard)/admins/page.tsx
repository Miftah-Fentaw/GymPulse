'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Trash2, ShieldCheck, ShoppingBag, Dumbbell, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '../../../lib/apiClient';

const roleConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  super_admin: { label: 'Super Admin', color: 'bg-brand/10 text-brand', icon: <ShieldCheck size={12} /> },
  user_admin: { label: 'User Admin', color: 'bg-success/10 text-success', icon: <ShieldCheck size={12} /> },
  shop_admin: { label: 'Shop Admin', color: 'bg-warning/10 text-warning', icon: <ShoppingBag size={12} /> },
  sport_admin: { label: 'Sport Admin', color: 'bg-purple-100 text-purple-600', icon: <Dumbbell size={12} /> },
};

type Admin = {
  id: string;
  email?: string;
  full_name?: string;
  admin_role?: string;
  created_at?: string;
  is_active?: boolean;
  user_metadata?: { full_name?: string };
  app_metadata?: { admin_role?: string };
};

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const qs = roleFilter ? `?role=${roleFilter}` : '';
    const { data, error } = await apiFetch(`/admin/admins${qs}`);
    if (error) {
      setErrorMsg(error);
      setAdmins([]);
    } else {
      const list = Array.isArray(data?.admins) ? data.admins : Array.isArray(data) ? data : [];
      setAdmins(list);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [roleFilter]);

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Delete admin ${email}? This cannot be undone.`)) return;
    const { error } = await apiFetch(`/admin/admins/${id}`, { method: 'DELETE' });
    if (error) {
      alert(error);
      return;
    }
    load();
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return admins.filter((a) => {
      const name = a.full_name || a.user_metadata?.full_name || '';
      const email = a.email || '';
      return name.toLowerCase().includes(q) || email.toLowerCase().includes(q);
    });
  }, [admins, search]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Admin Accounts</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage admin accounts created through the backend</p>
        </div>
        <a href="/admins/create" className="btn btn-primary h-9 text-sm">
          <Plus size={16} />
          Create Admin
        </a>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(roleConfig).map(([key, cfg]) => (
          <div key={key} className="card py-4 text-center">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color} mb-2`}>
              {cfg.icon}
              {cfg.label}
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {admins.filter((a) => (a.admin_role || a.app_metadata?.admin_role) === key).length}
            </p>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-8 h-9 text-sm"
              placeholder="Search admins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input h-9 w-auto text-sm py-0 ml-auto"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="super_admin">super_admin</option>
            <option value="user_admin">user_admin</option>
            <option value="shop_admin">shop_admin</option>
            <option value="sport_admin">sport_admin</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-slate-400 gap-2 text-sm">
              <Loader2 size={16} className="animate-spin" /> Loading admins…
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">Admin</th>
                  <th className="table-th">Role</th>
                  <th className="table-th">Status</th>
                  <th className="table-th">Created</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => {
                  const role = a.admin_role || a.app_metadata?.admin_role || '';
                  const cfg = roleConfig[role] || roleConfig.user_admin;
                  const name = a.full_name || a.user_metadata?.full_name || a.email || 'Admin';
                  const initials = name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();
                  return (
                    <tr key={a.id} className="hover:bg-surface/40 transition-colors">
                      <td className="table-td">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-sidebar-bg flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-white">{initials}</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{name}</p>
                            <p className="text-xs text-slate-400">{a.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-td">
                        <span className={`inline-flex items-center gap-1 badge ${cfg.color}`}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </td>
                      <td className="table-td">
                        <span className={`badge ${a.is_active !== false ? 'badge-success' : 'badge-neutral'}`}>
                          {a.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="table-td text-slate-400">
                        {a.created_at ? new Date(a.created_at).toLocaleDateString() : '—'}
                      </td>
                      <td className="table-td text-right">
                        <button
                          className="btn btn-ghost p-1.5 text-danger hover:bg-danger-light"
                          title="Delete"
                          onClick={() => handleDelete(a.id, a.email || name)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && !errorMsg && (
                  <tr>
                    <td colSpan={5} className="table-td text-center text-slate-400 py-10">
                      No admins found. Create one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
