'use client';

import { useEffect, useMemo, useState } from 'react';
import { Crown, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '../../../../lib/apiClient';
import { asList } from '../../../../lib/utils';

type Setting = {
  key: string;
  value: any;
  description?: string;
};

function formatValue(value: any) {
  if (value == null) return '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export default function UserTiersPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);
      const { data, error } = await apiFetch('/admin/system/settings');
      if (error) {
        setErrorMsg(error);
        setSettings([]);
      } else {
        setSettings(asList(data));
      }
      setLoading(false);
    };
    load();
  }, []);

  const related = useMemo(
    () =>
      settings.filter((s) =>
        /premium|membership|tier|plan|price|subscribe|subscription/i.test(
          `${s.key} ${s.description || ''}`
        )
      ),
    [settings]
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Membership Tiers</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Membership tiers are defined in platform settings. There is no dedicated tiers API.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="card flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
          <Crown size={18} className="text-brand" />
        </div>
        <div>
          <p className="font-semibold text-slate-800">How tiers work</p>
          <p className="text-sm text-slate-500 mt-1">
            Premium and membership behaviour is controlled by keys in{' '}
            <a href="/system/settings" className="text-brand hover:underline">
              Platform Settings
            </a>
            . Related keys are listed below when present.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-400 gap-2 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading settings…
        </div>
      ) : related.length === 0 ? (
        <div className="card text-center py-10 text-slate-400 text-sm">
          No premium or membership settings yet.
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">Key</th>
                <th className="table-th">Value</th>
                <th className="table-th">Description</th>
              </tr>
            </thead>
            <tbody>
              {related.map((s) => (
                <tr key={s.key} className="hover:bg-surface/40">
                  <td className="table-td font-mono text-xs text-slate-700">{s.key}</td>
                  <td className="table-td font-medium text-slate-800">{formatValue(s.value)}</td>
                  <td className="table-td text-slate-400 text-sm">{s.description || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
