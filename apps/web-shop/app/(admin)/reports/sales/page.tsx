import { TrendingUp, ShoppingCart, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const monthly = [
  { month: 'Jan', revenue: 32000, orders: 210, avgOrder: 152 },
  { month: 'Feb', revenue: 38000, orders: 260, avgOrder: 146 },
  { month: 'Mar', revenue: 41000, orders: 290, avgOrder: 141 },
  { month: 'Apr', revenue: 44000, orders: 310, avgOrder: 142 },
  { month: 'May', revenue: 45000, orders: 335, avgOrder: 134 },
  { month: 'Jun', revenue: 47000, orders: 352, avgOrder: 133 },
  { month: 'Jul', revenue: 48230, orders: 380, avgOrder: 127 },
]
const max = Math.max(...monthly.map(m => m.revenue))

const topByRevenue = [
  { name: 'Whey Protein 2kg',    revenue: '$8,900', orders: 100, trend: '+12%', up: true  },
  { name: 'Pre-Workout Formula', revenue: '$6,600', orders: 120, trend: '+8%',  up: true  },
  { name: 'Smart Water Bottle',  revenue: '$5,400', orders: 120, trend: '+22%', up: true  },
  { name: 'Foam Roller Elite',   revenue: '$3,200', orders: 100, trend: '-4%',  up: false },
  { name: 'Gym Gloves Pro',      revenue: '$2,450', orders: 100, trend: '+1%',  up: true  },
]

export default function SalesReportPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Sales Report</h1>
        <p className="text-sm text-gray-400 mt-0.5">Revenue and order performance overview</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue',   value: '$48,230', change: '+8%',  up: true,  icon: <DollarSign size={18} className="text-brand" />,   bg: 'bg-brand/10' },
          { label: 'Total Orders',    value: '3,572',   change: '+12%', up: true,  icon: <ShoppingCart size={18} className="text-success" />, bg: 'bg-success/10' },
          { label: 'Avg Order Value', value: '$134',    change: '-5%',  up: false, icon: <TrendingUp size={18} className="text-warning" />,  bg: 'bg-warning/10' },
          { label: 'Return Rate',     value: '3.2%',    change: '-1%',  up: true,  icon: <TrendingUp size={18} className="text-teal" />,     bg: 'bg-teal-light' },
        ].map(s => (
          <div key={s.label} className="card flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>{s.icon}</div>
            <div>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-lg font-bold text-gray-800">{s.value}</p>
              <div className={`flex items-center gap-0.5 text-[11px] font-semibold ${s.up ? 'text-success' : 'text-danger'}`}>
                {s.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />} {s.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue trend */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <p className="font-semibold text-gray-700">Monthly Revenue Trend</p>
          <select className="input h-8 w-auto text-xs py-0 bg-surface">
            <option>This Year</option>
          </select>
        </div>
        <div className="flex items-end gap-3 h-36">
          <div className="flex flex-col justify-between text-[10px] text-gray-400 text-right pr-2 shrink-0 h-full">
            {['50K','40K','30K','20K','10K','0'].map(l => <span key={l}>{l}</span>)}
          </div>
          <div className="flex-1 flex items-end gap-2 h-full">
            {monthly.map((m, i) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t-lg transition-all ${i === monthly.length - 1 ? 'bg-brand' : 'bg-brand/30'}`}
                  style={{ height: `${(m.revenue / max) * 100}%` }}
                />
                <span className="text-[9px] text-gray-400">{m.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top products */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-border">
          <p className="font-semibold text-sm text-gray-700">Top Products by Revenue</p>
        </div>
        <table className="w-full">
          <thead className="bg-surface">
            <tr>
              <th className="th">Product</th>
              <th className="th">Revenue</th>
              <th className="th">Orders</th>
              <th className="th">Trend</th>
            </tr>
          </thead>
          <tbody>
            {topByRevenue.map((p, i) => (
              <tr key={i} className="hover:bg-surface/60 transition-colors">
                <td className="td font-medium text-xs text-gray-800">{p.name}</td>
                <td className="td font-bold text-gray-800">{p.revenue}</td>
                <td className="td text-gray-500">{p.orders}</td>
                <td className="td">
                  <span className={`flex items-center gap-0.5 text-xs font-semibold ${p.up ? 'text-success' : 'text-danger'}`}>
                    {p.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {p.trend}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
