import {
  Users, UserCheck, Dumbbell, ClipboardList, UserX,
  ArrowUpRight, MoreHorizontal, TrendingUp, Ban,
} from 'lucide-react'

/* ── Quick stats ─────────────────────────────────────────────────────────── */
const quickStats = [
  { label: 'Total Members',    value: '12.8K', icon: <Users size={22} />,       change: '+8%',  up: true  },
  { label: 'Active Members',   value: '10.2K', icon: <UserCheck size={22} />,   change: '+5%',  up: true  },
  { label: 'Total Classes',    value: '284',   icon: <Dumbbell size={22} />,     change: '+12%', up: true  },
  { label: 'Total Bookings',   value: '3.5K',  icon: <ClipboardList size={22} />,change: '+18%', up: true  },
  { label: 'Pending Approvals',value: '8',     icon: <UserCheck size={22} />,   change: '-3',   up: false },
  { label: 'Banned Members',   value: '24',    icon: <Ban size={22} />,          change: '+2',   up: false },
]

/* ── Monthly bar chart data ──────────────────────────────────────────────── */
const monthly = [
  { m: 'Jan', members: 3200, bookings: 1800 },
  { m: 'Feb', members: 4100, bookings: 2400 },
  { m: 'Mar', members: 3800, bookings: 2100 },
  { m: 'Apr', members: 5200, bookings: 3100 },
  { m: 'May', members: 4800, bookings: 2900 },
  { m: 'Jun', members: 6400, bookings: 4000 },
  { m: 'Jul', members: 5900, bookings: 3600 },
  { m: 'Aug', members: 7200, bookings: 4800 },
  { m: 'Sep', members: 6600, bookings: 4100 },
  { m: 'Oct', members: 8000, bookings: 5200 },
  { m: 'Nov', members: 7400, bookings: 4600 },
  { m: 'Dec', members: 9100, bookings: 5900 },
]
const maxBar = Math.max(...monthly.map(d => d.members))

/* ── Pending approvals (new member registrations awaiting review) ────────── */
const pendingApprovals = [
  { name: 'Ahmed Hassan',  email: 'ahmed@mail.com',  date: 'Apr 14 09:20 GMT' },
  { name: 'Sara Ali',      email: 'sara@mail.com',   date: 'Apr 14 10:45 GMT' },
  { name: 'Priya Sharma',  email: 'priya@mail.com',  date: 'Apr 14 11:30 GMT' },
  { name: 'Carlos Mendes', email: 'carlos@mail.com', date: 'Apr 13 18:05 GMT' },
]

/* ── Manage members table ────────────────────────────────────────────────── */
const members = [
  { name: 'Ahmed Hassan',  tier: 'Premium', location: 'Dubai',      status: 'active',  joined: 'Apr 14 09:20 GMT' },
  { name: 'Sara Ali',      tier: 'Basic',   location: 'Cairo',      status: 'pending', joined: 'Apr 13 12:30 GMT' },
  { name: 'Mike Torres',   tier: 'Premium', location: 'Riyadh',     status: 'banned',  joined: 'Feb 02 08:15 GMT' },
  { name: 'Layla Noor',    tier: 'Basic',   location: 'Amman',      status: 'active',  joined: 'Apr 12 14:00 GMT' },
  { name: 'Priya Sharma',  tier: 'Premium', location: 'Abu Dhabi',  status: 'active',  joined: 'Apr 10 07:45 GMT' },
]

