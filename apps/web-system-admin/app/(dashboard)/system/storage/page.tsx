'use client';

import { useEffect, useState } from 'react';
import { HardDrive, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '../../../../lib/apiClient';
import { asList } from '../../../../lib/utils';

export default function StoragePage() {
  const [buckets, setBuckets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);
      const { data, error } = await apiFetch('/admin/system/storage/buckets');
      if (error) {
        setErrorMsg(error);
        setBuckets([]);
      } else {
        setBuckets(asList(data));
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Storage</h1>
        <p className="text-sm text-slate-500 mt-0.5">Supabase storage buckets overview</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-400 gap-2 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading buckets…
        </div>
      ) : buckets.length === 0 ? (
        <div className="card text-center py-10 text-slate-400 text-sm">No storage buckets yet</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {buckets.map((b) => (
            <div key={b.id || b.name} className="card">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-brand/10">
                <HardDrive size={18} className="text-brand" />
              </div>
              <h3 className="font-semibold text-slate-800">{b.name || b.id}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{b.id || b.name}</p>
              <div className="mt-4 pt-4 border-t border-surface-border flex items-center justify-between text-sm">
                <span className="text-slate-500">{b.public ? 'Public' : 'Private'}</span>
                <span className="text-xs text-slate-400">
                  {b.created_at ? new Date(b.created_at).toLocaleDateString() : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
