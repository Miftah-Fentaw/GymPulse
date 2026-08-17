import { Package, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const byCategory = [
  { cat: 'Supplements', total: 48, inStock: 44, lowStock: 3,  outOfStock: 1,  value: 42000 },
  { cat: 'Equipment',   total: 72, inStock: 68, lowStock: 2,  outOfStock: 2,  value: 98000 },
  { cat: 'Accessories', total: 95, inStock: 88, lowStock: 5,  outOfStock: 2,  value: 28000 },
  { cat: 'Recovery',    total: 31, inStock: 29, lowStock: 1,  outOfStock: 1,  value: 18000 },
  { cat: 'Apparel',     total: 38, inStock: 36, lowStock: 1,  outOfStock: 1,  value: 22000 },
]

const lowStockItems = [
  { name: 'Compression Socks (3pk)', stock: 4,  reorder: 10 },
  { name: 'Resistance Bands',        stock: 6,  reorder: 20 },
  { name: 'USB-C Cable Pack',        stock: 9,  reorder: 15 },
  { name: 'Phone Screen Protector',  stock: 3,  reorder: 10 },
  { name: 'Mechanical Keyboard RGB', stock: 2,  reorder: 10 },
]

export default function InventoryReportPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Inventory Report</h1>
        <p className="text-sm text-gray-400 mt-0.5">Stock levels and inventory value breakdown</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Products',    value: '284',       change: '+12', up: true,  bg: 'bg-brand/10',   color: 'text-brand'   },
          { label: 'In Stock',          value: '265',       change: '+8',  up: true,  bg: 'bg-success/10', color: 'text-success' },
          { label: 'Low Stock',         value: '12',        change: '+4',  up: false, bg: 'bg-warning/10', color: 'text-warning' },
          { label: 'Total Inventory Value', value: '$208K', change: '+5%', up: true,  bg: 'bg-violet/10',  color: 'text-violet'  },
        ].map(s => (
          <div key={s.label} className="card">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${s.bg}`}>
              <Package size={16} className={s.color} />
            </div>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            <div className={`flex items-center gap-0.5 text-[11px] font-semibold mt-1 ${s.up ? 'text-success' : 'text-danger'}`}>
              {s.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />} {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* By category */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-border">
          <p className="font-semibold text-sm text-gray-700">Stock by Category</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                <th className="th">Category</th>
                <th className="th">Total</th>
                <th className="th">In Stock</th>
                <th className="th">Low Stock</th>
                <th className="th">Out of Stock</th>
                <th className="th">Inventory Value</th>
                <th className="th">Fill Rate</th>
              </tr>
            </thead>
            <tbody>
              {byCategory.map(c => (
                <tr key={c.cat} className="hover:bg-surface/60 transition-colors">
                  <td className="td font-semibold text-gray-800">{c.cat}</td>
                  <td className="td">{c.total}</td>
                  <td className="td text-success font-medium">{c.inStock}</td>
                  <td className="td text-warning font-medium">{c.lowStock}</td>
                  <td className="td text-danger font-medium">{c.outOfStock}</td>
                  <td className="td font-semibold">${(c.value / 1000).toFixed(0)}K</td>
                  <td className="td">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-surface rounded-full overflow-hidden">
                        <div className="h-full bg-brand rounded-full" style={{ width: `${Math.round((c.inStock/c.total)*100)}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{Math.round((c.inStock/c.total)*100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low stock items */}
      <div className="card">
        <p className="font-semibold text-sm text-gray-700 mb-4">Items Below Reorder Threshold</p>
        <div className="space-y-3">
          {lowStockItems.map(item => {
            const pct = (item.stock / item.reorder) * 100
            return (
              <div key={item.name} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 flex-1 truncate">{item.name}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-20 h-1.5 bg-surface rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${pct <= 30 ? 'bg-danger' : 'bg-warning'}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className={`text-xs font-bold w-12 text-right ${pct <= 30 ? 'text-danger' : 'text-warning'}`}>
                    {item.stock}/{item.reorder}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
