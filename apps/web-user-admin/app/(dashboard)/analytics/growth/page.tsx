import { Users, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react'

const monthly = [
  { m: 'Jan', new: 320, churned: 12 }, { m: 'Feb', new: 410, churned: 18 },
  { m: 'Mar', new: 380, churned: 14 }, { m: 'Apr', new: 520, churned: 20 },
  { m: 'May', new: 480, churned: 22 }, { m: 'Jun', new: 640, churned: 15 },
  { m: 'Jul', new: 590, churned: 19 }, { m: 'Aug', new: 720, churned: 24 },
  { m: 'Sep', new: 660, churned: 17 }, { m: 'Oct', new: 800, churned: 28 },
  { m: 'Nov', new: 740, churned: 21 }, { m: 'Dec', new: 910, churned: 30 },
]
const maxNew = Math.max(...monthly.map(d => d.new))

const retention = [
  { label: 'Month 1', pct: 92 }, { label: 'Month 2', pct: 84 },
  { label: 'Month 3', pct: 76 }, { label: 'Month 6', pct: 64 },
  { label: 'Month 12', pct: 51 },
]

export default function MemberGrowthPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">Member Growth</h1>
        <p className="text-sm text-ink-muted mt-0.5">New sign-ups, churn, and retention over time</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Members',   value: '12,846', change: '+8.2%',  up: true  },
          { label: 'New This Month',  value: '910',    change: '+22.9%', up: true  },
          { label: 'Churned',         value: '30',     change: '+42.9%', up: false },
          { label: 'Net Growth',      value: '+880',   change: '+21.4%', up: true  },
        ].map(s => (
          <div key={s.label} className="card">
            <p className="text-xs text-ink-muted">{s.label}</p>
            <p className="text-2xl font-bold text-ink mt-1">{s.value}</p>
            <div className={`flex items-center gap-0.5 text-[11px] font-semibold mt-1 ${s.up ? 'text-ok' : 'text-bad'}`}>
              {s.up ? <ArrowUpRight size={11} /> : <TrendingDown size={11} />}
              {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* New vs Churned bar chart */}
      <div className="card">
        <p className="font-bold text-ink mb-5">New Members vs Churn (Monthly)</p>
        <div className="flex items-end gap-2 h-40">
          <div className="flex flex-col justify-between text-[10px] text-ink-ghost text-right pr-2 shrink-0">
            {['900','700','500','300','100'].map(l => <span key={l}>{l}</span>)}
          </div>
          <div className="flex-1 flex items-end gap-1.5">
            {monthly.map((d, i) => (
              <div key={d.m} className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-full flex items-end gap-0.5">
                  <div
                    className="flex-1 rounded-t-md bg-ink transition-all"
                    style={{ height: `${(d.new / maxNew) * 140}px`, opacity: i === monthly.length - 1 ? 1 : 0.35 + i * 0.055 }}
                  />
                  <div
                    className="w-1.5 rounded-t-md bg-bad"
                    style={{ height: `${(d.churned / maxNew) * 140}px` }}
                  />
                </div>
                <span className="text-[9px] text-ink-ghost">{d.m}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-ink-muted">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-ink inline-block" /> New Members</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-bad inline-block" /> Churned</span>
        </div>
      </div>

      {/* Retention curve */}
      <div className="card">
        <p className="font-bold text-ink mb-4">Retention Curve</p>
        <div className="space-y-3">
          {retention.map(r => (
            <div key={r.label} className="flex items-center gap-3">
              <span className="text-sm text-ink-muted w-20 shrink-0">{r.label}</span>
              <div className="flex-1 h-2 bg-sheet rounded-full overflow-hidden">
                <div className="h-full bg-ink rounded-full" style={{ width: `${r.pct}%` }} />
              </div>
              <span className="text-xs font-bold text-ink w-10 text-right">{r.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
