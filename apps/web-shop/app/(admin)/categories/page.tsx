import { Plus, Pencil, Trash2, Layers } from 'lucide-react'

const categories = [
  { id: '1', name: 'Supplements',  slug: 'supplements', products: 48, active: true  },
  { id: '2', name: 'Equipment',    slug: 'equipment',   products: 72, active: true  },
  { id: '3', name: 'Accessories',  slug: 'accessories', products: 95, active: true  },
  { id: '4', name: 'Recovery',     slug: 'recovery',    products: 31, active: true  },
  { id: '5', name: 'Apparel',      slug: 'apparel',     products: 38, active: false },
]

export default function CategoriesPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Categories</h1>
          <p className="text-sm text-gray-400 mt-0.5">Organise your products into categories</p>
        </div>
        <a href="/categories/create" className="btn btn-primary">
          <Plus size={15} /> Add Category
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-2">
        {categories.map(c => (
          <div key={c.id} className="card text-center hover:border-brand transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center mx-auto mb-2">
              <Layers size={18} className="text-brand" />
            </div>
            <p className="font-semibold text-sm text-gray-800">{c.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{c.products} products</p>
            <span className={`badge mt-2 text-[10px] ${c.active ? 'badge-success' : 'badge-neutral'}`}>
              {c.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-border">
          <p className="font-semibold text-sm text-gray-700">All Categories</p>
        </div>
        <table className="w-full">
          <thead className="bg-surface">
            <tr>
              <th className="th">Name</th>
              <th className="th">Slug</th>
              <th className="th">Products</th>
              <th className="th">Status</th>
              <th className="th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} className="hover:bg-surface/60 transition-colors">
                <td className="td font-semibold text-gray-800 text-xs">{c.name}</td>
                <td className="td font-mono text-[11px] text-gray-400">{c.slug}</td>
                <td className="td text-gray-600">{c.products}</td>
                <td className="td">
                  <span className={`badge text-[10px] ${c.active ? 'badge-success' : 'badge-neutral'}`}>
                    {c.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="td text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="btn btn-ghost p-1.5"><Pencil size={13} /></button>
                    <button className="btn btn-ghost p-1.5 text-danger hover:bg-danger-light"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick add */}
      <div className="card max-w-md">
        <h3 className="font-semibold text-sm text-gray-700 mb-3">Quick Add Category</h3>
        <div className="space-y-3">
          <input className="input" placeholder="Category name" />
          <input className="input" placeholder="slug (auto-generated)" />
          <div className="flex justify-end gap-2">
            <button className="btn btn-outline">Cancel</button>
            <button className="btn btn-primary">Create</button>
          </div>
        </div>
      </div>
    </div>
  )
}
