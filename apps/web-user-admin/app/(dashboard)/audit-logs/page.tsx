import { Search } from 'lucide-react'

const logs = [
  { admin: 'User Admin', action: 'BAN_MEMBER',      resource: 'Member #usr-3391', ip: '10.0.0.5',   time: '2025-04-14 10:32:01' },
  { admin: 'User Admin', action: 'APPROVE_MEMBER',  resource: 'Member #usr-8821', ip: '10.0.0.5',   time: '2025-04-14 09:15:44' },
  { admin: 'User Admin', action: 'CANCEL_BOOKING',  resource: 'Booking #BK-1004', ip: '172.16.0.2', time: '2025-04-13 17:08:22' },
  { admin: 'User Admin', action: 'CREATE_CLASS',    resource: 'Class #cls-088',   ip: '10.0.0.5',   time: '2025-04-13 14:22:11' },
  { admin: 'User Admin', action: 'DELETE_MEMBER',   resource: 'Member #usr-0912', ip: '10.0.0.5',   time: '2025-04-12 08:00:00' },
  { admin: 'User Admin', action: 'UPDATE_TRAINER',  resource: 'Trainer #tr-004',  ip: '10.0.0.5',   time: '2025-04-11 11:44:56' },
]

const actionBadge: Record<string,string> = {
  BAN_MEMBER: 'badge-bad', DELETE_MEMBER: 'badge-bad',
  APPROVE_MEMBER: 'badge-ok', CREATE_CLASS: 'badge-info',
  CANCEL_BOOKING: 'badge-warn', UPDATE_TRAINER: 'badge-neutral',
}

export default function AuditLogsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-ink">Audit Logs</h1>
        <p className="text-sm text-ink-muted mt-0.5">All admin actions recorded</p>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost" />
            <input className="input pl-8 h-9 text-sm" placeholder="Search logs…" />
          </div>
          <select className="input h-9 w-auto text-sm py-0 ml-auto">
            <option>All Actions</option>
            <option>BAN_MEMBER</option>
            <option>APPROVE_MEMBER</option>
            <option>CREATE_CLASS</option>
            <option>CANCEL_BOOKING</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-sheet-border">
                <th className="th">Admin</th>
                <th className="th">Action</th>
                <th className="th">Resource</th>
                <th className="th">IP Address</th>
                <th className="th">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l, i) => (
                <tr key={i} className="hover:bg-sheet/50 transition-colors">
                  <td className="td font-medium text-ink">{l.admin}</td>
                  <td className="td">
                    <span className={`badge font-mono text-[10px] ${actionBadge[l.action] ?? 'badge-neutral'}`}>
                      {l.action}
                    </span>
                  </td>
                  <td className="td font-mono text-xs text-ink-muted">{l.resource}</td>
                  <td className="td font-mono text-xs text-ink-ghost">{l.ip}</td>
                  <td className="td text-xs text-ink-ghost">{l.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-sheet-border">
          <p className="text-xs text-ink-muted">Showing 1–6 of 4,821 entries</p>
          <div className="flex items-center gap-1">
            {['1','2','3','…','80'].map(p => (
              <button key={p} className={`w-8 h-8 rounded-xl text-sm font-medium transition-colors ${p === '1' ? 'bg-ink text-white' : 'hover:bg-sheet text-ink-muted'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
