import { Search, Eye, MoreHorizontal } from 'lucide-react'

const bookings = [
  { id: 'BK-1001', member: 'Ahmed Hassan',  class: 'Full Body HIIT',    trainer: 'Felix Wagner',  status: 'confirmed',  date: 'Apr 15, 2025 07:00', payment: 'paid'   },
  { id: 'BK-1002', member: 'Sara Ali',      class: 'Morning Yoga Flow', trainer: 'Rania Khalil',  status: 'pending',    date: 'Apr 15, 2025 06:30', payment: 'pending'},
  { id: 'BK-1003', member: 'Priya Sharma',  class: 'Cardio Blast',      trainer: 'Elena Popov',   status: 'checked_in', date: 'Apr 14, 2025 19:00', payment: 'paid'   },
  { id: 'BK-1004', member: 'James Okafor',  class: 'Power Lifting 101', trainer: 'Omar Siddiqui', status: 'cancelled',  date: 'Apr 14, 2025 18:00', payment: 'refunded'},
  { id: 'BK-1005', member: 'Layla Noor',    class: 'Core & Abs',        trainer: 'Felix Wagner',  status: 'no_show',    date: 'Apr 13, 2025 08:00', payment: 'paid'   },
  { id: 'BK-1006', member: 'Carlos Mendes', class: 'Morning Yoga Flow', trainer: 'Rania Khalil',  status: 'confirmed',  date: 'Apr 16, 2025 06:30', payment: 'pending'},
]

const statusBadge: Record<string,string> = {
  confirmed: 'badge-ok', pending: 'badge-warn',
  checked_in: 'badge-info', cancelled: 'badge-bad', no_show: 'badge-neutral',
}

const tabs = [
  { label: 'All',        count: 3572 },
  { label: 'Pending',    count: 128  },
  { label: 'Confirmed',  count: 2900 },
  { label: 'Checked In', count: 412  },
  { label: 'Cancelled',  count: 115  },
  { label: 'No Shows',   count: 17   },
]

export default function BookingsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-ink">Bookings</h1>
        <p className="text-sm text-ink-muted mt-0.5">All class bookings across the platform</p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t, i) => (
          <button
            key={t.label}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors border ${
              i === 0
                ? 'bg-ink text-white border-ink'
                : 'bg-white text-ink-muted border-sheet-border hover:border-ink hover:text-ink'
            }`}
          >
            {t.label}
            <span className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold ${i === 0 ? 'bg-white/20 text-white' : 'bg-sheet text-ink-muted'}`}>
              {t.count.toLocaleString()}
            </span>
          </button>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost" />
            <input className="input pl-8 h-9 text-sm" placeholder="Search bookings…" />
          </div>
          <input type="date" className="input h-9 w-auto text-sm py-0 ml-auto" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-sheet-border">
                <th className="th"><input type="checkbox" className="rounded-md" /></th>
                <th className="th">Booking ID</th>
                <th className="th">Member</th>
                <th className="th">Class</th>
                <th className="th">Trainer</th>
                <th className="th">Status</th>
                <th className="th">Date & Time</th>
                <th className="th">Payment</th>
                <th className="th text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-sheet/50 transition-colors">
                  <td className="td"><input type="checkbox" className="rounded-md" /></td>
                  <td className="td font-mono text-xs font-semibold text-ink">{b.id}</td>
                  <td className="td font-medium text-ink">{b.member}</td>
                  <td className="td text-ink-muted text-sm">{b.class}</td>
                  <td className="td text-ink-muted text-sm">{b.trainer}</td>
                  <td className="td">
                    <span className={`badge text-[10px] ${statusBadge[b.status]}`}>
                      {b.status.replace('_',' ').replace(/\b\w/g,l=>l.toUpperCase())}
                    </span>
                  </td>
                  <td className="td text-ink-ghost text-xs">{b.date}</td>
                  <td className="td">
                    <span className={`badge text-[10px] ${b.payment === 'paid' ? 'badge-ok' : b.payment === 'refunded' ? 'badge-info' : 'badge-warn'}`}>
                      {b.payment.charAt(0).toUpperCase() + b.payment.slice(1)}
                    </span>
                  </td>
                  <td className="td text-right">
                    <button className="btn btn-outline h-7 text-xs gap-1">
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-sheet-border">
          <p className="text-xs text-ink-muted">Showing 1–6 of 3,572 bookings</p>
          <div className="flex items-center gap-1">
            {['1','2','3','…','60'].map(p => (
              <button key={p} className={`w-8 h-8 rounded-xl text-sm font-medium transition-colors ${p === '1' ? 'bg-ink text-white' : 'hover:bg-sheet text-ink-muted'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
