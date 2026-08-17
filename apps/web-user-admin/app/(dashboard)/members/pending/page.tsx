import { UserCheck, X, Check } from 'lucide-react'

const pending = [
  { name: 'Carlos Mendes', email: 'carlos@mail.com', tier: 'Basic',   location: 'Beirut',    submitted: 'Apr 14, 2025 09:32', reason: 'New sign-up' },
  { name: 'Aisha Nkosi',   email: 'aisha@mail.com',  tier: 'Premium', location: 'Nairobi',   submitted: 'Apr 14, 2025 10:15', reason: 'New sign-up' },
  { name: 'Tom Eriksson',  email: 'tom@mail.com',    tier: 'Basic',   location: 'Stockholm', submitted: 'Apr 13, 2025 18:44', reason: 'New sign-up' },
  { name: 'Nina Kovacs',   email: 'nina@mail.com',   tier: 'Premium', location: 'Budapest',  submitted: 'Apr 13, 2025 14:20', reason: 'New sign-up' },
  { name: 'Yusuf Omar',    email: 'yusuf@mail.com',  tier: 'Basic',   location: 'Mogadishu', submitted: 'Apr 12, 2025 08:05', reason: 'New sign-up' },
]

export default function PendingMembersPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-warn-light flex items-center justify-center">
          <UserCheck size={20} className="text-warn" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-ink">Pending Approvals</h1>
          <p className="text-sm text-ink-muted mt-0.5">{pending.length} members waiting for approval</p>
        </div>
      </div>

      <div className="space-y-3">
        {pending.map((p, i) => (
          <div key={i} className="card flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-sheet border border-sheet-border flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-ink">
                {p.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ink">{p.name}</p>
              <p className="text-xs text-ink-ghost">{p.email} · {p.location}</p>
              <p className="text-[10px] text-ink-ghost mt-0.5">{p.submitted}</p>
            </div>
            <span className={`badge text-[10px] ${p.tier === 'Premium' ? 'badge-ink' : 'badge-neutral'} shrink-0`}>
              {p.tier}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button className="btn h-8 text-xs gap-1 bg-ok text-white hover:bg-green-600">
                <Check size={13} /> Approve
              </button>
              <button className="btn btn-outline h-8 text-xs gap-1 text-bad border-bad hover:bg-bad-light">
                <X size={13} /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
