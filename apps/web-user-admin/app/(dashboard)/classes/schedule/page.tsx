import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const dates = [14, 15, 16, 17, 18, 19, 20]

const schedule: Record<string, { title: string; trainer: string; time: string; color: string }[]> = {
  Mon: [
    { title: 'Full Body HIIT',    trainer: 'Felix W.', time: '07:00', color: 'bg-bad-light text-bad'   },
    { title: 'Cardio Blast',      trainer: 'Elena P.', time: '19:00', color: 'bg-warn-light text-warn' },
  ],
  Tue: [
    { title: 'Morning Yoga Flow', trainer: 'Rania K.', time: '06:30', color: 'bg-ok-light text-ok'     },
  ],
  Wed: [
    { title: 'Power Lifting 101', trainer: 'Omar S.',  time: '18:00', color: 'bg-info-light text-info' },
    { title: 'Core & Abs',        trainer: 'Felix W.', time: '08:00', color: 'bg-violet-light text-violet' },
  ],
  Thu: [
    { title: 'Cardio Blast',      trainer: 'Elena P.', time: '19:00', color: 'bg-warn-light text-warn' },
  ],
  Fri: [
    { title: 'Full Body HIIT',    trainer: 'Felix W.', time: '07:00', color: 'bg-bad-light text-bad'   },
    { title: 'Morning Yoga Flow', trainer: 'Rania K.', time: '09:00', color: 'bg-ok-light text-ok'     },
  ],
  Sat: [],
  Sun: [
    { title: 'Power Lifting 101', trainer: 'Omar S.',  time: '10:00', color: 'bg-info-light text-info' },
  ],
}

export default function ClassSchedulePage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Class Schedule</h1>
          <p className="text-sm text-ink-muted mt-0.5">Weekly view — Apr 14–20, 2025</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline h-9 p-2"><ChevronLeft size={16} /></button>
          <button className="btn btn-outline h-9 text-sm px-3">Today</button>
          <button className="btn btn-outline h-9 p-2"><ChevronRight size={16} /></button>
          <a href="/classes/create" className="btn btn-ink h-9 text-sm">
            <Plus size={15} /> Add Class
          </a>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-sheet-border">
          {days.map((d, i) => (
            <div
              key={d}
              className={`px-3 py-3 text-center border-r border-sheet-border last:border-r-0 ${dates[i] === 15 ? 'bg-ink' : ''}`}
            >
              <p className={`text-xs font-semibold ${dates[i] === 15 ? 'text-white' : 'text-ink-muted'}`}>{d}</p>
              <p className={`text-lg font-bold mt-0.5 ${dates[i] === 15 ? 'text-white' : 'text-ink'}`}>{dates[i]}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 min-h-[320px]">
          {days.map((d, i) => (
            <div key={d} className={`p-2 space-y-1.5 border-r border-sheet-border last:border-r-0 ${dates[i] === 15 ? 'bg-sheet' : ''}`}>
              {(schedule[d] || []).map((cls, ci) => (
                <div key={ci} className={`rounded-xl px-2 py-1.5 cursor-pointer hover:opacity-80 transition-opacity ${cls.color}`}>
                  <p className="text-[11px] font-bold leading-tight">{cls.title}</p>
                  <p className="text-[10px] mt-0.5 opacity-70">{cls.time} · {cls.trainer}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
