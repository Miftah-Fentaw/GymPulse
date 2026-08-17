import { Search, Crown } from 'lucide-react'

const premiumMembers = [
  { id: '1', name: 'Ahmed Hassan', email: 'ahmed@mail.com', location: 'Dubai',     joined: 'Jan 12, 2025', renewsOn: 'Feb 12, 2026', bookings: 22 },
  { id: '2', name: 'Priya Sharma', email: 'priya@mail.com', location: 'Abu Dhabi', joined: 'Apr 7, 2025',  renewsOn: 'May 7, 2026',  bookings: 14 },
  { id: '3', name: 'James Okafor', email: 'james@mail.com', location: 'Kuwait',    joined: 'Nov 5, 2024',  renewsOn: 'Nov 5, 2025',  bookings: 31 },
  { id: '4', name: 'Aisha Nkosi',  email: 'aisha@mail.com', location: 'Nairobi',   joined: 'Mar 1, 2025',  renewsOn: 'Mar 1, 2026',  bookings: 9  },
]

export default function PremiumMembersPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-warn-light flex items-center justify-center">
          <Crown size={20} className="text-warn" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-ink">Premium Members</h1>
          <p className="text-sm text-ink-muted mt-0.5">3,482 members on the Premium plan</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Premium', value: '3,482' },
          { label: 'Monthly',       value: '2,910' },
          { label: 'Annual',        value: '572'   },
        ].map(s => (
          <div key={s.label} className="card py-4">
            <p className="text-2xl font-bold text-ink">{s.value}</p>
            <p className="text-xs text-ink-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost" />
            <input className="input pl-8 h-9 text-sm" placeholder="Search premium members…" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-sheet-border">
                <th className="th">Member</th>
                <th className="th">Location</th>
                <th className="th">Joined</th>
                <th className="th">Renews On</th>
                <th className="th">Bookings</th>
              </tr>
            </thead>
            <tbody>
              {premiumMembers.map(m => (
                <tr key={m.id} className="hover:bg-sheet/50 transition-colors">
                  <td className="td">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-warn-light flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-warn">
                          {m.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-ink text-sm">{m.name}</p>
                        <p className="text-xs text-ink-ghost">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="td text-ink-muted">{m.location}</td>
                  <td className="td text-ink-ghost text-xs">{m.joined}</td>
                  <td className="td text-ink-ghost text-xs">{m.renewsOn}</td>
                  <td className="td font-semibold text-ink">{m.bookings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
