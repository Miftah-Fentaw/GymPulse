import { MessageSquare, Send } from 'lucide-react'

const tickets = [
  { id: 'TKT-001', subject: 'Cannot upload product images', status: 'open',     priority: 'high',   created: 'Apr 12, 2025' },
  { id: 'TKT-002', subject: 'Order ORD-8801 status stuck',  status: 'resolved', priority: 'medium', created: 'Apr 10, 2025' },
  { id: 'TKT-003', subject: 'Category not appearing in app', status: 'open',    priority: 'low',    created: 'Apr 14, 2025' },
]

const priorityBadge: Record<string, string> = {
  high: 'badge-danger', medium: 'badge-warning', low: 'badge-neutral',
}
const statusBadge: Record<string, string> = {
  open: 'badge-info', resolved: 'badge-success',
}

export default function SupportPage() {
  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Support</h1>
        <p className="text-sm text-gray-400 mt-0.5">Raise issues or contact the platform super admin</p>
      </div>

      {/* Existing tickets */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-border">
          <p className="font-semibold text-sm text-gray-700">My Tickets</p>
        </div>
        <div className="divide-y divide-surface-border">
          {tickets.map(t => (
            <div key={t.id} className="px-5 py-3 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{t.subject}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t.id} · {t.created}</p>
              </div>
              <span className={`badge text-[10px] ${priorityBadge[t.priority]} shrink-0`}>
                {t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}
              </span>
              <span className={`badge text-[10px] ${statusBadge[t.status]} shrink-0`}>
                {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* New ticket form */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-brand" />
          <p className="font-semibold text-gray-700">New Support Ticket</p>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Subject</label>
          <input className="input" placeholder="Brief description of your issue" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Priority</label>
          <select className="input">
            <option>Low</option><option>Medium</option><option>High</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Message</label>
          <textarea className="input resize-none h-28" placeholder="Describe your issue in detail…" />
        </div>
        <div className="flex justify-end">
          <button className="btn btn-primary gap-1.5">
            <Send size={14} /> Submit Ticket
          </button>
        </div>
      </div>
    </div>
  )
}
