import { Activity, Users, Dumbbell, ClipboardList, TrendingDown } from 'lucide-react'

const hourly = [
  { hour: '6am', sessions: 42 }, { hour: '8am', sessions: 128 }, { hour: '10am', sessions: 96 },
  { hour: '12pm', sessions: 74 }, { hour: '2pm', sessions: 55 }, { hour: '4pm', sessions: 110 },
  { hour: '6pm', sessions: 189 }, { hour: '8pm', sessions: 134 }, { hour: '10pm', sessions: 47 },
]
const max = Math.max(...hourly.map(h => h.sessions))

const topWorkouts = [
  { title: 'Full Body HIIT', views: 4820, completions: 3210 },
  { title: 'Morning Yoga Flow', views: 3940, completions: 2890 },
  { title: 'Power Legs', views: 3210, completions: 1980 },
  { title: 'Core Blast', views: 2840, completions: 1640 },
  { title: 'Cardio Endurance', views: 2450, completions: 1320 },
]

export default function UserActivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">User Activity</h1>
        <p className="text-sm text-slate-500 mt-0.5">Daily session patterns and content engagement</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Daily Active Users',  value: '4,280', icon: <Users size={17} className="text-brand" />,   bg: 'bg-brand/10' },
          { label: 'Workouts Started',    value: '1,840', icon: <Dumbbell size={17} className="text-success" />, bg: 'bg-success/10' },
          { label: 'Bookings Today',      value: '312',   icon: <ClipboardList size={17} className="text-warning" />, bg: 'bg-warning/10' },
          { label: 'Avg. Session Length', value: '8.4m',  icon: <Activity size={17} className="text-purple-500" />,  bg: 'bg-purple-100' },
        ].map(s => (
          <div key={s.label} className="card flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>{s.icon}</div>
            <div>
              <p className="text-xs text-slate-400">{s.label}</p>
              <p className="text-xl font-bold text-slate-800">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Hourly sessions bar chart */}
      <div className="card">
        <p className="font-semibold text-slate-700 mb-5">Sessions by Hour (Today)</p>
        <div className="flex items-end gap-2 h-36">
          {hourly.map(h => (
            <div key={h.hour} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-slate-500">{h.sessions}</span>
              <div
                className="w-full bg-brand/70 rounded-t-md transition-all"
                style={{ height: `${(h.sessions / max) * 110}px` }}
              />
              <span className="text-[9px] text-slate-400">{h.hour}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top workouts */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-border">
          <p className="font-semibold text-slate-700">Top Workout Engagement</p>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-th">Workout</th>
              <th className="table-th">Views</th>
              <th className="table-th">Completions</th>
              <th className="table-th">Completion Rate</th>
            </tr>
          </thead>
          <tbody>
            {topWorkouts.map(w => (
              <tr key={w.title} className="hover:bg-surface/40 transition-colors">
                <td className="table-td font-medium text-slate-800">{w.title}</td>
                <td className="table-td">{w.views.toLocaleString()}</td>
                <td className="table-td">{w.completions.toLocaleString()}</td>
                <td className="table-td">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-surface rounded-full overflow-hidden">
                      <div className="h-full bg-brand rounded-full" style={{ width: `${Math.round((w.completions/w.views)*100)}%` }} />
                    </div>
                    <span className="text-xs font-medium text-slate-700">{Math.round((w.completions/w.views)*100)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
