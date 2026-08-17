import { Search, ShieldOff, Eye } from 'lucide-react'

const bannedUsers = [
  { id: '1', name: 'Mike Torres',   email: 'mike@mail.com',  tier: 'Premium', banned: 'Dec 20, 2024', reason: 'Abusive behaviour',        orders: 8  },
  { id: '2', name: 'Rex Oduya',     email: 'rex@mail.com',   tier: 'Basic',   banned: 'Jan 5, 2025',  reason: 'Fraudulent order',          orders: 2  },
  { id: '3', name: 'Tasha Belova',  email: 'tasha@mail.com', tier: 'Basic',   banned: 'Feb 14, 2025', reason: 'Repeated chargebacks',      orders: 1  },
  { id: '4', name: 'Karim Najjar',  email: 'karim@mail.com', tier: 'Premium', banned: 'Mar 3, 2025',  reason: 'Harassment of other users', orders: 5  },
]

export default function BannedUsersPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
          <ShieldOff size={20} className="text-danger" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Banned Users</h1>
          <p className="text-sm text-slate-500 mt-0.5">{bannedUsers.length} users currently restricted</p>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-8 h-9 text-sm" placeholder="Search banned users…" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">User</th>
                <th className="table-th">Tier</th>
                <th className="table-th">Banned On</th>
                <th className="table-th">Reason</th>
                <th className="table-th">Orders</th>
                <th className="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bannedUsers.map(u => (
                <tr key={u.id} className="hover:bg-surface/40 transition-colors">
                  <td className="table-td">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-danger">
                          {u.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-td">
                    <span className={`badge ${u.tier === 'Premium' ? 'badge-info' : 'badge-neutral'}`}>{u.tier}</span>
                  </td>
                  <td className="table-td text-slate-500">{u.banned}</td>
                  <td className="table-td text-slate-500">{u.reason}</td>
                  <td className="table-td">{u.orders}</td>
                  <td className="table-td text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="btn btn-ghost p-1.5"><Eye size={14} /></button>
                      <button className="btn btn-outline h-8 text-xs text-success border-success hover:bg-success/10">Unban</button>
                    </div>
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
