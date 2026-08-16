import { AlertTriangle, ImageOff } from 'lucide-react'

const lowStockItems = [
  { id: '1', name: 'Compression Socks (3pk)', sku: 'CS-014', category: 'Accessories', stock: 4,  threshold: 10, price: 22.00 },
  { id: '2', name: 'Resistance Bands',        sku: 'RB-009', category: 'Equipment',   stock: 6,  threshold: 20, price: 34.99 },
  { id: '3', name: 'USB-C Cable Pack',        sku: 'UC-003', category: 'Accessories', stock: 9,  threshold: 15, price: 12.00 },
  { id: '4', name: 'Mechanical Keyboard RGB', sku: 'MK-001', category: 'Accessories', stock: 2,  threshold: 10, price: 89.00 },
  { id: '5', name: 'Phone Screen Protector',  sku: 'PS-007', category: 'Accessories', stock: 3,  threshold: 10, price: 14.00 },
]

export default function LowStockPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-warning-light flex items-center justify-center">
          <AlertTriangle size={20} className="text-warning" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Low Stock Alert</h1>
          <p className="text-sm text-gray-400 mt-0.5">{lowStockItems.length} products below reorder threshold</p>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                <th className="th">Product</th>
                <th className="th">Category</th>
                <th className="th">Current Stock</th>
                <th className="th">Threshold</th>
                <th className="th">Price</th>
                <th className="th">Urgency</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map(p => {
                const pct = (p.stock / p.threshold) * 100
                return (
                  <tr key={p.id} className="hover:bg-surface/60 transition-colors">
                    <td className="td">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-surface border border-surface-border flex items-center justify-center shrink-0">
                          <ImageOff size={13} className="text-gray-300" />
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-gray-800">{p.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="td"><span className="badge badge-neutral text-[10px]">{p.category}</span></td>
                    <td className="td font-bold text-warning">{p.stock}</td>
                    <td className="td text-gray-400">{p.threshold}</td>
                    <td className="td">${p.price.toFixed(2)}</td>
                    <td className="td">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${pct <= 25 ? 'bg-danger' : 'bg-warning'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-bold ${pct <= 25 ? 'text-danger' : 'text-warning'}`}>
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
