'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '../../../../lib/apiClient';
import { asList } from '../../../../lib/utils';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await apiFetch('/admin/system/audit-logs');
    if (error) {
      setErrorMsg(error);
      setLogs([]);
    } else {
      setLogs(asList(data));
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const actions = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => {
      if (l.action) set.add(l.action);
    });
    return [...set];
  }, [logs]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return logs.filter((l) => {
      const matchSearch =
        String(l.action || '').toLowerCase().includes(q) ||
        String(l.resource || '').toLowerCase().includes(q) ||
        String(l.admin_id || '').toLowerCase().includes(q);
      const matchAction = !actionFilter || l.action === actionFilter;
      return matchSearch && matchAction;
    });
  }, [logs, search, actionFilter]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Audit Logs</h1>
        <p className="text-sm text-slate-500 mt-0.5">All admin actions recorded for accountability</p>
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
            <input className="input pl-8 h-9 text-sm" placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select
            className="input h-9 w-auto text-sm py-0 ml-auto"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="">All Actions</option>
            {actions.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-400 gap-2 text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading logs…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">Admin</th>
                  <th className="table-th">Action</th>
                  <th className="table-th">Resource</th>
                  <th className="table-th">IP Address</th>
                  <th className="table-th">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-surface/40 transition-colors">
                    <td className="table-td font-mono text-xs text-slate-500">
                      {l.admin_id ? String(l.admin_id).slice(0, 8) : '—'}
                    </td>
                    <td className="table-td">
                      <span className="badge badge-neutral font-mono text-[11px]">{l.action || '—'}</span>
                    </td>
                    <td className="table-td text-slate-500 font-mono text-xs">
                      {l.resource || l.resource_id || '—'}
                    </td>
                    <td className="table-td text-slate-400 font-mono text-xs">{l.ip_address || '—'}</td>
                    <td className="table-td text-slate-400 text-xs">
                      {l.created_at ? new Date(l.created_at).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && !errorMsg && (
                  <tr>
                    <td colSpan={5} className="table-td text-center text-slate-400 py-10">
                      No audit logs yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
