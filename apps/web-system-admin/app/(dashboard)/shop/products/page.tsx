import { Plus, Search, Pencil, Trash2, ImageOff } from 'lucide-react'

const products = [
  { id: '1', name: 'Whey Protein 2kg', sku: 'WP-001', category: 'Supplements', price: 89.00, stock: 142, status: 'active', featured: true },
  { id: '2', name: 'Resistance Bands Set', sku: 'RB-005', category: 'Equipment', price: 34.99, stock: 85, status: 'active', featured: false },
  { id: '3', name: 'Gym Gloves Pro', sku: 'GG-012', category: 'Accessories', price: 24.50, stock: 0, status: 'inactive', featured: false },
  { id: '4', name: 'Smart Water Bottle', sku: 'WB-003', category: 'Accessories', price: 45.00, stock: 67, status: 'active', featured: true },
  { id: '5', name: 'Foam Roller Elite', sku: 'FR-008', category: 'Recovery', price: 32.00, stock: 30, status: 'active', featured: false },
  { id: '6', name: 'Pre-Workout Formula', sku: 'PW-002', category: 'Supplements', price: 55.00, stock: 210, status: 'active', featured: true },
]

export default function ProductsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Products</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your shop catalogue</p>
        </div>
        <a href="/shop/products/create" className="btn btn-primary h-9 text-sm">
          <Plus size={16} />
          Add Product
        </a>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Products', value: '284', color: 'text-brand' },
          { label: 'Active', value: '261', color: 'text-success' },
          { label: 'Out of Stock', value: '12', color: 'text-danger' },
          { label: 'Featured', value: '18', color: 'text-warning' },
        ].map((s) => (
          <div key={s.label} className="card py-4">
            <p className="text-xs text-slate-400 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-8 h-9 text-sm" placeholder="Search products..." />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <select className="input h-9 w-auto text-sm py-0">
              <option>All Categories</option>
              <option>Supplements</option>
              <option>Equipment</option>
              <option>Accessories</option>
              <option>Recovery</option>
            </select>
            <select className="input h-9 w-auto text-sm py-0">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">Product</th>
                <th className="table-th">SKU</th>
                <th className="table-th">Category</th>
                <th className="table-th">Price</th>
                <th className="table-th">Stock</th>
                <th className="table-th">Status</th>
                <th className="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-surface/40 transition-colors">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface border border-surface-border flex items-center justify-center shrink-0">
                        <ImageOff size={16} className="text-slate-300" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{p.name}</p>
                        {p.featured && <span className="badge badge-info text-[10px]">Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td className="table-td font-mono text-xs text-slate-500">{p.sku}</td>
                  <td className="table-td">
                    <span className="badge badge-neutral">{p.category}</span>
                  </td>
                  <td className="table-td font-semibold">${p.price.toFixed(2)}</td>
                  <td className="table-td">
                    <span className={p.stock === 0 ? 'text-danger font-medium' : 'text-slate-700'}>
                      {p.stock === 0 ? 'Out of Stock' : p.stock}
                    </span>
                  </td>
                  <td className="table-td">
                    <span className={`badge ${p.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </td>
                  <td className="table-td text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="btn btn-ghost p-1.5" title="Edit">
                        <Pencil size={15} />
                      </button>
                      <button className="btn btn-ghost p-1.5 text-danger hover:bg-danger-light" title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-surface-border">
          <p className="text-sm text-slate-500">Showing 1–6 of 284 products</p>
          <div className="flex items-center gap-1">
            {['1','2','3','...','20'].map((p) => (
              <button
                key={p}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === '1' ? 'bg-brand text-white' : 'hover:bg-surface text-slate-600'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
