import { Bell } from 'lucide-react'

const notifications = [
  { title: 'New member approval required',   body: 'Carlos Mendes signed up and is awaiting review.',    time: '2 min ago',   read: false, type: 'approval' },
  { title: 'Booking cancellation',           body: 'James Okafor cancelled his Power Lifting 101 slot.', time: '18 min ago',  read: false, type: 'booking'  },
  { title: 'Class is now full',              body: 'Power Lifting 101 on Apr 15 has reached capacity.',  time: '1h ago',      read: false, type: 'class'    },
  { title: 'Trainer review pending',         body: 'Elena Popov's trainer profile needs review.',        time: '3h ago',      read: true,  type: 'trainer'  },
  { title: 'Member reported a class',        body: 'A member flagged Core & Abs for inappropriate content.', time: '1d ago', read: true,  type: 'report'   },
]

const typeColor: Record<string,string> = {
  approval: 'bg-warn-light text-warn',
  booking:  'bg-info-light text-info',
  class:    'bg-ink text-white',
  trainer:  'bg-ok-light text-ok',
  report:   'bg-bad-light text-bad',
}

export default function NotificationsPage() {
  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Notifications</h1>
          <p className="text-sm text-ink-muted mt-0.5">3 unread notifications</p>
        </div>
        <button className="btn btn-outline h-9 text-sm">Mark all as read</button>
      </div>

      <div className="space-y-2">
        {notifications.map((n, i) => (
          <div
            key={i}
            className={`card flex items-start gap-4 transition-all ${!n.read ? 'ring-1 ring-ink/10' : 'opacity-70'}`}
          >
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${typeColor[n.type]}`}>
              <Bell size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-semibold ${!n.read ? 'text-ink' : 'text-ink-muted'}`}>{n.title}</p>
                {!n.read && <span className="w-2 h-2 bg-bad rounded-full shrink-0" />}
              </div>
              <p className="text-xs text-ink-muted mt-0.5">{n.body}</p>
              <p className="text-[10px] text-ink-ghost mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
