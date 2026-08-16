import { Plus, Pencil, Trash2, Copy } from 'lucide-react'

const coupons = [
  { id: '1', code: 'WELCOME20',  type: 'percentage', value: 20, minOrder: 50,  uses: 142, limit: 500, active: true,  expires: 'May 1, 2025' },
  { id: '2', code: 'SUMMER15',   type: 'percentage', value: 15, minOrder: 30,  uses: 89,  limit: 200, active: true,  expires: 'Jun 1, 2025' },
  { id: '3', code: 'FLAT10',     type: 'fixed',      value: 10, minOrder: 40,  uses: 305, limit: 1000,active: true,  expires: 'Dec 31, 2025' },
  { id: '4', code: 'EARLYBIRD',  type: 'percentage', value: 30, minOrder: 100, uses: 500, limit: 500, active: false, expires: 'Apr 1, 2025' },
]

export default function CouponsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Coupons</h1>
          <p className="text-sm text-gray-400 mt-0.5">Manage discount codes and promotions</p>
        </div>
        <button className="btn btn-primary"><Plus size={15} /> Create Coupon</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Active Coupons',   value: '12', color: 'text-success' },
          { label: 'Total Uses',       value: '1,036', color: 'text-brand' },
          { label: 'Expired',          value: '4',  color: 'text-gray-400' },
          { label: 'Total Discounted', value: '$8,240', color: 'text-warning' },
        ].map(s => (
          <div key={s.label} className="card py-4">
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                <th className="th">Code</th>
                <th className="th">Type</th>
                <th className="th">Value</th>
                <th className="th">Min Order</th>
                <th className="th">Uses</th>
                <th className="th">Expires</th>
                <th className="th">Status</th>
                <th className="th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.id} className="hover:bg-surface/60 transition-colors">
                  <td className="td">
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-xs font-bold text-gray-800 bg-surface px-2 py-0.5 rounded-md">{c.code}</code>
                      <button className="text-gray-400 hover:text-brand transition-colors"><Copy size={12} /></button>
                    </div>
                  </td>
                  <td className="td capitalize text-xs text-gray-500">{c.type}</td>
                  <td className="td font-bold text-gray-800">{c.type === 'percentage' ? `${c.value}%` : `$${c.value}`}</td>
                  <td className="td text-gray-500">${c.minOrder}</td>
                  <td className="td">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-[60px] h-1.5 bg-surface rounded-full overflow-hidden">
                        <div className="h-full bg-brand rounded-full" style={{ width: `${(c.uses / c.limit) * 100}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{c.uses}/{c.limit}</span>
                    </div>
                  </td>
                  <td className="td text-xs text-gray-400">{c.expires}</td>
                  <td className="td">
                    <span className={`badge text-[10px] ${c.active ? 'badge-success' : 'badge-neutral'}`}>
                      {c.active ? 'Active' : 'Expired'}
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
