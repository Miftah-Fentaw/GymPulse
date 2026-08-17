import { PackageX, Plus } from 'lucide-react'

const outOfStock = [
  { id: '1', name: 'Gym Gloves Pro',           sku: 'GG-012', category: 'Accessories', price: 24.50, lastSold: 'Apr 2, 2025',  supplier: 'AccessoryHub' },
  { id: '2', name: 'Weightlifting Belt 4"',    sku: 'WB-007', category: 'Equipment',   price: 68.00, lastSold: 'Mar 28, 2025', supplier: 'FitGear Wholesale' },
  { id: '3', name: 'Shaker Bottle 700ml',      sku: 'SB-021', category: 'Accessories', price: 14.99, lastSold: 'Apr 10, 2025', supplier: 'AccessoryHub' },
  { id: '4', name: 'Creatine Monohydrate 1kg', sku: 'CR-004', category: 'Supplements', price: 39.00, lastSold: 'Apr 8, 2025',  supplier: 'NutriSource Co.' },
]

export default function OutOfStockPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-danger-light flex items-center justify-center">
          <PackageX size={20} className="text-danger" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Out of Stock</h1>
          <p className="text-sm text-gray-400 mt-0.5">{outOfStock.length} products with zero inventory</p>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                <th className="th">Product</th>
                <th className="th">SKU</th>
                <th className="th">Category</th>
                <th className="th">Price</th>
                <th className="th">Last Sold</th>
                <th className="th">Supplier</th>
                <th className="th text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {outOfStock.map(p => (
                <tr key={p.id} className="hover:bg-surface/60 transition-colors">
                  <td className="td">
                    <p className="font-semibold text-xs text-gray-800">{p.name}</p>
                  </td>
                  <td className="td font-mono text-[11px] text-gray-400">{p.sku}</td>
                  <td className="td"><span className="badge badge-neutral text-[10px]">{p.category}</span></td>
                  <td className="td font-bold text-gray-800">${p.price.toFixed(2)}</td>
                  <td className="td text-xs text-gray-400">{p.lastSold}</td>
                  <td className="td text-xs text-gray-500">{p.supplier}</td>
                  <td className="td text-right">
                    <button className="btn btn-outline h-7 text-xs gap-1">
                      <Plus size={12} /> Restock
                    </button>
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
