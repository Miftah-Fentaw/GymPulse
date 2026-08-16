import {
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
  Dumbbell,
  FileText,
  Megaphone,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from 'lucide-react'

const stats = [
  {
    label: 'Total Users',
    value: '12,846',
    change: '+8.2%',
    up: true,
    icon: <Users size={20} className="text-brand" />,
    bg: 'bg-brand/10',
  },
  {
    label: 'Total Orders',
    value: '3,572',
    change: '+12.5%',
    up: true,
    icon: <ShoppingCart size={20} className="text-success" />,
    bg: 'bg-success/10',
  },
  {
    label: 'Products',
    value: '284',
    change: '+4.1%',
    up: true,
    icon: <Package size={20} className="text-warning" />,
    bg: 'bg-warning/10',
  },
  {
    label: 'Monthly Revenue',
    value: '$48,230',
    change: '-2.3%',
    up: false,
    icon: <TrendingUp size={20} className="text-danger" />,
    bg: 'bg-danger/10',
  },
]

const recentOrders = [
  { id: 'ORD-8821', user: 'Ahmed Hassan', product: 'Protein Shake 2kg', amount: '$89.00', status: 'delivered' },
  { id: 'ORD-8820', user: 'Sara Ali', product: 'Resistance Bands Set', amount: '$34.99', status: 'processing' },
  { id: 'ORD-8819', user: 'Mike Torres', product: 'Gym Gloves Pro', amount: '$24.50', status: 'pending' },
  { id: 'ORD-8818', user: 'Layla Noor', product: 'Smart Water Bottle', amount: '$45.00', status: 'delivered' },
  { id: 'ORD-8817', user: 'James Okafor', product: 'Foam Roller Elite', product2: 'Accessories', amount: '$32.00', status: 'cancelled' },
]

const statusBadge: Record<string, string> = {
  delivered: 'badge-success',
  processing: 'badge-info',
  pending: 'badge-warning',
  cancelled: 'badge-danger',
}

const recentUsers = [
  { name: 'Anya Petrova', email: 'anya@mail.com', tier: 'Premium', joined: '2 min ago', avatar: 'AP' },
  { name: 'Carlos Mendes', email: 'carlos@mail.com', tier: 'Basic', joined: '18 min ago', avatar: 'CM' },
  { name: 'Priya Sharma', email: 'priya@mail.com', tier: 'Premium', joined: '1h ago', avatar: 'PS' },
  { name: 'Luca Ferrari', email: 'luca@mail.com', tier: 'Basic', joined: '2h ago', avatar: 'LF' },
]

const contentSummary = [
  { label: 'Published Workouts', value: 128, icon: <Dumbbell size={16} className="text-brand" /> },
  { label: 'Active Programs', value: 32, icon: <FileText size={16} className="text-success" /> },
  { label: 'Content Posts', value: 74, icon: <FileText size={16} className="text-warning" /> },
  { label: 'Announcements', value: 5, icon: <Megaphone size={16} className="text-danger" /> },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Welcome back, Super Admin. Here's what's happening.</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="input h-9 w-auto text-sm py-0">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
              {s.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              <p className="text-2xl font-bold text-slate-800 mt-0.5">{s.value}</p>
              <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${s.up ? 'text-success' : 'text-danger'}`}>
                {s.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                <span>{s.change} vs last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Monthly target gauge card */}
        <div className="card flex flex-col items-center justify-center text-center py-8 gap-4">
          <div>
            <p className="font-semibold text-slate-700">Monthly Revenue Target</p>
            <p className="text-xs text-slate-400 mt-0.5">Track progress for this month</p>
          </div>
          {/* SVG gauge */}
          <div className="relative w-40 h-20 overflow-hidden">
            <svg viewBox="0 0 200 100" className="w-full">
              <path d="M10,100 A90,90 0 0,1 190,100" fill="none" stroke="#E2E8F0" strokeWidth="16" strokeLinecap="round" />
              <path
                d="M10,100 A90,90 0 0,1 190,100"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset="70"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
              <span className="text-2xl font-bold text-slate-800">75.5%</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 w-full mt-2">
            <div className="text-center">
              <p className="text-xs text-slate-400">Target</p>
              <p className="font-bold text-slate-700 text-sm">$64K</p>
            </div>
            <div className="text-center border-x border-surface-border">
              <p className="text-xs text-slate-400">Earned</p>
              <p className="font-bold text-success text-sm">$48K</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-400">Left</p>
              <p className="font-bold text-warning text-sm">$16K</p>
            </div>
          </div>
        </div>

        {/* Content summary */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-slate-700">Content Summary</p>
            <button className="btn btn-ghost p-1"><MoreHorizontal size={16} /></button>
          </div>
          <div className="space-y-3">
            {contentSummary.map((c) => (
              <div key={c.label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center shrink-0">
                  {c.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">{c.label}</span>
                    <span className="text-sm font-semibold text-slate-800">{c.value}</span>
                  </div>
                  <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand rounded-full"
                      style={{ width: `${Math.min((c.value / 150) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent users */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-slate-700">New Users</p>
            <a href="/users" className="text-xs text-brand hover:underline">View all</a>
          </div>
          <div className="space-y-3">
            {recentUsers.map((u) => (
              <div key={u.email} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-brand">{u.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{u.name}</p>
                  <p className="text-xs text-slate-400 truncate">{u.email}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`badge ${u.tier === 'Premium' ? 'badge-info' : 'badge-neutral'} text-[10px]`}>
                    {u.tier}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{u.joined}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders table */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <p className="font-semibold text-slate-700">Recent Orders</p>
          <div className="flex items-center gap-2">
            <button className="btn btn-outline h-8 text-xs gap-1.5">
              Filter
            </button>
            <a href="/shop/orders" className="btn btn-primary h-8 text-xs">
              View All
            </a>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">Order</th>
                <th className="table-th">Customer</th>
                <th className="table-th">Product</th>
                <th className="table-th">Amount</th>
                <th className="table-th">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-surface/50 transition-colors">
                  <td className="table-td font-medium text-brand">{o.id}</td>
                  <td className="table-td">{o.user}</td>
                  <td className="table-td text-slate-500">{o.product}</td>
                  <td className="table-td font-semibold">{o.amount}</td>
                  <td className="table-td">
                    <span className={`badge ${statusBadge[o.status]}`}>
                      {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                    </span>
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
