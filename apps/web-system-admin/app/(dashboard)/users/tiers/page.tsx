import { Crown } from 'lucide-react'

const tiers = [
  {
    name: 'Basic',
    price: 'Free',
    members: 9364,
    features: ['Access 5 workouts/month', 'Browse shop', 'Community feed', 'Basic profile'],
    dark: false,
  },
  {
    name: 'Premium',
    price: '$19.99/mo · $149.99/yr',
    members: 3482,
    features: ['Unlimited workouts', 'All fitness programs', 'AI recommendations', 'Priority support', 'Early shop access', 'Full profile & analytics'],
    dark: true,
  },
]

export default function UserTiersPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Membership Tiers</h1>
        <p className="text-sm text-slate-500 mt-0.5">Overview of platform membership plans and their feature access</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
        {tiers.map(t => (
          <div key={t.name} className={`card border-2 ${t.dark ? 'bg-sidebar-bg border-sidebar-bg' : 'border-surface-border'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.dark ? 'bg-white/10' : 'bg-brand/10'}`}>
                <Crown size={18} className={t.dark ? 'text-white' : 'text-brand'} />
              </div>
              <div>
                <p className={`font-bold text-lg ${t.dark ? 'text-white' : 'text-slate-800'}`}>{t.name}</p>
                <p className={`text-xs ${t.dark ? 'text-white/60' : 'text-slate-400'}`}>{t.price}</p>
              </div>
            </div>
            <p className={`text-2xl font-bold mb-1 ${t.dark ? 'text-white' : 'text-slate-800'}`}>
              {t.members.toLocaleString()}
            </p>
            <p className={`text-xs mb-4 ${t.dark ? 'text-white/50' : 'text-slate-400'}`}>Active members</p>
            <ul className="space-y-2">
              {t.features.map(f => (
                <li key={f} className={`flex items-start gap-2 text-sm ${t.dark ? 'text-white/80' : 'text-slate-600'}`}>
                  <span className={`shrink-0 mt-0.5 font-bold ${t.dark ? 'text-white/60' : 'text-success'}`}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
        {[
          { label: 'Total Users',     value: '12,846' },
          { label: 'Premium Rate',    value: '27.1%' },
          { label: 'MRR (Premium)',   value: '$69,665' },
          { label: 'Annual Premium',  value: '$149.99' },
        ].map(s => (
          <div key={s.label} className="card py-4 text-center">
            <p className="text-xl font-bold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
