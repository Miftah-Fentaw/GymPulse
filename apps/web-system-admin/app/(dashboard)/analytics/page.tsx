import {
  Users, ShoppingCart, TrendingUp, Activity,
  ArrowUpRight, BarChart2
} from 'lucide-react'

const monthlyData = [
  { month: 'Oct', users: 8200, orders: 1800, revenue: 32000 },
  { month: 'Nov', users: 9100, orders: 2100, revenue: 38000 },
  { month: 'Dec', users: 10400, orders: 2800, revenue: 44000 },
  { month: 'Jan', users: 10900, orders: 2500, revenue: 41000 },
  { month: 'Feb', users: 11200, orders: 2900, revenue: 45000 },
  { month: 'Mar', users: 11800, orders: 3100, revenue: 47000 },
  { month: 'Apr', users: 12846, orders: 3572, revenue: 48230 },
]

const maxRevenue = Math.max(...monthlyData.map(d => d.revenue))
const maxUsers = Math.max(...monthlyData.map(d => d.users))

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Platform Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">Historical performance across key metrics</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '12,846', change: '+8.2%', icon: <Users size={18} className="text-brand" />, bg: 'bg-brand/10' },
          { label: 'Total Orders', value: '3,572', change: '+12.5%', icon: <ShoppingCart size={18} className="text-success" />, bg: 'bg-success/10' },
          { label: 'Total Revenue', value: '$48.2K', change: '+5.1%', icon: <TrendingUp size={18} className="text-warning" />, bg: 'bg-warning/10' },
          { label: 'Avg Session', value: '8.4 min', change: '+1.2%', icon: <Activity size={18} className="text-purple-500" />, bg: 'bg-purple-100' },
        ].map((kpi) => (
          <div key={kpi.label} className="card flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${kpi.bg}`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-xs text-slate-400">{kpi.label}</p>
              <p className="text-lg font-bold text-slate-800">{kpi.value}</p>
              <div className="flex items-center gap-1 text-xs text-success font-medium">
                <ArrowUpRight size={12} />
                {kpi.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue bar chart (CSS only) */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-semibold text-slate-700">Monthly Revenue</p>
            <p className="text-xs text-slate-400 mt-0.5">Last 7 months</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <BarChart2 size={14} />
            USD
          </div>
        </div>
        <div className="flex items-end gap-3 h-40">
          {monthlyData.map((d, i) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-slate-500 font-medium">
                ${(d.revenue / 1000).toFixed(0)}K
              </span>
              <div
                className={`w-full rounded-t-md transition-all ${i === monthlyData.length - 1 ? 'bg-brand' : 'bg-brand/30'}`}
                style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
              />
              <span className="text-[10px] text-slate-400">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* User growth + Orders side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* User growth */}
        <div className="card">
          <p className="font-semibold text-slate-700 mb-6">User Growth</p>
          <div className="flex items-end gap-3 h-32">
            {monthlyData.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t-md ${i === monthlyData.length - 1 ? 'bg-success' : 'bg-success/30'}`}
                  style={{ height: `${(d.users / maxUsers) * 100}%` }}
                />
                <span className="text-[10px] text-slate-400">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders */}
        <div className="card">
          <p className="font-semibold text-slate-700 mb-4">Orders by Status</p>
          <div className="space-y-3 mt-2">
            {[
              { label: 'Delivered', count: 2940, pct: 82, color: 'bg-success' },
              { label: 'Processing', count: 84, pct: 2, color: 'bg-brand' },
              { label: 'Pending', count: 128, pct: 4, color: 'bg-warning' },
              { label: 'Cancelled', count: 420, pct: 12, color: 'bg-danger' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-20 shrink-0">{s.label}</span>
                <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                </div>
                <span className="text-xs font-medium text-slate-700 w-12 text-right">{s.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
