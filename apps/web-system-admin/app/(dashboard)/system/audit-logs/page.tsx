import { Search, Filter } from 'lucide-react'

const logs = [
  { id: '1', admin: 'Super Admin', email: 'admin@gympulse.app', action: 'DELETE_USER', resource: 'User #usr-8821', ip: '192.168.1.1', time: '2025-04-14 10:32:01' },
  { id: '2', admin: 'Rania Khalil', email: 'rania@gympulse.app', action: 'CREATE_ADMIN', resource: 'Admin #adm-005', ip: '10.0.0.5', time: '2025-04-14 09:15:44' },
  { id: '3', admin: 'Omar Siddiqui', email: 'omar@gympulse.app', action: 'BAN_USER', resource: 'User #usr-3391', ip: '172.16.0.2', time: '2025-04-13 17:08:22' },
  { id: '4', admin: 'Elena Popov', email: 'elena@gympulse.app', action: 'DELETE_PRODUCT', resource: 'Product #prod-012', ip: '10.0.0.12', time: '2025-04-13 14:22:11' },
  { id: '5', admin: 'Super Admin', email: 'admin@gympulse.app', action: 'UPDATE_SETTINGS', resource: 'Setting: maintenance_mode', ip: '192.168.1.1', time: '2025-04-12 08:00:00' },
  { id: '6', admin: 'Felix Wagner', email: 'felix@gympulse.app', action: 'PUBLISH_WORKOUT', resource: 'Workout #wkt-088', ip: '10.0.0.8', time: '2025-04-11 11:44:56' },
]

const actionColor: Record<string, string> = {
  DELETE_USER: 'badge-danger',
  BAN_USER: 'badge-warning',
  CREATE_ADMIN: 'badge-info',
  DELETE_PRODUCT: 'badge-danger',
  UPDATE_SETTINGS: 'badge-neutral',
  PUBLISH_WORKOUT: 'badge-success',
}

export default function AuditLogsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Audit Logs</h1>
        <p className="text-sm text-slate-500 mt-0.5">All admin actions recorded for accountability</p>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-8 h-9 text-sm" placeholder="Search logs..." />
          </div>
          <select className="input h-9 w-auto text-sm py-0 ml-auto">
            <option>All Actions</option>
            <option>DELETE_USER</option>
            <option>BAN_USER</option>
            <option>CREATE_ADMIN</option>
            <option>UPDATE_SETTINGS</option>
            <option>PUBLISH_WORKOUT</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">Admin</th>
                <th className="table-th">Action</th>
                <th className="table-th">Resource</th>
                <th className="table-th">IP Address</th>
                <th className="table-th">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-surface/40 transition-colors">
                  <td className="table-td">
                    <p className="font-medium text-slate-800">{l.admin}</p>
                    <p className="text-xs text-slate-400">{l.email}</p>
                  </td>
                  <td className="table-td">
                    <span className={`badge font-mono text-[11px] ${actionColor[l.action] ?? 'badge-neutral'}`}>
                      {l.action}
                    </span>
                  </td>
                  <td className="table-td text-slate-500 font-mono text-xs">{l.resource}</td>
                  <td className="table-td text-slate-400 font-mono text-xs">{l.ip}</td>
                  <td className="table-td text-slate-400 text-xs">{l.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-surface-border">
          <p className="text-sm text-slate-500">Showing 1–6 of 10,482 log entries</p>
          <div className="flex items-center gap-1">
            {['1','2','3','...','100'].map((p) => (
              <button
                key={p}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === '1' ? 'bg-brand text-white' : 'hover:bg-surface text-slate-600'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
