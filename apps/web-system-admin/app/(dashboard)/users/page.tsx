import { Search, Filter, MoreHorizontal, Ban, Trash2, Eye } from 'lucide-react'

const users = [
  { id: '1', name: 'Ahmed Hassan', email: 'ahmed@mail.com', tier: 'Premium', status: 'active', joined: 'Jan 12, 2025', orders: 14 },
  { id: '2', name: 'Sara Ali', email: 'sara@mail.com', tier: 'Basic', status: 'active', joined: 'Feb 3, 2025', orders: 3 },
  { id: '3', name: 'Mike Torres', email: 'mike@mail.com', tier: 'Premium', status: 'banned', joined: 'Dec 20, 2024', orders: 8 },
  { id: '4', name: 'Layla Noor', email: 'layla@mail.com', tier: 'Basic', status: 'active', joined: 'Mar 1, 2025', orders: 1 },
  { id: '5', name: 'James Okafor', email: 'james@mail.com', tier: 'Premium', status: 'active', joined: 'Nov 5, 2024', orders: 22 },
  { id: '6', name: 'Priya Sharma', email: 'priya@mail.com', tier: 'Basic', status: 'active', joined: 'Apr 7, 2025', orders: 5 },
  { id: '7', name: 'Carlos Mendes', email: 'carlos@mail.com', tier: 'Premium', status: 'active', joined: 'Apr 9, 2025', orders: 0 },
]

export default function UsersPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">App Users</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage all registered users on the platform</p>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-8 h-9 text-sm" placeholder="Search users..." />
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
              <option>Banned</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">User</th>
                <th className="table-th">Tier</th>
                <th className="table-th">Status</th>
                <th className="table-th">Orders</th>
                <th className="table-th">Joined</th>
                <th className="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-surface/40 transition-colors">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-brand">
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
                    <span className={`badge ${u.tier === 'Premium' ? 'badge-info' : 'badge-neutral'}`}>
                      {u.tier}
                    </span>
                  </td>
                  <td className="table-td">
                    <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                      {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                    </span>
                  </td>
                  <td className="table-td font-medium">{u.orders}</td>
                  <td className="table-td text-slate-400">{u.joined}</td>
                  <td className="table-td text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="btn btn-ghost p-1.5" title="View">
                        <Eye size={15} />
                      </button>
                      <button className="btn btn-ghost p-1.5 text-warning hover:bg-warning-light" title="Ban">
                        <Ban size={15} />
                      </button>
                      <button className="btn btn-ghost p-1.5 text-danger hover:bg-danger-light" title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-surface-border">
          <p className="text-sm text-slate-500">Showing 1–7 of 12,846 users</p>
          <div className="flex items-center gap-1">
            {['1','2','3','...','10'].map((p) => (
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
