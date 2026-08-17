import { Search, ShieldOff, Check } from 'lucide-react'

const bannedMembers = [
  { id: '1', name: 'Mike Torres',  email: 'mike@mail.com',  tier: 'Premium', bannedOn: 'Dec 20, 2024', reason: 'Repeated no-shows', bookings: 8 },
  { id: '2', name: 'Rex Oduya',    email: 'rex@mail.com',   tier: 'Basic',   bannedOn: 'Jan 5, 2025',  reason: 'Abusive behaviour', bookings: 2 },
  { id: '3', name: 'Tasha Belova', email: 'tasha@mail.com', tier: 'Basic',   bannedOn: 'Feb 14, 2025', reason: 'Payment disputes',  bookings: 1 },
]

export default function BannedMembersPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-bad-light flex items-center justify-center">
          <ShieldOff size={20} className="text-bad" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-ink">Banned Members</h1>
          <p className="text-sm text-ink-muted mt-0.5">{bannedMembers.length} members currently banned</p>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost" />
            <input className="input pl-8 h-9 text-sm" placeholder="Search banned members…" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-sheet-border">
                <th className="th">Member</th>
                <th className="th">Tier</th>
                <th className="th">Banned On</th>
                <th className="th">Reason</th>
                <th className="th">Bookings</th>
                <th className="th text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {bannedMembers.map(m => (
                <tr key={m.id} className="hover:bg-sheet/50 transition-colors">
                  <td className="td">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-bad-light flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-bad">
                          {m.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-ink text-sm">{m.name}</p>
                        <p className="text-xs text-ink-ghost">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="td">
                    <span className={`badge text-[10px] ${m.tier === 'Premium' ? 'badge-ink' : 'badge-neutral'}`}>{m.tier}</span>
                  </td>
                  <td className="td text-ink-muted text-sm">{m.bannedOn}</td>
                  <td className="td text-ink-muted text-sm">{m.reason}</td>
                  <td className="td font-semibold text-ink">{m.bookings}</td>
                  <td className="td text-right">
                    <button className="btn h-8 text-xs gap-1 bg-ok text-white hover:bg-green-600">
                      <Check size={12} /> Unban
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
