import { Crown } from 'lucide-react'

const tiers = [
  {
    name: 'Basic',
    price: 'Free',
    members: 9364,
    color: 'bg-sheet border-sheet-border',
    icon: 'bg-sheet-border text-ink',
    perks: ['Access to 5 classes/month', 'Basic workout library', 'Community access'],
  },
  {
    name: 'Premium',
    price: '$19.99 / mo',
    members: 3482,
    color: 'bg-ink border-ink',
    icon: 'bg-white/10 text-white',
    perks: ['Unlimited classes', 'Full workout & program library', 'AI recommendations', 'Priority support'],
    dark: true,
  },
]

export default function MembershipTiersPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-ink">Membership Tiers</h1>
        <p className="text-sm text-ink-muted mt-0.5">Overview of platform membership plans</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
        {tiers.map(t => (
          <div key={t.name} className={`card border-2 ${t.color}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${t.icon}`}>
                <Crown size={18} />
              </div>
              <div>
                <p className={`font-bold text-lg ${t.dark ? 'text-white' : 'text-ink'}`}>{t.name}</p>
                <p className={`text-sm ${t.dark ? 'text-white/60' : 'text-ink-muted'}`}>{t.price}</p>
              </div>
            </div>
            <p className={`text-2xl font-bold mb-0.5 ${t.dark ? 'text-white' : 'text-ink'}`}>
              {t.members.toLocaleString()}
            </p>
            <p className={`text-xs mb-4 ${t.dark ? 'text-white/50' : 'text-ink-ghost'}`}>Active members</p>
            <ul className="space-y-2">
              {t.perks.map(p => (
                <li key={p} className={`flex items-start gap-2 text-sm ${t.dark ? 'text-white/80' : 'text-ink-muted'}`}>
                  <span className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${t.dark ? 'bg-white/10 text-white' : 'bg-sheet text-ink'}`}>✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
