import { Users, Dumbbell, ClipboardList, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const monthly = [
  { m: 'Jan', members: 3200, bookings: 1800 },
  { m: 'Feb', members: 4100, bookings: 2400 },
  { m: 'Mar', members: 3800, bookings: 2100 },
  { m: 'Apr', members: 5200, bookings: 3100 },
  { m: 'May', members: 4800, bookings: 2900 },
  { m: 'Jun', members: 6400, bookings: 4000 },
  { m: 'Jul', members: 5900, bookings: 3600 },
  { m: 'Aug', members: 7200, bookings: 4800 },
  { m: 'Sep', members: 6600, bookings: 4100 },
  { m: 'Oct', members: 8000, bookings: 5200 },
  { m: 'Nov', members: 7400, bookings: 4600 },
  { m: 'Dec', members: 9100, bookings: 5900 },
]
const maxVal = Math.max(...monthly.map(d => d.members))

const disciplineBreakdown = [
  { label: 'HIIT',        pct: 32, count: 912  },
  { label: 'Strength',    pct: 28, count: 796  },
  { label: 'Cardio',      pct: 18, count: 512  },
  { label: 'Flexibility', pct: 12, count: 341  },
  { label: 'Core',        pct: 10, count: 284  },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">Analytics</h1>
        <p className="text-sm text-ink-muted mt-0.5">Platform-wide user & class metrics</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Members',  value: '12,846', change: '+8.2%',  up: true,  icon: <Users size={18} /> },
          { label: 'Total Classes',  value: '284',    change: '+12.5%', up: true,  icon: <Dumbbell size={18} /> },
          { label: 'Total Bookings', value: '3,572',  change: '+18.1%', up: true,  icon: <ClipboardList size={18} /> },
          { label: 'Churn Rate',     value: '2.4%',   change: '-0.8%',  up: true,  icon: <TrendingUp size={18} /> },
        ].map(kpi => (
          <div key={kpi.label} className="card flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sheet flex items-center justify-center shrink-0">
              {kpi.icon}
            </div>
            <div>
              <p className="text-xs text-ink-muted">{kpi.label}</p>
              <p className="text-lg font-bold text-ink">{kpi.value}</p>
              <div className={`flex items-center gap-0.5 text-[11px] font-semibold ${kpi.up ? 'text-ok' : 'text-bad'}`}>
                {kpi.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />} {kpi.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Growth chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <p className="font-bold text-ink">Member & Booking Growth</p>
          <div className="flex items-center gap-4 text-xs text-ink-muted">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-ink inline-block" /> Members</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sheet-border inline-block" /> Bookings</span>
          </div>
        </div>
        <div className="flex gap-3 h-44">
          <div className="flex flex-col justify-between text-[10px] text-ink-ghost text-right pr-1.5 shrink-0">
            {['9K','7K','5K','3K','1K','0'].map(l => <span key={l}>{l}</span>)}
          </div>
          <div className="flex-1 flex items-end gap-1.5">
            {monthly.map((d, i) => (
              <div key={d.m} className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-full flex items-end gap-0.5">
                  <div
                    className="flex-1 rounded-t-md bg-ink transition-all"
                    style={{ height: `${(d.members / maxVal) * 160}px`, opacity: i === monthly.length - 1 ? 1 : 0.3 + i * 0.06 }}
                  />
                  <div
                    className="flex-1 rounded-t-md bg-sheet-border"
                    style={{ height: `${(d.bookings / maxVal) * 160}px` }}
                  />
                </div>
                <span className="text-[9px] text-ink-ghost">{d.m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Discipline breakdown */}
      <div className="card">
        <p className="font-bold text-ink mb-4">Bookings by Discipline</p>
        <div className="space-y-3">
          {disciplineBreakdown.map(d => (
            <div key={d.label} className="flex items-center gap-3">
              <span className="text-sm text-ink-muted w-24 shrink-0">{d.label}</span>
              <div className="flex-1 h-2 bg-sheet rounded-full overflow-hidden">
                <div className="h-full bg-ink rounded-full" style={{ width: `${d.pct}%` }} />
              </div>
              <span className="text-xs font-semibold text-ink w-8 text-right">{d.pct}%</span>
              <span className="text-xs text-ink-ghost w-12 text-right">{d.count.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
