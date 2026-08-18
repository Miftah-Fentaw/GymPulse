'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, MapPin, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '../../../lib/apiClient';
import { asList } from '../../../lib/utils';

export default function LocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [capacity, setCapacity] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await apiFetch('/admin/system/locations');
    if (error) {
      setErrorMsg(error);
      setLocations([]);
    } else {
      setLocations(asList(data));
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    const { error } = await apiFetch('/admin/system/locations', {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(),
        city: city.trim(),
        country: country.trim(),
        address: address.trim(),
        capacity: Number(capacity) || 0,
      }),
    });
    setSubmitting(false);
    if (error) {
      alert(error);
      return;
    }
    setName('');
    setCity('');
    setCountry('');
    setAddress('');
    setCapacity('');
    load();
  };

  const handleDelete = async (id: string, locName: string) => {
    if (!confirm(`Delete location "${locName}"? This cannot be undone.`)) return;
    const { error } = await apiFetch(`/admin/system/locations/${id}`, { method: 'DELETE' });
    if (error) alert(error);
    else load();
  };

  const toggleActive = async (loc: any) => {
    const { error } = await apiFetch(`/admin/system/locations/${loc.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: !loc.is_active }),
    });
    if (error) alert(error);
    else load();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Locations</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage physical gym locations across regions</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-400 gap-2 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading locations…
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {locations.map((l) => (
            <div key={l.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                  <MapPin size={18} className="text-brand" />
                </div>
                <button
                  type="button"
                  className={`badge text-[10px] ${l.is_active !== false ? 'badge-success' : 'badge-neutral'}`}
                  onClick={() => toggleActive(l)}
                >
                  {l.is_active !== false ? 'Open' : 'Closed'}
                </button>
              </div>
              <p className="font-semibold text-slate-800">{l.name}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {[l.city, l.country].filter(Boolean).join(', ') || '—'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5 truncate">{l.address || '—'}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-border text-xs text-slate-500">
                <span>Capacity: {l.capacity ?? '—'}</span>
                <button className="btn btn-ghost p-1 text-danger hover:bg-danger/10" onClick={() => handleDelete(l.id, l.name)}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
          {locations.length === 0 && !errorMsg && (
            <div className="card col-span-full text-center py-10 text-slate-400 text-sm">No locations yet</div>
          )}
        </div>
      )}

      <form className="card max-w-2xl" onSubmit={handleCreate}>
        <h3 className="font-semibold text-slate-700 text-sm mb-4">Add New Location</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-xs font-medium text-slate-500 mb-1 block">Branch Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">City</label>
            <input className="input" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Country</label>
            <input className="input" value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-slate-500 mb-1 block">Full Address</label>
            <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Capacity</label>
            <input type="number" className="input" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Add Location
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
