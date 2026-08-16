import { Plus, Search, Pencil, Trash2, ShieldCheck, ShoppingBag, Dumbbell } from 'lucide-react'

const admins = [
  { id: '1', name: 'Rania Khalil', email: 'rania@gympulse.app', role: 'super_admin', status: 'active', created: 'Jan 1, 2025' },
  { id: '2', name: 'Omar Siddiqui', email: 'omar@gympulse.app', role: 'user_admin', status: 'active', created: 'Jan 15, 2025' },
  { id: '3', name: 'Elena Popov', email: 'elena@gympulse.app', role: 'shop_admin', status: 'active', created: 'Feb 2, 2025' },
  { id: '4', name: 'Felix Wagner', email: 'felix@gympulse.app', role: 'sport_admin', status: 'active', created: 'Feb 20, 2025' },
  { id: '5', name: 'Nia Williams', email: 'nia@gympulse.app', role: 'shop_admin', status: 'inactive', created: 'Mar 1, 2025' },
]

const roleConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  super_admin:  { label: 'Super Admin', color: 'bg-brand/10 text-brand', icon: <ShieldCheck size={12} /> },
  user_admin:   { label: 'User Admin', color: 'bg-success/10 text-success', icon: <ShieldCheck size={12} /> },
  shop_admin:   { label: 'Shop Admin', color: 'bg-warning/10 text-warning', icon: <ShoppingBag size={12} /> },
  sport_admin:  { label: 'Sport Admin', color: 'bg-purple-100 text-purple-600', icon: <Dumbbell size={12} /> },
}

export default function AdminsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Admin Accounts</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage admin accounts and role assignments</p>
        </div>
        <a href="/admins/create" className="btn btn-primary h-9 text-sm">
          <Plus size={16} />
          Create Admin
        </a>
      </div>

      {/* Role overview cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(roleConfig).map(([key, cfg]) => (
          <div key={key} className="card py-4 text-center">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color} mb-2`}>
              {cfg.icon}
              {cfg.label}
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {admins.filter(a => a.role === key).length}
            </p>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-8 h-9 text-sm" placeholder="Search admins..." />
          </div>
          <select className="input h-9 w-auto text-sm py-0 ml-auto">
            <option>All Roles</option>
            <option>super_admin</option>
            <option>user_admin</option>
            <option>shop_admin</option>
            <option>sport_admin</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">Admin</th>
                <th className="table-th">Role</th>
                <th className="table-th">Status</th>
                <th className="table-th">Created</th>
                <th className="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => {
                const cfg = roleConfig[a.role]
                return (
                  <tr key={a.id} className="hover:bg-surface/40 transition-colors">
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sidebar-bg flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-white">
                            {a.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{a.name}</p>
                          <p className="text-xs text-slate-400">{a.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-td">
                      <span className={`inline-flex items-center gap-1 badge ${cfg.color}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </td>
                    <td className="table-td">
                      <span className={`badge ${a.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                        {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                      </span>
                    </td>
                    <td className="table-td text-slate-400">{a.created}</td>
                    <td className="table-td text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="btn btn-ghost p-1.5" title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button className="btn btn-ghost p-1.5 text-danger hover:bg-danger-light" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
