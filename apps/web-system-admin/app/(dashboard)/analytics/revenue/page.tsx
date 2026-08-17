import { DollarSign, TrendingUp, ShoppingCart, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const monthly = [
  { m: 'Jan', shop: 32000, premium: 52000 }, { m: 'Feb', shop: 38000, premium: 55000 },
  { m: 'Mar', shop: 41000, premium: 57000 }, { m: 'Apr', shop: 44000, premium: 60000 },
  { m: 'May', shop: 45000, premium: 63000 }, { m: 'Jun', shop: 47000, premium: 65000 },
  { m: 'Jul', shop: 48230, premium: 69665 }, { m: 'Aug', shop: 51000, premium: 72000 },
]
const max = Math.max(...monthly.map(d => d.shop + d.premium))

const topProducts = [
  { name: 'Whey Protein 2kg',    revenue: 8900,  growth: 12  },
  { name: 'Pre-Workout Formula', revenue: 6600,  growth: 8   },
  { name: 'Smart Water Bottle',  revenue: 5400,  growth: 22  },
  { name: 'Foam Roller Elite',   revenue: 3200,  growth: -4  },
]

export default function RevenueAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Revenue Analytics</h1>
        <p className="text-sm text-slate-500 mt-0.5">Combined shop and subscription revenue overview</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue',  value: '$117.9K', change: '+10.2%', up: true,  icon: <DollarSign size={17} />, bg: 'bg-brand/10 text-brand' },
          { label: 'Shop Revenue',   value: '$48.2K',  change: '+8.1%',  up: true,  icon: <ShoppingCart size={17} />, bg: 'bg-success/10 text-success' },
          { label: 'Subscriptions',  value: '$69.7K',  change: '+12.4%', up: true,  icon: <TrendingUp size={17} />, bg: 'bg-warning/10 text-warning' },
          { label: 'Avg Order Value','value': '$134',  change: '-3.2%',  up: false, icon: <DollarSign size={17} />, bg: 'bg-danger/10 text-danger' },
        ].map(s => (
          <div key={s.label} className="card flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>{s.icon}</div>
            <div>
              <p className="text-xs text-slate-400">{s.label}</p>
              <p className="text-lg font-bold text-slate-800">{s.value}</p>
              <div className={`flex items-center gap-0.5 text-[11px] font-semibold ${s.up ? 'text-success' : 'text-danger'}`}>
                {s.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />} {s.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stacked bar chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <p className="font-semibold text-slate-700">Monthly Revenue Breakdown</p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-brand/80 inline-block" /> Shop</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-success/60 inline-block" /> Premium</span>
          </div>
        </div>
        <div className="flex items-end gap-3 h-44">
          <div className="flex flex-col justify-between text-[10px] text-slate-400 text-right pr-2 shrink-0">
            {['120K','90K','60K','30K','0'].map(l => <span key={l}>{l}</span>)}
          </div>
          <div className="flex-1 flex items-end gap-2">
            {monthly.map((d, i) => {
              const total = d.shop + d.premium
              const h = (total / max) * 160
              return (
                <div key={d.m} className="flex-1 flex flex-col items-center gap-0.5">
                  <div className="w-full flex flex-col" style={{ height: `${h}px` }}>
                    <div className="flex-1 bg-success/60 rounded-t-md" style={{ flex: d.premium }} />
                    <div className="bg-brand/80" style={{ flex: d.shop, borderRadius: d.premium ? 0 : '4px 4px 0 0' }} />
                  </div>
                  <span className="text-[9px] text-slate-400">{d.m}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Top products */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-border">
          <p className="font-semibold text-slate-700">Top Revenue Products</p>
        </div>
        <table className="w-full">
          <thead>
            <tr><th className="table-th">Product</th><th className="table-th">Revenue</th><th className="table-th">Growth</th></tr>
          </thead>
          <tbody>
            {topProducts.map(p => (
              <tr key={p.name} className="hover:bg-surface/40 transition-colors">
                <td className="table-td font-medium text-slate-800">{p.name}</td>
                <td className="table-td font-bold">${p.revenue.toLocaleString()}</td>
                <td className="table-td">
                  <span className={`flex items-center gap-0.5 text-xs font-semibold ${p.growth >= 0 ? 'text-success' : 'text-danger'}`}>
                    {p.growth >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(p.growth)}%
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
