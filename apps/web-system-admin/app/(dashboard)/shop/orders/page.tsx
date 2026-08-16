import { Search, Eye } from 'lucide-react'

const orders = [
  { id: 'ORD-8821', user: 'Ahmed Hassan', items: 2, total: '$89.00', status: 'delivered', date: 'Apr 14, 2025' },
  { id: 'ORD-8820', user: 'Sara Ali', items: 1, total: '$34.99', status: 'processing', date: 'Apr 14, 2025' },
  { id: 'ORD-8819', user: 'Mike Torres', items: 3, total: '$78.50', status: 'pending', date: 'Apr 13, 2025' },
  { id: 'ORD-8818', user: 'Layla Noor', items: 1, total: '$45.00', status: 'delivered', date: 'Apr 13, 2025' },
  { id: 'ORD-8817', user: 'James Okafor', items: 2, total: '$32.00', status: 'cancelled', date: 'Apr 12, 2025' },
  { id: 'ORD-8816', user: 'Priya Sharma', items: 1, total: '$55.00', status: 'shipped', date: 'Apr 12, 2025' },
]

const statusBadge: Record<string, string> = {
  delivered: 'badge-success',
  processing: 'badge-info',
  pending: 'badge-warning',
  cancelled: 'badge-danger',
  shipped: 'badge-info',
}

export default function OrdersPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Orders</h1>
          <p className="text-sm text-slate-500 mt-0.5">All customer orders across the platform</p>
        </div>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'All Orders', value: '3,572', badge: '' },
          { label: 'Pending', value: '128', badge: 'text-warning' },
          { label: 'Processing', value: '84', badge: 'text-brand' },
          { label: 'Shipped', value: '305', badge: 'text-blue-500' },
          { label: 'Delivered', value: '2,940', badge: 'text-success' },
        ].map((s) => (
          <div key={s.label} className="card py-4 text-center cursor-pointer hover:border-brand transition-colors">
            <p className="text-xs text-slate-400">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.badge || 'text-slate-800'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-8 h-9 text-sm" placeholder="Search orders..." />
          </div>
          <select className="input h-9 w-auto text-sm py-0 ml-auto">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">Order ID</th>
                <th className="table-th">Customer</th>
                <th className="table-th">Items</th>
                <th className="table-th">Total</th>
                <th className="table-th">Status</th>
                <th className="table-th">Date</th>
                <th className="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-surface/40 transition-colors">
                  <td className="table-td font-medium text-brand">{o.id}</td>
                  <td className="table-td">{o.user}</td>
                  <td className="table-td text-slate-500">{o.items} item{o.items > 1 ? 's' : ''}</td>
                  <td className="table-td font-semibold">{o.total}</td>
                  <td className="table-td">
                    <span className={`badge ${statusBadge[o.status]}`}>
                      {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                    </span>
                  </td>
                  <td className="table-td text-slate-400">{o.date}</td>
                  <td className="table-td text-right">
                    <button className="btn btn-outline h-8 text-xs gap-1.5">
                      <Eye size={13} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-surface-border">
          <p className="text-sm text-slate-500">Showing 1–6 of 3,572 orders</p>
          <div className="flex items-center gap-1">
            {['1','2','3','...','60'].map((p) => (
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
