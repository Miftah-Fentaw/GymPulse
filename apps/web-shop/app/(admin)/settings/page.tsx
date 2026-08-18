'use client';

import { useEffect, useState } from 'react';
import { Save, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';
import { asArray, getLowStockThreshold, setLowStockThreshold } from '@/lib/shop';

function settingValue(rows: any[], key: string): string {
  const row = rows.find((r) => r.key === key || r.name === key);
  if (!row) return '';
  const v = row.value;
  if (v == null) return '';
  if (typeof v === 'object') return typeof v.value === 'string' ? v.value : JSON.stringify(v);
  return String(v);
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [canPatch, setCanPatch] = useState(false);
  const [shopName, setShopName] = useState('');
  const [currency, setCurrency] = useState('');
  const [description, setDescription] = useState('');
  const [threshold, setThreshold] = useState(String(getLowStockThreshold()));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error, status } = await apiFetch('/admin/system/settings');
      if (status === 200) {
        const list = asArray(data);
        setCanPatch(true);
        setShopName(settingValue(list, 'shop_name'));
        setCurrency(settingValue(list, 'currency'));
        setDescription(settingValue(list, 'shop_description'));
      } else if (status === 403) {
        setCanPatch(false);
      } else if (error) {
        setErrorMsg(error);
      }
      setThreshold(String(getLowStockThreshold()));
      setLoading(false);
    })();
  }, []);

  const patchKey = async (key: string, value: string) => {
    const { error, status } = await apiFetch(`/admin/system/settings/${key}`, {
      method: 'PATCH',
      body: JSON.stringify({ value }),
    });
    return { error, status };
  };

  const handleSaveIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setErrorMsg(null);
    if (!canPatch) {
      setMessage('Shop settings are not available for this role. Changes were not saved to the backend.');
      setSaving(false);
      return;
    }
    const updates = [
      shopName ? patchKey('shop_name', shopName) : null,
      currency ? patchKey('currency', currency) : null,
      description ? patchKey('shop_description', description) : null,
    ].filter(Boolean) as Promise<{ error: string | null; status?: number }>[];

    if (updates.length === 0) {
      setMessage('No settings keys to update.');
      setSaving(false);
      return;
    }
    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);
    if (failed?.error) setErrorMsg(failed.error);
    else setMessage('Settings saved.');
    setSaving(false);
  };

  const handleSaveThreshold = (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(threshold);
    if (!Number.isFinite(n) || n < 1) {
      setErrorMsg('Low stock threshold must be a positive number.');
      return;
    }
    setLowStockThreshold(n);
    setMessage('Low stock threshold saved locally for this browser.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Loading settings…</span>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage your shop preferences</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}
      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">{message}</div>
      )}

      <form onSubmit={handleSaveIdentity} className="card space-y-4">
        <h2 className="font-semibold text-sm text-gray-700 pb-2 border-b border-surface-border">Shop Identity</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Shop Name</label>
            <input className="input" value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="Shop name" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Currency</label>
            <input className="input" value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="USD" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-500 mb-1 block">Shop Description</label>
            <textarea className="input resize-none h-20" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary" disabled={saving}><Save size={14} /> Save</button>
        </div>
      </form>

      <form onSubmit={handleSaveThreshold} className="card space-y-4">
        <h2 className="font-semibold text-sm text-gray-700 pb-2 border-b border-surface-border">Inventory</h2>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Low Stock Threshold</label>
          <input type="number" min="1" className="input max-w-xs" value={threshold} onChange={(e) => setThreshold(e.target.value)} />
          <p className="text-[11px] text-gray-400 mt-1">Used on low-stock pages. Stored in this browser.</p>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary"><Save size={14} /> Save</button>
        </div>
      </form>
    </div>
  );
}
