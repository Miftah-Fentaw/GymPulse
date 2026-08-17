import { Search, Ban, Trash2, Eye, MoreHorizontal } from 'lucide-react'

const members = [
  { id: '1', name: 'Ahmed Hassan',  email: 'ahmed@mail.com',  tier: 'Premium', status: 'active',  location: 'Dubai',     joined: 'Jan 12, 2025', bookings: 22 },
  { id: '2', name: 'Sara Ali',      email: 'sara@mail.com',   tier: 'Basic',   status: 'active',  location: 'Cairo',     joined: 'Feb 3, 2025',  bookings: 5  },
  { id: '3', name: 'Mike Torres',   email: 'mike@mail.com',   tier: 'Premium', status: 'banned',  location: 'Riyadh',    joined: 'Dec 20, 2024', bookings: 8  },
  { id: '4', name: 'Layla Noor',    email: 'layla@mail.com',  tier: 'Basic',   status: 'active',  location: 'Amman',     joined: 'Mar 1, 2025',  bookings: 3  },
  { id: '5', name: 'Priya Sharma',  email: 'priya@mail.com',  tier: 'Premium', status: 'active',  location: 'Abu Dhabi', joined: 'Apr 7, 2025',  bookings: 14 },
  { id: '6', name: 'Carlos Mendes', email: 'carlos@mail.com', tier: 'Basic',   status: 'pending', location: 'Beirut',    joined: 'Apr 9, 2025',  bookings: 0  },
  { id: '7', name: 'James Okafor',  email: 'james@mail.com',  tier: 'Premium', status: 'active',  location: 'Kuwait',    joined: 'Nov 5, 2024',  bookings: 31 },
]

const badge: Record<string,string> = { active: 'badge-ok', pending: 'badge-warn', banned: 'badge-bad' }

export default function MembersPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Members</h1>
          <p className="text-sm text-ink-muted mt-0.5">Manage all registered members</p>
        </div>
      </div>

      {/* Summary pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Members',  value: '12,846', sub: 'All time' },
          { label: 'Active',         value: '10,214', sub: 'Currently active' },
          { label: 'Premium',        value: '3,482',  sub: 'Paid tier' },
          { label: 'Banned',         value: '24',     sub: 'Restricted access' },
        ].map(s => (
          <div key={s.label} className="card">
            <p className="text-2xl font-bold text-ink">{s.value}</p>
            <p className="text-xs font-semibold text-ink mt-0.5">{s.label}</p>
            <p className="text-[10px] text-ink-ghost mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost" />
            <input className="input pl-8 h-9 text-sm" placeholder="Search members…" />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <select className="input h-9 w-auto text-sm py-0">
              <option>All Tiers</option>
              <option>Premium</option>
              <option>Basic</option>
            </select>
            <select className="input h-9 w-auto text-sm py-0">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Banned</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-sheet-border">
                <th className="th"><input type="checkbox" className="rounded-md" /></th>
                <th className="th">Member</th>
                <th className="th">Tier</th>
                <th className="th">Status</th>
                <th className="th">Location</th>
                <th className="th">Bookings</th>
                <th className="th">Joined</th>
                <th className="th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.id} className="hover:bg-sheet/50 transition-colors">
                  <td className="td"><input type="checkbox" className="rounded-md" /></td>
                  <td className="td">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-sheet border border-sheet-border flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-ink">
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
                  <td className="td">
                    <span className={`badge text-[10px] ${badge[m.status]}`}>
                      {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                    </span>
                  </td>
                  <td className="td text-ink-muted text-sm">{m.location}</td>
                  <td className="td font-semibold text-ink">{m.bookings}</td>
                  <td className="td text-ink-ghost text-xs">{m.joined}</td>
                  <td className="td text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="btn btn-ghost p-1.5"><Eye size={14} /></button>
                      <button className="btn btn-ghost p-1.5 text-warn hover:bg-warn-light"><Ban size={14} /></button>
                      <button className="btn btn-ghost p-1.5 text-bad hover:bg-bad-light"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-sheet-border">
          <p className="text-xs text-ink-muted">Showing 1–7 of 12,846 members</p>
          <div className="flex items-center gap-1">
            {['1','2','3','…','200'].map(p => (
              <button key={p} className={`w-8 h-8 rounded-xl text-sm font-medium transition-colors ${p === '1' ? 'bg-ink text-white' : 'hover:bg-sheet text-ink-muted'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
