'use client';

import { useEffect, useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { apiFetch, asArray } from '../../../lib/apiClient';

const LOCAL_KEY = 'gympulse_class_defaults';

type ClassDefaults = { capacity: string; cancelHours: string };

function readLocalDefaults(): ClassDefaults {
  if (typeof window === 'undefined') return { capacity: '', cancelHours: '' };
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return { capacity: '', cancelHours: '' };
    const parsed = JSON.parse(raw);
    return {
      capacity: parsed.capacity != null ? String(parsed.capacity) : '',
      cancelHours: parsed.cancelHours != null ? String(parsed.cancelHours) : '',
    };
  } catch {
    return { capacity: '', cancelHours: '' };
  }
}

export default function SettingsPage() {
  const { user } = useAuth();
  const email = user?.email || '';
  const fullName = user?.user_metadata?.full_name || '';
  const initials = (fullName || email || 'GP').substring(0, 2).toUpperCase();

  const [capacity, setCapacity] = useState('');
  const [cancelHours, setCancelHours] = useState('');
  const [settingsSource, setSettingsSource] = useState<'api' | 'local'>('local');
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState('');
  const [notifyPrefs, setNotifyPrefs] = useState<Record<string, boolean>>({
    registrations: false,
    cancellations: false,
    classFull: false,
    trainerReview: false,
    weekly: false,
  });

  useEffect(() => {
    const load = async () => {
      const { data, error } = await apiFetch('/admin/system/settings');
      if (!error && data) {
        const rows = asArray(data);
        const findVal = (key: string) => {
          const row = rows.find((s: any) => s.key === key);
          if (!row) return '';
          const v = row.value;
          if (v == null) return '';
          return String(typeof v === 'object' ? JSON.stringify(v) : v).replace(/^"|"$/g, '');
        };
        const cap = findVal('default_class_capacity');
        const win = findVal('cancellation_window_hours');
        if (cap || win) {
          setCapacity(cap);
          setCancelHours(win);
          setSettingsSource('api');
          return;
        }
      }
      const local = readLocalDefaults();
      setCapacity(local.capacity);
      setCancelHours(local.cancelHours);
      setSettingsSource('local');
    };
    load();
  }, []);

  const saveDefaults = async () => {
    setSaving(true);
    setNote('');
    if (settingsSource === 'api') {
      const [a, b] = await Promise.all([
        apiFetch('/admin/system/settings/default_class_capacity', {
          method: 'PATCH',
          body: JSON.stringify({ value: capacity ? Number(capacity) : capacity }),
        }),
        apiFetch('/admin/system/settings/cancellation_window_hours', {
          method: 'PATCH',
          body: JSON.stringify({ value: cancelHours ? Number(cancelHours) : cancelHours }),
        }),
      ]);
      if (a.error || b.error) {
        localStorage.setItem(LOCAL_KEY, JSON.stringify({ capacity, cancelHours }));
        setSettingsSource('local');
        setNote(a.error || b.error || 'Saved locally. Settings API is not writable from this role.');
      } else {
        setNote('Class defaults saved.');
      }
    } else {
      localStorage.setItem(LOCAL_KEY, JSON.stringify({ capacity, cancelHours }));
      setNote('Class defaults saved on this device only.');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-ink">Settings</h1>
        <p className="text-sm text-ink-muted mt-0.5">User admin preferences and configuration</p>
      </div>

      <div className="card space-y-4">
        <h2 className="font-bold text-ink pb-2 border-b border-sheet-border">Profile</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-ink flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-white">{initials}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Full Name</label>
            <input className="input" value={fullName} readOnly />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Email</label>
            <input className="input" value={email} readOnly />
          </div>
        </div>
      </div>

      <div className="card space-y-3">
        <h2 className="font-bold text-ink pb-2 border-b border-sheet-border">Notification Preferences</h2>
        <p className="text-xs text-ink-muted">These toggles stay on this device. They are not saved to the backend.</p>
        {[
          { key: 'registrations', label: 'New member registrations' },
          { key: 'cancellations', label: 'Booking cancellations' },
          { key: 'classFull', label: 'Class full alerts' },
          { key: 'trainerReview', label: 'Trainer review reminders' },
          { key: 'weekly', label: 'Weekly summary email' },
        ].map((n) => (
          <div key={n.key} className="flex items-center justify-between">
            <span className="text-sm text-ink">{n.label}</span>
            <button
              type="button"
              onClick={() => setNotifyPrefs((p) => ({ ...p, [n.key]: !p[n.key] }))}
              className={`relative w-10 h-5 rounded-full transition-colors ${notifyPrefs[n.key] ? 'bg-ink' : 'bg-sheet-border'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifyPrefs[n.key] ? 'left-5.5 translate-x-0.5' : 'left-0.5'}`} />
            </button>
          </div>
        ))}
      </div>

      <div className="card space-y-4">
        <h2 className="font-bold text-ink pb-2 border-b border-sheet-border">Class Defaults</h2>
        <p className="text-xs text-ink-muted">
          {settingsSource === 'api'
            ? 'Loaded from platform settings.'
            : 'Stored locally on this device. Platform settings are not available for this role.'}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Default Class Capacity</label>
            <input
              type="number"
              className="input"
              placeholder="Not set"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Cancellation Window (hours)</label>
            <input
              type="number"
              className="input"
              placeholder="Not set"
              value={cancelHours}
              onChange={(e) => setCancelHours(e.target.value)}
            />
          </div>
        </div>
        {note && <p className="text-xs text-ink-muted">{note}</p>}
        <div className="flex justify-end">
          <button type="button" onClick={saveDefaults} disabled={saving} className="btn btn-ink">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
