import { UserPlus } from 'lucide-react'

const newMembers = [
  { name: 'Carlos Mendes', email: 'carlos@mail.com', tier: 'Basic',   location: 'Beirut',    joined: '9 min ago'  },
  { name: 'Aisha Nkosi',   email: 'aisha@mail.com',  tier: 'Premium', location: 'Nairobi',   joined: '42 min ago' },
  { name: 'Tom Eriksson',  email: 'tom@mail.com',    tier: 'Basic',   location: 'Stockholm', joined: '1h ago'      },
  { name: 'Nina Kovacs',   email: 'nina@mail.com',   tier: 'Premium', location: 'Budapest',  joined: '3h ago'      },
  { name: 'Yusuf Omar',    email: 'yusuf@mail.com',  tier: 'Basic',   location: 'Mogadishu', joined: '5h ago'      },
  { name: 'Leila Farhat',  email: 'leila@mail.com',  tier: 'Basic',   location: 'Tunis',     joined: '8h ago'      },
]

export default function NewMembersPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-ok-light flex items-center justify-center">
          <UserPlus size={20} className="text-ok" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-ink">New Registrations</h1>
          <p className="text-sm text-ink-muted mt-0.5">Members who signed up in the last 24 hours</p>
        </div>
      </div>

      <div className="space-y-2">
        {newMembers.map((m, i) => (
          <div key={i} className="card flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-ok-light flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-ok">
                {m.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ink">{m.name}</p>
              <p className="text-xs text-ink-ghost">{m.email} · {m.location}</p>
            </div>
            <span className={`badge text-[10px] ${m.tier === 'Premium' ? 'badge-ink' : 'badge-neutral'} shrink-0`}>
              {m.tier}
            </span>
            <span className="text-xs text-ink-ghost shrink-0">{m.joined}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
