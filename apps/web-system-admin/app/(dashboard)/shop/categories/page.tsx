import { Plus, Pencil, Trash2 } from 'lucide-react'

const categories = [
  { id: '1', name: 'Supplements', slug: 'supplements', products: 48 },
  { id: '2', name: 'Equipment', slug: 'equipment', products: 72 },
  { id: '3', name: 'Accessories', slug: 'accessories', products: 95 },
  { id: '4', name: 'Recovery', slug: 'recovery', products: 31 },
  { id: '5', name: 'Apparel', slug: 'apparel', products: 38 },
]

export default function ShopCategoriesPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Shop Categories</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage product categories</p>
        </div>
        <button className="btn btn-primary h-9 text-sm">
          <Plus size={16} />
          Add Category
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">Name</th>
                <th className="table-th">Slug</th>
                <th className="table-th">Products</th>
                <th className="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-surface/40 transition-colors">
                  <td className="table-td font-medium text-slate-800">{c.name}</td>
                  <td className="table-td font-mono text-xs text-slate-400">{c.slug}</td>
                  <td className="table-td">{c.products}</td>
                  <td className="table-td text-right">
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
      </div>

      {/* Create form */}
      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-4">Add Category</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Name</label>
            <input className="input" placeholder="e.g. Supplements" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Slug</label>
            <input className="input" placeholder="e.g. supplements" />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="btn btn-primary">Create Category</button>
        </div>
      </div>
    </div>
  )
}
