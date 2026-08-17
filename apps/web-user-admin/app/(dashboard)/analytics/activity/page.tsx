import { Activity, Dumbbell, ClipboardList, TrendingUp } from 'lucide-react'

const hourly = [
  { h: '6am', count: 38 }, { h: '8am', count: 112 }, { h: '10am', count: 84 },
  { h: '12pm', count: 61 }, { h: '2pm', count: 45 }, { h: '4pm', count: 97 },
  { h: '6pm', count: 175 }, { h: '8pm', count: 128 }, { h: '10pm', count: 42 },
]
const maxH = Math.max(...hourly.map(h => h.count))

const disciplines = [
  { name: 'HIIT',        bookings: 912,  pct: 32 },
  { name: 'Strength',    bookings: 796,  pct: 28 },
  { name: 'Cardio',      bookings: 512,  pct: 18 },
  { name: 'Flexibility', bookings: 341,  pct: 12 },
  { name: 'Core',        bookings: 284,  pct: 10 },
]

export default function ClassActivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">Class Activity</h1>
        <p className="text-sm text-ink-muted mt-0.5">Booking patterns and discipline popularity</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Bookings Today',   value: '312',  icon: <ClipboardList size={17} /> },
          { label: 'Classes Running',  value: '8',    icon: <Dumbbell size={17} /> },
          { label: 'Check-In Rate',    value: '91%',  icon: <Activity size={17} /> },
          { label: 'No-Show Rate',     value: '0.5%', icon: <TrendingUp size={17} /> },
        ].map(s => (
          <div key={s.label} className="card flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sheet flex items-center justify-center shrink-0">{s.icon}</div>
            <div>
              <p className="text-xs text-ink-muted">{s.label}</p>
              <p className="text-xl font-bold text-ink">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Hourly bookings */}
      <div className="card">
        <p className="font-bold text-ink mb-5">Bookings by Hour (Today)</p>
        <div className="flex items-end gap-2 h-36">
          {hourly.map(h => (
            <div key={h.h} className="flex-1 flex flex-col items-center gap-0.5">
              <span className="text-[10px] text-ink-muted">{h.count}</span>
              <div
                className="w-full bg-ink rounded-t-xl transition-all"
                style={{ height: `${(h.count / maxH) * 110}px`, opacity: h.h === '6pm' ? 1 : 0.4 }}
              />
              <span className="text-[9px] text-ink-ghost">{h.h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Discipline breakdown */}
      <div className="card">
        <p className="font-bold text-ink mb-4">Bookings by Discipline</p>
        <div className="space-y-3">
          {disciplines.map(d => (
            <div key={d.name} className="flex items-center gap-3">
              <span className="text-sm text-ink-muted w-24 shrink-0">{d.name}</span>
              <div className="flex-1 h-2 bg-sheet rounded-full overflow-hidden">
                <div className="h-full bg-ink rounded-full" style={{ width: `${d.pct}%` }} />
              </div>
              <span className="text-xs font-bold text-ink w-8 text-right">{d.pct}%</span>
              <span className="text-xs text-ink-ghost w-12 text-right">{d.bookings.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
