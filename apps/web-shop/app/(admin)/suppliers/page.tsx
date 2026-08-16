import { Plus, Search, Pencil, Trash2 } from 'lucide-react'

const suppliers = [
  { id: '1', name: 'NutriSource Co.',        contact: 'David Kim',     email: 'david@nutrisource.com',   category: 'Supplements', products: 24, status: 'active' },
  { id: '2', name: 'FitGear Wholesale',      contact: 'Maria Santos',  email: 'maria@fitgear.com',        category: 'Equipment',   products: 38, status: 'active' },
  { id: '3', name: 'ActiveWear Ltd.',        contact: 'James Patel',   email: 'james@activewear.co',      category: 'Apparel',     products: 15, status: 'inactive'},
  { id: '4', name: 'RecoveryPro Supply',     contact: 'Aisha Nkosi',   email: 'aisha@recoverypro.net',    category: 'Recovery',    products: 12, status: 'active' },
  { id: '5', name: 'AccessoryHub Intl.',     contact: 'Tom Eriksson',  email: 'tom@accessoryhub.io',      category: 'Accessories', products: 51, status: 'active' },
]

export default function SuppliersPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Suppliers</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage your product suppliers</p>
        </div>
        <a href="/suppliers/create" className="btn btn-primary"><Plus size={15} /> Add Supplier</a>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-8 h-9 text-xs" placeholder="Search suppliers..." />
          </div>
          <select className="input h-9 w-auto text-xs py-0 ml-auto">
            <option>All Categories</option>
            <option>Supplements</option>
            <option>Equipment</option>
            <option>Accessories</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                <th className="th">Supplier</th>
                <th className="th">Contact</th>
                <th className="th">Category</th>
                <th className="th">Products</th>
                <th className="th">Status</th>
                <th className="th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(s => (
                <tr key={s.id} className="hover:bg-surface/60 transition-colors">
                  <td className="td">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-brand">{s.name.split(' ').map(w => w[0]).join('').slice(0,2)}</span>
                      </div>
                      <p className="font-semibold text-xs text-gray-800">{s.name}</p>
                    </div>
                  </td>
                  <td className="td">
                    <p className="text-xs font-medium text-gray-700">{s.contact}</p>
                    <p className="text-[10px] text-gray-400">{s.email}</p>
                  </td>
                  <td className="td"><span className="badge badge-neutral text-[10px]">{s.category}</span></td>
                  <td className="td text-gray-600">{s.products}</td>
                  <td className="td">
                    <span className={`badge text-[10px] ${s.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                      {s.status === 'active' ? 'Active' : 'Inactive'}
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
      </div>
    </div>
  )
}
