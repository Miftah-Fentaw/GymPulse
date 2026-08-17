import { Save } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-ink">Settings</h1>
        <p className="text-sm text-ink-muted mt-0.5">User admin preferences and configuration</p>
      </div>

      {/* Profile */}
      <div className="card space-y-4">
        <h2 className="font-bold text-ink pb-2 border-b border-sheet-border">Profile</h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-ink flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-white">UA</span>
          </div>
          <button className="btn btn-outline text-sm">Change Avatar</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Full Name</label>
            <input className="input" defaultValue="User Admin" />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Email</label>
            <input className="input" defaultValue="admin@gympulse.app" />
          </div>
        </div>
        <div className="flex justify-end">
          <button className="btn btn-ink"><Save size={14} /> Save Profile</button>
        </div>
      </div>

      {/* Notifications */}
      <div className="card space-y-3">
        <h2 className="font-bold text-ink pb-2 border-b border-sheet-border">Notification Preferences</h2>
        {[
          { label: 'New member registrations',   on: true  },
          { label: 'Booking cancellations',      on: true  },
          { label: 'Class full alerts',          on: true  },
          { label: 'Trainer review reminders',   on: false },
          { label: 'Weekly summary email',       on: false },
        ].map(n => (
          <div key={n.label} className="flex items-center justify-between">
            <span className="text-sm text-ink">{n.label}</span>
            <button className={`relative w-10 h-5 rounded-full transition-colors ${n.on ? 'bg-ink' : 'bg-sheet-border'}`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${n.on ? 'left-5.5 translate-x-0.5' : 'left-0.5'}`} />
            </button>
          </div>
        ))}
      </div>

      {/* Class defaults */}
      <div className="card space-y-4">
        <h2 className="font-bold text-ink pb-2 border-b border-sheet-border">Class Defaults</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Default Class Capacity</label>
            <input type="number" className="input" defaultValue="20" />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Cancellation Window (hours)</label>
            <input type="number" className="input" defaultValue="2" />
          </div>
        </div>
        <div className="flex justify-end">
          <button className="btn btn-ink"><Save size={14} /> Save Settings</button>
        </div>
      </div>
    </div>
  )
}
