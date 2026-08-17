import { AlertTriangle, Download } from 'lucide-react'

const alerts = [
  { name: 'Compression Socks (3pk)', sku: 'CS-014', category: 'Accessories', stock: 4,  threshold: 10, supplier: 'AccessoryHub Intl.',  price: 22.00 },
  { name: 'Resistance Bands',        sku: 'RB-009', category: 'Equipment',   stock: 6,  threshold: 20, supplier: 'FitGear Wholesale',    price: 34.99 },
  { name: 'USB-C Cable Pack',        sku: 'UC-003', category: 'Accessories', stock: 9,  threshold: 15, supplier: 'AccessoryHub Intl.',   price: 12.00 },
  { name: 'Mechanical Keyboard RGB', sku: 'MK-001', category: 'Accessories', stock: 2,  threshold: 10, supplier: 'AccessoryHub Intl.',   price: 89.00 },
  { name: 'Phone Screen Protector',  sku: 'PS-007', category: 'Accessories', stock: 3,  threshold: 10, supplier: 'AccessoryHub Intl.',   price: 14.00 },
  { name: 'Creatine Monohydrate 1kg',sku: 'CR-004', category: 'Supplements', stock: 5,  threshold: 25, supplier: 'NutriSource Co.',      price: 39.00 },
  { name: 'Jump Rope Pro',           sku: 'JR-011', category: 'Equipment',   stock: 8,  threshold: 15, supplier: 'FitGear Wholesale',    price: 19.99 },
]

export default function LowStockReportPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-warning-light flex items-center justify-center">
            <AlertTriangle size={20} className="text-warning" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Low Stock Alerts</h1>
            <p className="text-sm text-gray-400 mt-0.5">{alerts.length} products below reorder threshold</p>
          </div>
        </div>
        <button className="btn btn-outline h-9 text-sm gap-1.5">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Critical (≤3 units)', value: alerts.filter(a => a.stock <= 3).length, color: 'text-danger' },
          { label: 'Low (4–10 units)',    value: alerts.filter(a => a.stock > 3 && a.stock <= 10).length, color: 'text-warning' },
          { label: 'Total Alerts',        value: alerts.length, color: 'text-gray-800' },
        ].map(s => (
          <div key={s.label} className="card py-4 text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                <th className="th">Product</th>
                <th className="th">SKU</th>
                <th className="th">Category</th>
                <th className="th">Current Stock</th>
                <th className="th">Threshold</th>
                <th className="th">Supplier</th>
                <th className="th">Price</th>
                <th className="th">Urgency</th>
              </tr>
            </thead>
            <tbody>
              {alerts.sort((a, b) => a.stock - b.stock).map(p => {
                const pct = (p.stock / p.threshold) * 100
                const isCritical = p.stock <= 3
                return (
                  <tr key={p.sku} className="hover:bg-surface/60 transition-colors">
                    <td className="td font-semibold text-xs text-gray-800">{p.name}</td>
                    <td className="td font-mono text-[11px] text-gray-400">{p.sku}</td>
                    <td className="td"><span className="badge badge-neutral text-[10px]">{p.category}</span></td>
                    <td className="td">
                      <span className={`font-bold text-sm ${isCritical ? 'text-danger' : 'text-warning'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="td text-gray-400">{p.threshold}</td>
                    <td className="td text-xs text-gray-500">{p.supplier}</td>
                    <td className="td font-semibold">${p.price.toFixed(2)}</td>
                    <td className="td">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[60px] h-1.5 bg-surface rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isCritical ? 'bg-danger' : 'bg-warning'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-bold ${isCritical ? 'text-danger' : 'text-warning'}`}>
                          {Math.round(pct)}%
                        </span>
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