const statusBadge: Record<string, string> = {
  active: 'badge-ok', pending: 'badge-warn', banned: 'badge-bad',
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Quick stats */}
      <div>
        <div className="flex items-start gap-4">
          {/* Label block */}
          <div className="shrink-0 w-40">
            <h2 className="text-xl font-bold text-ink">Quick Stats</h2>
            <p className="text-xs text-ink-muted mt-1 leading-snug">
              Your statistics for<br />the last 7 days.
            </p>
          </div>

          {/* Pill cards */}
          <div className="flex-1 grid grid-cols-3 sm:grid-cols-6 gap-3">
            {quickStats.map((s, i) => (
              <div key={i} className="stat-pill">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-1 ${i === 2 ? 'bg-ink text-white' : 'bg-sheet text-ink'}`}>
                  {s.icon}
                </div>
                <p className="text-lg font-bold text-ink leading-none">{s.value}</p>
                <p className="text-[10px] text-ink-muted leading-snug mt-0.5 text-center">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Arrow link */}
          <button className="shrink-0 w-8 h-8 rounded-xl bg-ink text-white flex items-center justify-center self-start mt-1 hover:bg-ink-soft transition-colors">
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      {/* Statistics chart + Pending approvals */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Bar chart */}
        <div className="card xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-ink">Statistics</h3>
            <div className="flex items-center gap-4 text-xs text-ink-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-ink inline-block" /> Members
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-ink-ghost inline-block" /> Bookings
              </span>
            </div>
          </div>

          {/* Y-axis + bars */}
          <div className="flex gap-3 h-48">
            <div className="flex flex-col justify-between text-[10px] text-ink-ghost text-right pr-1.5 shrink-0">
              {['9K','8K','6K','4K','2K','0'].map(l => <span key={l}>{l}</span>)}
            </div>
            <div className="flex-1 flex items-end gap-1.5 relative">
              {monthly.map((d, i) => {
                const isActive = i === 7 // Aug – tallest in chart
                return (
                  <div key={d.m} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                    {isActive && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-ink text-white text-[10px] font-bold px-2 py-0.5 rounded-lg whitespace-nowrap">
                        7.2K
                      </div>
                    )}
                    <div className="w-full flex items-end gap-0.5">
                      <div
                        className="flex-1 rounded-t-md transition-all"
                        style={{
                          height: `${(d.members / maxBar) * 170}px`,
                          background: isActive ? '#111111' : '#CCCCCC',
                        }}
                      />
                      <div
                        className="flex-1 rounded-t-md bg-sheet-border transition-all"
                        style={{ height: `${(d.bookings / maxBar) * 170}px` }}
                      />
                    </div>
                    <span className="text-[9px] text-ink-ghost">{d.m}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-ink">Pending Approvals</h3>
            <button className="btn btn-ghost p-1.5"><MoreHorizontal size={16} /></button>
          </div>
          <div className="space-y-3">
            {pendingApprovals.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-sheet flex items-center justify-center shrink-0 border border-sheet-border">
                  <span className="text-[11px] font-bold text-ink">
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink leading-tight">{p.name}</p>
                  <p className="text-[10px] text-ink-ghost leading-tight">{p.date}</p>
                </div>
                <span className="badge badge-neutral shrink-0 text-[10px]">Pending</span>
              </div>
            ))}
          </div>
          <a
            href="/members/pending"
            className="mt-4 block text-center text-xs text-ink-muted hover:text-ink font-medium pt-4 border-t border-sheet-border"
          >
            View all pending →
          </a>
        </div>
      </div>

      {/* Manage Members table */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="text-lg font-bold text-ink">Manage Members</h3>
          <div className="flex items-center gap-2">
            <button className="btn btn-outline h-9 text-sm gap-1.5">
              Status <ChevronDownIcon />
            </button>
            <a href="/members" className="btn btn-ink h-9 text-sm gap-1.5">
              View All <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-sheet-border">
                <th className="th w-8">
                  <input type="checkbox" className="rounded-md" />
                </th>
                <th className="th">Name</th>
                <th className="th">Tier</th>
                <th className="th">Location</th>
                <th className="th">Status</th>
                <th className="th">Joined</th>
                <th className="th"></th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={i} className="hover:bg-sheet/60 transition-colors">
                  <td className="td">
                    <input type="checkbox" className="rounded-md" />
                  </td>
                  <td className="td">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-sheet border border-sheet-border flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-ink">
                          {m.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-ink">{m.name}</span>
                    </div>
                  </td>
                  <td className="td">
                    <span className={`badge text-[10px] ${m.tier === 'Premium' ? 'badge-ink' : 'badge-neutral'}`}>
                      {m.tier}
                    </span>
                  </td>
                  <td className="td text-ink-muted">{m.location}</td>
                  <td className="td">
                    <span className={`badge text-[10px] ${statusBadge[m.status]}`}>
                      {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                    </span>
                  </td>
                  <td className="td text-ink-muted text-xs">{m.joined}</td>
                  <td className="td">
                    <button className="btn btn-ghost p-1"><MoreHorizontal size={15} /></button>
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

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
