import {
  ShoppingBag, CreditCard, TrendingUp, DollarSign,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, ImageOff,
  Package, AlertTriangle,
} from 'lucide-react'

/* ─── Stat cards ─────────────────────────────────────────────────────────── */
const statCards = [
  {
    label: 'Total Sales',
    value: '$48,230',
    change: '+8% since last month',
    up: true,
    icon: <ShoppingBag size={20} className="text-white" />,
    gradient: 'from-orange-400 to-brand',
  },
  {
    label: 'Total Purchase',
    value: '$18,450',
    change: '+22% since last month',
    up: true,
    icon: <Package size={20} className="text-white" />,
    gradient: 'from-emerald-400 to-teal-500',
  },
  {
    label: 'Total Expenses',
    value: '$9,120',
    change: '+18% since last month',
    up: true,
    icon: <CreditCard size={20} className="text-white" />,
    gradient: 'from-blue-400 to-indigo-500',
  },
  {
    label: 'Invoice Due',
    value: '$3,600',
    change: '-35% since last month',
    up: false,
    icon: <DollarSign size={20} className="text-white" />,
    gradient: 'from-yellow-400 to-amber-500',
  },
]

/* ─── Summary metrics ───────────────────────────────────────────────────── */
const summaryMetrics = [
  { label: 'Total Profit',          value: '$25,458', change: '+35% vs Last Month', up: true },
  { label: 'Total Payment Returns', value: '$45,458', change: '-20% vs Last Month', up: false },
  { label: 'Total Expenses',        value: '$34,458', change: '-10% vs Last Month', up: false },
]

/* ─── Bar chart data (monthly revenue) ─────────────────────────────────── */
const barData = [
  { month: 'Jan', sales: 3800, purchase: 2100 },
  { month: 'Feb', sales: 5200, purchase: 2800 },
  { month: 'Mar', sales: 4100, purchase: 3100 },
  { month: 'Apr', sales: 6300, purchase: 3500 },
  { month: 'May', sales: 5500, purchase: 2900 },
  { month: 'Jun', sales: 7200, purchase: 4200 },
  { month: 'Jul', sales: 6800, purchase: 3800 },
  { month: 'Aug', sales: 8100, purchase: 4500 },
  { month: 'Sep', sales: 7400, purchase: 4000 },
  { month: 'Oct', sales: 9200, purchase: 5100 },
  { month: 'Nov', sales: 8600, purchase: 4800 },
  { month: 'Dec', sales: 10500, purchase: 5900 },
]
const maxBar = Math.max(...barData.map(d => d.sales))

/* ─── Top selling products ──────────────────────────────────────────────── */
const topProducts = [
  { name: 'Whey Protein 2kg',       price: '$89', units: '1,250 units', change: '+8%',  up: true  },
  { name: 'Gaming Joy Stick',       price: '$49', units: '6,420 units', change: '-10%', up: false },
  { name: 'Smart Watch Pack',       price: '$98', units: '862 units',   change: '+28%', up: true  },
  { name: 'USB-C Fast Charger',     price: '$35', units: '2,200 units', change: '+26%', up: true  },
  { name: 'Portable BT Speaker',   price: '$65', units: '2,910 units', change: '+25%', up: true  },
]

/* ─── Low stock products ─────────────────────────────────────────────────── */
const lowStock = [
  { name: 'Resistance Bands',  sku: '#954433', stock: 6 },
  { name: 'USB-C Cable Pack',  sku: '#887766', stock: 9 },
  { name: 'Phone Screen Protector', sku: '#532211', stock: 3 },
  { name: 'Portable Charger 20000mAh', sku: '#998877', stock: 7 },
  { name: 'Mechanical Keyboard RGB',   sku: '#005544', stock: 2 },
]

/* ─── Recent sales ──────────────────────────────────────────────────────── */
const recentSales = [
  { product: 'Whey Protein 2kg',  category: 'Supplements', price: '$89',  status: 'delivered' },
  { product: 'AirPods Pro Max',   category: 'Audio',       price: '$549', status: 'processing' },
  { product: 'iPad Air 13"',      category: 'Tablets',     price: '$759', status: 'delivered' },
  { product: 'Apple Watch Ultra', category: 'Wearables',   price: '$799', status: 'pending' },
  { product: 'Magic Keyboard',    category: 'Accessories', price: '$209', status: 'cancelled' },
]

