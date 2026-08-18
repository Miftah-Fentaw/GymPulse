'use client';

import { useEffect, useState } from 'react';
import { Save, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '../../../../lib/apiClient';
import { asList } from '../../../../lib/utils';

type Setting = {
  key: string;
  value: any;
  description?: string;
};

function displayValue(value: any) {
  if (value == null) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function parseValue(raw: string, original: any) {
  const trimmed = raw.trim();
  if (typeof original === 'boolean' || trimmed === 'true' || trimmed === 'false') {
    return trimmed === 'true';
  }
  if (typeof original === 'number' && trimmed !== '' && !Number.isNaN(Number(trimmed))) {
    return Number(trimmed);
  }
  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return raw;
    }
  }
  if (typeof original === 'object') {
    try {
      return JSON.parse(trimmed);
    } catch {
      return raw;
    }
  }
  return raw;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await apiFetch('/admin/system/settings');
    if (error) {
      setErrorMsg(error);
      setSettings([]);
    } else {
      const list = asList<Setting>(data);
      setSettings(list);
      const next: Record<string, string> = {};
      list.forEach((s) => {
        next[s.key] = displayValue(s.value);
      });
      setDrafts(next);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const saveOne = async (s: Setting) => {
    setSavingKey(s.key);
    const { error } = await apiFetch(`/admin/system/settings/${encodeURIComponent(s.key)}`, {
      method: 'PATCH',
      body: JSON.stringify({ value: parseValue(drafts[s.key] ?? '', s.value) }),
    });
    setSavingKey(null);
    if (error) alert(error);
    else load();
  };

  const saveAll = async () => {
    for (const s of settings) {
      await saveOne(s);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Platform Settings</h1>
          <p className="text-sm text-slate-500 mt-0.5">Configure global platform behaviour</p>
        </div>
        {settings.length > 0 && (
          <button className="btn btn-primary h-9" onClick={saveAll} disabled={!!savingKey}>
            <Save size={15} />
            Save All
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-400 gap-2 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading settings…
        </div>
      ) : settings.length === 0 ? (
        <div className="card text-center py-10 text-slate-400 text-sm">No settings yet</div>
      ) : (
        <div className="card">
          <div className="space-y-5">
            {settings.map((s) => {
              const isBool = typeof s.value === 'boolean' || drafts[s.key] === 'true' || drafts[s.key] === 'false';
              return (
                <div key={s.key} className="flex items-start gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-slate-700 block mb-0.5 font-mono">{s.key}</label>
                    {s.description && <p className="text-xs text-slate-400 mb-2">{s.description}</p>}
                  </div>
                  <div className="shrink-0 w-56 flex flex-col items-end gap-2">
                    {isBool ? (
                      <button
                        type="button"
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          drafts[s.key] === 'true' ? 'bg-brand' : 'bg-slate-200'
                        }`}
                        onClick={() =>
                          setDrafts((d) => ({ ...d, [s.key]: d[s.key] === 'true' ? 'false' : 'true' }))
                        }
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            drafts[s.key] === 'true' ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    ) : (
                      <input
                        className="input text-sm"
                        value={drafts[s.key] ?? ''}
                        onChange={(e) => setDrafts((d) => ({ ...d, [s.key]: e.target.value }))}
                      />
                    )}
                    <button className="btn btn-outline h-8 text-xs" onClick={() => saveOne(s)} disabled={savingKey === s.key}>
                      {savingKey === s.key ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                      Save
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
