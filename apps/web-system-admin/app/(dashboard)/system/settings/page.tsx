import { Save, AlertTriangle } from 'lucide-react'

const settingGroups = [
  {
    title: 'Platform',
    settings: [
      { key: 'platform_name', label: 'Platform Name', value: 'GymPulse', type: 'text' },
      { key: 'maintenance_mode', label: 'Maintenance Mode', value: 'false', type: 'toggle', description: 'Enabling this will show a maintenance page to all users.' },
      { key: 'platform_version', label: 'Platform Version', value: '2.1.0', type: 'text' },
    ],
  },
  {
    title: 'Membership',
    settings: [
      { key: 'premium_price_monthly', label: 'Premium Price (Monthly)', value: '19.99', type: 'number' },
      { key: 'premium_price_yearly', label: 'Premium Price (Yearly)', value: '149.99', type: 'number' },
      { key: 'free_tier_workout_limit', label: 'Free Tier Workout Limit', value: '5', type: 'number', description: 'Max workouts a free-tier user can access per month.' },
    ],
  },
  {
    title: 'Storage',
    settings: [
      { key: 'max_product_images', label: 'Max Product Images', value: '8', type: 'number' },
      { key: 'max_workout_media', label: 'Max Workout Media Files', value: '10', type: 'number' },
    ],
  },
  {
    title: 'Security',
    settings: [
      { key: 'token_expiry_minutes', label: 'JWT Token Expiry (minutes)', value: '60', type: 'number' },
      { key: 'max_login_attempts', label: 'Max Login Attempts', value: '5', type: 'number' },
    ],
  },
]

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Platform Settings</h1>
          <p className="text-sm text-slate-500 mt-0.5">Configure global platform behaviour</p>
        </div>
      </div>

      {settingGroups.map((group) => (
        <div key={group.title} className="card">
          <h2 className="font-semibold text-slate-800 mb-4 pb-3 border-b border-surface-border">{group.title}</h2>
          <div className="space-y-5">
            {group.settings.map((s) => (
              <div key={s.key} className="flex items-start gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-slate-700 block mb-0.5">{s.label}</label>
                  {s.description && <p className="text-xs text-slate-400 mb-2">{s.description}</p>}
                </div>
                <div className="shrink-0 w-56">
                  {s.type === 'toggle' ? (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-500">{s.value === 'true' ? 'On' : 'Off'}</span>
                      <button
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          s.value === 'true' ? 'bg-brand' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            s.value === 'true' ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ) : (
                    <input
                      type={s.type}
                      defaultValue={s.value}
                      className="input text-sm"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-5 pt-4 border-t border-surface-border">
            <button className="btn btn-primary h-9">
              <Save size={15} />
              Save {group.title} Settings
            </button>
          </div>
        </div>
      ))}

      {/* Danger zone */}
      <div className="card border-danger/30">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle size={20} className="text-danger shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold text-slate-800">Danger Zone</h2>
            <p className="text-sm text-slate-500 mt-0.5">These actions are irreversible. Proceed with extreme caution.</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-lg border border-danger/20 bg-danger/5">
            <div>
              <p className="text-sm font-medium text-slate-700">Reset All Platform Settings</p>
              <p className="text-xs text-slate-400 mt-0.5">Revert all settings to factory defaults.</p>
            </div>
            <button className="btn btn-danger h-9 text-sm">Reset</button>
          </div>
        </div>
      </div>
    </div>
  )
}
