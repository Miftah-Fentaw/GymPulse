import { Search, Truck } from 'lucide-react'

const shipments = [
  { id: 'SHP-0221', order: 'ORD-8820', customer: 'Sara Ali',     carrier: 'DHL',     tracking: 'DH29831940',  status: 'in_transit', eta: 'Apr 16, 2025' },
  { id: 'SHP-0220', order: 'ORD-8819', customer: 'Mike Torres',  carrier: 'FedEx',   tracking: 'FX991234561', status: 'dispatched', eta: 'Apr 17, 2025' },
  { id: 'SHP-0219', order: 'ORD-8818', customer: 'Layla Noor',   carrier: 'Aramex',  tracking: 'AX8821233',   status: 'delivered',  eta: 'Apr 13, 2025' },
  { id: 'SHP-0218', order: 'ORD-8817', customer: 'James Okafor', carrier: 'UPS',     tracking: 'UP7712340011',status: 'returned',   eta: 'Apr 12, 2025' },
  { id: 'SHP-0217', order: 'ORD-8816', customer: 'Priya Sharma', carrier: 'DHL',     tracking: 'DH77881023',  status: 'in_transit', eta: 'Apr 15, 2025' },
]

const badgeMap: Record<string, string> = {
  in_transit: 'badge-info',    dispatched: 'badge-warning',
  delivered:  'badge-success', returned: 'badge-danger',
}

export default function ShipmentsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-light flex items-center justify-center">
          <Truck size={20} className="text-teal" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Shipments</h1>
          <p className="text-sm text-gray-400 mt-0.5">Track outgoing and returned shipments</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Shipments', value: '305', color: 'text-gray-800' },
          { label: 'In Transit',      value: '142', color: 'text-info' },
          { label: 'Delivered',       value: '148', color: 'text-success' },
          { label: 'Returned',        value: '15',  color: 'text-danger' },
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
            <input className="input pl-8 h-9 text-xs" placeholder="Search by tracking, order..." />
          </div>
          <select className="input h-9 w-auto text-xs py-0 ml-auto">
            <option>All Carriers</option>
            <option>DHL</option>
            <option>FedEx</option>
            <option>UPS</option>
            <option>Aramex</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface">
              <tr>
                <th className="th">Shipment ID</th>
                <th className="th">Order</th>
                <th className="th">Customer</th>
                <th className="th">Carrier</th>
                <th className="th">Tracking</th>
                <th className="th">Status</th>
                <th className="th">ETA</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map(s => (
                <tr key={s.id} className="hover:bg-surface/60 transition-colors">
                  <td className="td font-mono text-xs font-semibold text-brand">{s.id}</td>
                  <td className="td text-xs text-gray-500">{s.order}</td>
                  <td className="td font-medium text-xs text-gray-800">{s.customer}</td>
                  <td className="td text-xs text-gray-600">{s.carrier}</td>
                  <td className="td font-mono text-[11px] text-gray-400">{s.tracking}</td>
                  <td className="td">
                    <span className={`badge text-[10px] ${badgeMap[s.status]}`}>
                      {s.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="td text-xs text-gray-400">{s.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
