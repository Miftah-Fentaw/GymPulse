import { Plus, Search, Pencil, Trash2, ImageOff, Star } from 'lucide-react'

const products = [
  { id: '1', name: 'Whey Protein 2kg',        sku: 'WP-001', category: 'Supplements', price: 89.00,  cost: 42.00, stock: 142, status: 'active',   featured: true  },
  { id: '2', name: 'Resistance Bands Set',     sku: 'RB-005', category: 'Equipment',   price: 34.99,  cost: 12.00, stock: 85,  status: 'active',   featured: false },
  { id: '3', name: 'Gym Gloves Pro',           sku: 'GG-012', category: 'Accessories', price: 24.50,  cost: 8.00,  stock: 0,   status: 'inactive', featured: false },
  { id: '4', name: 'Smart Water Bottle',       sku: 'WB-003', category: 'Accessories', price: 45.00,  cost: 18.00, stock: 67,  status: 'active',   featured: true  },
  { id: '5', name: 'Foam Roller Elite',        sku: 'FR-008', category: 'Recovery',    price: 32.00,  cost: 14.00, stock: 30,  status: 'active',   featured: false },
  { id: '6', name: 'Pre-Workout Formula',      sku: 'PW-002', category: 'Supplements', price: 55.00,  cost: 22.00, stock: 210, status: 'active',   featured: true  },
  { id: '7', name: 'Jump Rope Pro',            sku: 'JR-011', category: 'Equipment',   price: 19.99,  cost: 6.00,  stock: 55,  status: 'active',   featured: false },
  { id: '8', name: 'Compression Socks (3pk)', sku: 'CS-014', category: 'Accessories', price: 22.00,  cost: 7.00,  stock: 4,   status: 'active',   featured: false },
]

export default function ProductsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Products</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your shop catalogue</p>
        </div>
        <a href="/products/create" className="btn btn-primary">
          <Plus size={15} /> Add Product
        </a>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Products', value: '284', color: 'text-brand' },
          { label: 'Active',         value: '261', color: 'text-success' },
          { label: 'Out of Stock',   value: '12',  color: 'text-danger' },
          { label: 'Low Stock',      value: '18',  color: 'text-warning' },
        ].map(s => (
          <div key={s.label} className="card py-4">
            <p className="text-xs text-gray-400 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-8 h-9 text-xs" placeholder="Search products..." />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <select className="input h-9 w-auto text-xs py-0">
              <option>All Categories</option>
              <option>Supplements</option>
              <option>Equipment</option>
              <option>Accessories</option>
              <option>Recovery</option>
            </select>
            <select className="input h-9 w-auto text-xs py-0">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                <th className="th">Product</th>
                <th className="th">SKU</th>
                <th className="th">Category</th>
                <th className="th">Price</th>
                <th className="th">Cost</th>
                <th className="th">Stock</th>
                <th className="th">Status</th>
                <th className="th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="hover:bg-surface/60 transition-colors">
                  <td className="td">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-surface border border-surface-border flex items-center justify-center shrink-0">
                        <ImageOff size={14} className="text-gray-300" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-xs">{p.name}</p>
                        {p.featured && (
                          <span className="flex items-center gap-0.5 text-[10px] text-amber-500 font-medium">
                            <Star size={10} /> Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="td font-mono text-[11px] text-gray-400">{p.sku}</td>
                  <td className="td">
                    <span className="badge badge-neutral text-[10px]">{p.category}</span>
                  </td>
                  <td className="td font-semibold text-gray-800">${p.price.toFixed(2)}</td>
                  <td className="td text-gray-500">${p.cost.toFixed(2)}</td>
                  <td className="td">
                    <span className={`font-medium text-xs ${p.stock === 0 ? 'text-danger' : p.stock <= 5 ? 'text-warning' : 'text-gray-700'}`}>
                      {p.stock === 0 ? 'Out of stock' : p.stock}
                    </span>
                  </td>
                  <td className="td">
                    <span className={`badge text-[10px] ${p.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                      {p.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="td text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="btn btn-ghost p-1.5"><Pencil size={14} /></button>
                      <button className="btn btn-ghost p-1.5 text-danger hover:bg-danger-light"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-surface-border">
          <p className="text-xs text-gray-400">Showing 1–8 of 284 products</p>
          <div className="flex items-center gap-1">
            {['1','2','3','...','20'].map(p => (
              <button key={p} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === '1' ? 'bg-brand text-white' : 'hover:bg-surface text-gray-500'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
