import { Save } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage your shop preferences</p>
      </div>

      {/* Shop identity */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-sm text-gray-700 pb-2 border-b border-surface-border">Shop Identity</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Shop Name</label>
            <input className="input" defaultValue="GymPulse Shop" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Currency</label>
            <select className="input">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-500 mb-1 block">Shop Description</label>
            <textarea className="input resize-none h-20" defaultValue="Premium gym equipment and supplements." />
          </div>
        </div>
        <div className="flex justify-end">
          <button className="btn btn-primary"><Save size={14} /> Save</button>
        </div>
      </div>

      {/* Notifications */}
      <div className="card space-y-3">
        <h2 className="font-semibold text-sm text-gray-700 pb-2 border-b border-surface-border">Notifications</h2>
        {[
          { label: 'New Order Notifications',    key: 'orders',    on: true  },
          { label: 'Low Stock Alerts',           key: 'lowstock',  on: true  },
          { label: 'Return Request Alerts',      key: 'returns',   on: true  },
          { label: 'Weekly Sales Summary Email', key: 'weeksales', on: false },
        ].map(n => (
          <div key={n.key} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{n.label}</span>
            <button className={`relative w-10 h-5 rounded-full transition-colors ${n.on ? 'bg-brand' : 'bg-gray-200'}`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${n.on ? 'left-5.5 translate-x-0.5' : 'left-0.5'}`} />
            </button>
          </div>
        ))}
      </div>

      {/* Order defaults */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-sm text-gray-700 pb-2 border-b border-surface-border">Order Defaults</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Low Stock Threshold</label>
            <input type="number" className="input" defaultValue="10" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Max Product Images</label>
            <input type="number" className="input" defaultValue="8" />
          </div>
        </div>
        <div className="flex justify-end">
          <button className="btn btn-primary"><Save size={14} /> Save</button>
        </div>
      </div>
    </div>
  )
}