const statusBadge: Record<string, string> = {
  delivered:  'badge-success',
  processing: 'badge-info',
  pending:    'badge-warning',
  cancelled:  'badge-danger',
}

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  return (
    <div className="space-y-5">
      {/* Page heading */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Your main content goes here…</p>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div
            key={s.label}
            className={`rounded-2xl p-5 bg-gradient-to-br ${s.gradient} text-white shadow-card`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                {s.icon}
              </div>
            </div>
            <p className="text-xs font-medium opacity-80">{s.label}</p>
            <p className="text-2xl font-bold mt-0.5">{s.value}</p>
            <div className={`flex items-center gap-1 text-xs mt-1.5 opacity-90 font-medium`}>
              {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* ── Summary metrics ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryMetrics.map(m => (
          <div key={m.label} className="card">
            <p className="text-2xl font-bold text-gray-800">{m.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{m.label}</p>
            <div className={`flex items-center gap-1 text-xs font-semibold mt-2 ${m.up ? 'text-success' : 'text-danger'}`}>
              {m.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {m.change}
              <a href="#" className="ml-auto text-gray-400 hover:text-brand font-normal">View</a>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts row ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Sales vs Purchase bar chart */}
        <div className="card xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <p className="font-semibold text-gray-700">Sales vs Purchase</p>
            <select className="input h-8 w-auto text-xs py-0 bg-surface">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>

          {/* Y-axis labels + bars */}
          <div className="flex gap-3 h-44">
            {/* Y labels */}
            <div className="flex flex-col justify-between text-[10px] text-gray-400 text-right pr-1 shrink-0">
              {['120k','100k','80k','60k','40k','20k','0'].map(l => <span key={l}>{l}</span>)}
            </div>
            {/* Bar columns */}
            <div className="flex-1 flex items-end gap-1.5">
              {barData.map(d => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-0.5">
                  <div className="w-full flex items-end gap-0.5">
                    <div
                      className="flex-1 rounded-t-sm bg-brand/80 transition-all"
                      style={{ height: `${(d.sales / maxBar) * 150}px` }}
                      title={`Sales $${d.sales}`}
                    />
                    <div
                      className="flex-1 rounded-t-sm bg-teal/60 transition-all"
                      style={{ height: `${(d.purchase / maxBar) * 150}px` }}
                      title={`Purchase $${d.purchase}`}
                    />
                  </div>
                  <span className="text-[9px] text-gray-400">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-3 h-3 rounded-sm bg-brand/80 inline-block" /> Sales
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-3 h-3 rounded-sm bg-teal/60 inline-block" /> Purchase
            </span>
          </div>
        </div>

        {/* Overall info panel */}
        <div className="card flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-700">Overall Information</p>
            <select className="input h-7 w-auto text-xs py-0 bg-surface">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>

          {/* Donut + customer counts */}
          <div>
            <p className="text-xs text-gray-400 mb-3">Customers Overview</p>
            <div className="flex items-center gap-4">
              {/* SVG donut */}
              <div className="relative w-20 h-20 shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F0F0F0" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F15B2A" strokeWidth="3"
                    strokeDasharray="75 25" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#14B8A6" strokeWidth="3"
                    strokeDasharray="25 75" strokeDashoffset="-75" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-800">5.5<span className="text-base font-semibold">K</span></p>
                  <p className="text-[10px] text-gray-400 mt-0.5">First</p>
                  <p className="text-[10px] text-gray-400">Time</p>
                  <span className="badge badge-success text-[10px] mt-1">+36%</span>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-800">3.5<span className="text-base font-semibold">K</span></p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Return</p>
                  <span className="badge badge-danger text-[10px] mt-1">-2%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 bottom stats */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-surface-border text-center">
            {[
              { label: 'Suppliers', value: '6,987' },
              { label: 'Customers', value: '4,896' },
              { label: 'Orders',    value: '487' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-base font-bold text-gray-800">{s.value}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Products + Recent Sales row ─────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Top Selling */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-gray-700">Top Selling Products</p>
            <button className="btn btn-outline h-7 text-xs">Today</button>
          </div>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface border border-surface-border flex items-center justify-center shrink-0">
                  <ImageOff size={14} className="text-gray-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate">{p.name}</p>
                  <p className="text-[11px] text-gray-400">{p.price} · {p.units}</p>
                </div>
                <span className={`text-[11px] font-bold ${p.up ? 'text-success' : 'text-danger'}`}>
                  {p.change}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-gray-700">Low Stock Products</p>
            <a href="/products/low-stock" className="text-xs text-brand hover:underline">View All</a>
          </div>
          <div className="space-y-3">
            {lowStock.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface border border-surface-border flex items-center justify-center shrink-0">
                  <ImageOff size={14} className="text-gray-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate">{p.name}</p>
                  <p className="text-[11px] text-gray-400 font-mono">{p.sku}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-xs font-bold ${p.stock <= 3 ? 'text-danger' : 'text-warning'}`}>
                    {String(p.stock).padStart(2, '0')}
                  </span>
                  <p className="text-[10px] text-gray-400">in Stock</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-gray-700">Recent Sales</p>
            <button className="btn btn-outline h-7 text-xs">Weekly</button>
          </div>
          <div className="space-y-3">
            {recentSales.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface border border-surface-border flex items-center justify-center shrink-0">
                  <ImageOff size={14} className="text-gray-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate">{s.product}</p>
                  <p className="text-[11px] text-gray-400">{s.category} · {s.price}</p>
                </div>
                <span className={`badge ${statusBadge[s.status]} shrink-0 text-[10px]`}>
                  {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
