'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Loader2, ServerCrash, ShieldAlert } from 'lucide-react';
import { apiFetch, asArray, formatDate } from '../../lib/apiClient';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);
      setForbidden(false);
      const { data, error, status } = await apiFetch('/admin/system/audit-logs');
      if (status === 403) {
        setForbidden(true);
        setLogs([]);
      } else if (error) {
        setErrorMsg(error);
        setLogs([]);
      } else {
        setLogs(asArray(data));
      }
      setLoading(false);
    };
    load();
  }, []);

  const actions = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => {
      if (l.action) set.add(l.action);
    });
    return Array.from(set);
  }, [logs]);

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (l.action || '').toLowerCase().includes(q) ||
      (l.resource || l.resource_id || '').toString().toLowerCase().includes(q) ||
      (l.admin_id || l.admin || '').toString().toLowerCase().includes(q);
    const matchesAction = actionFilter === 'all' || l.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-ink">Audit Logs</h1>
        <p className="text-sm text-ink-muted mt-0.5">All admin actions recorded</p>
      </div>

      {forbidden && (
        <div className="card flex items-start gap-3">
          <ShieldAlert size={18} className="text-warn shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-ink">Requires super admin</p>
            <p className="text-xs text-ink-muted mt-0.5">
              Audit logs are restricted to super admin accounts.
            </p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!forbidden && (
        <div className="card p-0 overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost" />
              <input
                className="input pl-8 h-9 text-sm"
                placeholder="Search logs…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="input h-9 w-auto text-sm py-0 ml-auto"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="all">All Actions</option>
              {actions.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 text-ink-ghost gap-2">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-xs font-semibold">Loading audit logs…</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-t border-sheet-border">
                    <th className="th">Admin</th>
                    <th className="th">Action</th>
                    <th className="th">Resource</th>
                    <th className="th">IP Address</th>
                    <th className="th">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((l, i) => (
                    <tr key={l.id || i} className="hover:bg-sheet/50 transition-colors">
                      <td className="td font-medium text-ink">{l.admin_email || l.admin_id || l.admin || '—'}</td>
                      <td className="td">
                        <span className="badge font-mono text-[10px] badge-neutral">{l.action || '—'}</span>
                      </td>
                      <td className="td font-mono text-xs text-ink-muted">
                        {l.resource || l.resource_type || l.resource_id || '—'}
                      </td>
                      <td className="td font-mono text-xs text-ink-ghost">{l.ip_address || l.ip || '—'}</td>
                      <td className="td text-xs text-ink-ghost">{formatDate(l.created_at || l.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && !errorMsg && (
                <p className="text-xs text-ink-ghost py-10 text-center">No audit logs found.</p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between px-5 py-4 border-t border-sheet-border">
            <p className="text-xs text-ink-muted">Showing {filtered.length} entries</p>
          </div>
        </div>
      )}
    </div>
  );
}
