import { Plus, Trash2, Megaphone } from 'lucide-react'

const announcements = [
  { id: '1', title: 'Scheduled Maintenance – Apr 20', body: 'The platform will be offline for maintenance from 2am–4am UTC.', active: true, created: 'Apr 13, 2025' },
  { id: '2', title: 'New Premium Features Live', body: 'Premium members now have access to AI-powered workout recommendations.', active: true, created: 'Apr 10, 2025' },
  { id: '3', title: 'Shop Sale — 20% Off This Weekend', body: 'All supplement products are 20% off this Saturday and Sunday.', active: false, created: 'Apr 5, 2025' },
]

export default function AnnouncementsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Announcements</h1>
          <p className="text-sm text-slate-500 mt-0.5">Platform-wide announcements shown to all app users</p>
        </div>
        <button className="btn btn-primary h-9 text-sm">
          <Plus size={16} />
          New Announcement
        </button>
      </div>

      <div className="space-y-3">
        {announcements.map((a) => (
          <div key={a.id} className="card">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${a.active ? 'bg-brand/10' : 'bg-slate-100'}`}>
                <Megaphone size={18} className={a.active ? 'text-brand' : 'text-slate-400'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-800">{a.title}</h3>
                  <span className={`badge ${a.active ? 'badge-success' : 'badge-neutral'}`}>
                    {a.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-slate-500">{a.body}</p>
                <p className="text-xs text-slate-400 mt-2">{a.created}</p>
              </div>
              <button className="btn btn-ghost p-1.5 text-danger hover:bg-danger-light shrink-0" title="Delete">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create form */}
      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-4">Create Announcement</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Title</label>
            <input className="input" placeholder="Announcement title..." />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Message</label>
            <textarea
              className="input resize-none h-24"
              placeholder="Write your announcement message..."
            />
          </div>
          <div className="flex justify-end">
            <button className="btn btn-primary">Publish Announcement</button>
          </div>
        </div>
      </div>
    </div>
  )
}
