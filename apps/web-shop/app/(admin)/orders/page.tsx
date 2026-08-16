import { Search, Eye, ImageOff } from 'lucide-react'

const orders = [
  { id: 'ORD-8821', customer: 'Ahmed Hassan',  email: 'ahmed@mail.com', items: 2, total: '$89.00',  status: 'delivered',  date: 'Apr 14, 2025' },
  { id: 'ORD-8820', customer: 'Sara Ali',       email: 'sara@mail.com',  items: 1, total: '$34.99',  status: 'processing', date: 'Apr 14, 2025' },
  { id: 'ORD-8819', customer: 'Mike Torres',    email: 'mike@mail.com',  items: 3, total: '$78.50',  status: 'pending',    date: 'Apr 13, 2025' },
  { id: 'ORD-8818', customer: 'Layla Noor',     email: 'layla@mail.com', items: 1, total: '$45.00',  status: 'delivered',  date: 'Apr 13, 2025' },
  { id: 'ORD-8817', customer: 'James Okafor',   email: 'james@mail.com', items: 2, total: '$32.00',  status: 'cancelled',  date: 'Apr 12, 2025' },
  { id: 'ORD-8816', customer: 'Priya Sharma',   email: 'priya@mail.com', items: 1, total: '$55.00',  status: 'shipped',    date: 'Apr 12, 2025' },
  { id: 'ORD-8815', customer: 'Carlos Mendes',  email: 'carlos@mail.com',items: 4, total: '$124.00', status: 'delivered',  date: 'Apr 11, 2025' },
]

const badgeClass: Record<string, string> = {
  delivered: 'badge-success', processing: 'badge-info',
  pending: 'badge-warning',   cancelled: 'badge-danger', shipped: 'badge-violet',
}

const statusTabs = [
  { label: 'All',        count: 3572, href: '/orders' },
  { label: 'Pending',    count: 128,  href: '/orders?status=pending' },
  { label: 'Processing', count: 84,   href: '/orders?status=processing' },
  { label: 'Shipped',    count: 305,  href: '/orders?status=shipped' },
  { label: 'Delivered',  count: 2940, href: '/orders?status=delivered' },
  { label: 'Cancelled',  count: 115,  href: '/orders?status=cancelled' },
]

export default function OrdersPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Orders</h1>
        <p className="text-sm text-gray-400 mt-0.5">Track and manage all customer orders</p>
      </div>

      {/* Status tab row */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {statusTabs.map((t, i) => (
          <a
            key={t.label}
            href={t.href}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors border ${
              i === 0
                ? 'bg-brand text-white border-brand'
                : 'bg-white text-gray-500 border-surface-border hover:border-brand hover:text-brand'
            }`}
          >
            {t.label}
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${i === 0 ? 'bg-white/20 text-white' : 'bg-surface text-gray-500'}`}>
              {t.count.toLocaleString()}
            </span>
          </a>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-8 h-9 text-xs" placeholder="Search orders or customers..." />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <input type="date" className="input h-9 text-xs py-0 w-auto" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                <th className="th">Order ID</th>
                <th className="th">Customer</th>
                <th className="th">Items</th>
                <th className="th">Total</th>
                <th className="th">Status</th>
                <th className="th">Date</th>
                <th className="th text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-surface/60 transition-colors">
                  <td className="td font-mono text-xs text-brand font-semibold">{o.id}</td>
                  <td className="td">
                    <p className="font-medium text-xs text-gray-800">{o.customer}</p>
                    <p className="text-[10px] text-gray-400">{o.email}</p>
                  </td>
                  <td className="td text-gray-500">{o.items} item{o.items > 1 ? 's' : ''}</td>
                  <td className="td font-bold text-gray-800">{o.total}</td>
                  <td className="td">
                    <span className={`badge text-[10px] ${badgeClass[o.status]}`}>
                      {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                    </span>
                  </td>
                  <td className="td text-gray-400 text-xs">{o.date}</td>
                  <td className="td text-right">
                    <button className="btn btn-outline h-7 text-xs gap-1">
                      <Eye size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-surface-border">
          <p className="text-xs text-gray-400">Showing 1–7 of 3,572 orders</p>
          <div className="flex items-center gap-1">
            {['1','2','3','...','60'].map(p => (
              <button key={p} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === '1' ? 'bg-brand text-white' : 'hover:bg-surface text-gray-500'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
