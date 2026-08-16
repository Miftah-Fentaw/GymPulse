import { Search, Eye } from 'lucide-react'

const returns = [
  { id: 'RET-001', order: 'ORD-8801', customer: 'Ahmed Hassan', product: 'Whey Protein 2kg',     reason: 'Wrong item',    amount: '$89.00',  status: 'approved',  date: 'Apr 10, 2025' },
  { id: 'RET-002', order: 'ORD-8790', customer: 'Sara Ali',     product: 'Gym Gloves Pro',       reason: 'Defective',     amount: '$24.50',  status: 'pending',   date: 'Apr 11, 2025' },
  { id: 'RET-003', order: 'ORD-8785', customer: 'Mike Torres',  product: 'Resistance Bands Set', reason: 'Changed mind',  amount: '$34.99',  status: 'rejected',  date: 'Apr 9, 2025'  },
  { id: 'RET-004', order: 'ORD-8780', customer: 'Layla Noor',   product: 'Smart Water Bottle',   reason: 'Damaged',       amount: '$45.00',  status: 'refunded',  date: 'Apr 8, 2025'  },
]

const badgeMap: Record<string, string> = {
  approved: 'badge-success', pending: 'badge-warning',
  rejected: 'badge-danger',  refunded: 'badge-info',
}

export default function ReturnsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Returns</h1>
        <p className="text-sm text-gray-400 mt-0.5">Review and process return requests</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Returns', value: '48',  color: 'text-gray-800' },
          { label: 'Pending',       value: '12',  color: 'text-warning' },
          { label: 'Approved',      value: '28',  color: 'text-success' },
          { label: 'Rejected',      value: '8',   color: 'text-danger'  },
        ].map(s => (
          <div key={s.label} className="card py-4">
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-8 h-9 text-xs" placeholder="Search returns..." />
          </div>
          <select className="input h-9 w-auto text-xs py-0 ml-auto">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
            <option>Refunded</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                <th className="th">Return ID</th>
                <th className="th">Order</th>
                <th className="th">Customer</th>
                <th className="th">Product</th>
                <th className="th">Reason</th>
                <th className="th">Amount</th>
                <th className="th">Status</th>
                <th className="th">Date</th>
                <th className="th text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {returns.map(r => (
                <tr key={r.id} className="hover:bg-surface/60 transition-colors">
                  <td className="td font-mono text-xs text-brand font-semibold">{r.id}</td>
                  <td className="td text-xs text-gray-500">{r.order}</td>
                  <td className="td text-xs font-medium text-gray-800">{r.customer}</td>
                  <td className="td text-xs text-gray-600">{r.product}</td>
                  <td className="td text-xs text-gray-400">{r.reason}</td>
                  <td className="td font-bold text-gray-800">{r.amount}</td>
                  <td className="td">
                    <span className={`badge text-[10px] ${badgeMap[r.status]}`}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </td>
                  <td className="td text-xs text-gray-400">{r.date}</td>
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
      </div>
    </div>
  )
}
