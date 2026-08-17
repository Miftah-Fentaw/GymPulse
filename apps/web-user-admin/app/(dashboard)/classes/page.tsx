import { Plus, Search, Pencil, Trash2, Globe, EyeOff } from 'lucide-react'

const classes = [
  { id: '1', title: 'Full Body HIIT',       discipline: 'HIIT',        trainer: 'Felix Wagner',  difficulty: 'intermediate', capacity: 20, booked: 18, price: 25,  status: 'active',   time: 'Mon 07:00' },
  { id: '2', title: 'Morning Yoga Flow',    discipline: 'Flexibility', trainer: 'Rania Khalil',  difficulty: 'beginner',     capacity: 15, booked: 12, price: 0,   status: 'active',   time: 'Tue 06:30' },
  { id: '3', title: 'Power Lifting 101',    discipline: 'Strength',    trainer: 'Omar Siddiqui', difficulty: 'advanced',     capacity: 10, booked: 10, price: 35,  status: 'full',     time: 'Wed 18:00' },
  { id: '4', title: 'Cardio Blast',         discipline: 'Cardio',      trainer: 'Elena Popov',   difficulty: 'intermediate', capacity: 25, booked: 8,  price: 20,  status: 'active',   time: 'Thu 19:00' },
  { id: '5', title: 'Core & Abs',           discipline: 'Core',        trainer: 'Felix Wagner',  difficulty: 'beginner',     capacity: 20, booked: 0,  price: 15,  status: 'cancelled',time: 'Fri 08:00' },
]

const diffBadge: Record<string,string> = {
  beginner: 'badge-ok', intermediate: 'badge-warn', advanced: 'badge-bad',
}
const statusBadge: Record<string,string> = {
  active: 'badge-ok', full: 'badge-ink', cancelled: 'badge-bad',
}

export default function ClassesPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Classes</h1>
          <p className="text-sm text-ink-muted mt-0.5">Manage all fitness classes</p>
        </div>
        <a href="/classes/create" className="btn btn-ink">
          <Plus size={15} /> Add Class
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Classes',    value: '284' },
          { label: 'Active',           value: '260' },
          { label: 'Full / Sold Out',  value: '18' },
          { label: 'Cancelled',        value: '6' },
        ].map(s => (
          <div key={s.label} className="card">
            <p className="text-2xl font-bold text-ink">{s.value}</p>
            <p className="text-xs text-ink-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost" />
            <input className="input pl-8 h-9 text-sm" placeholder="Search classes…" />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <select className="input h-9 w-auto text-sm py-0">
              <option>All Disciplines</option>
              <option>HIIT</option>
              <option>Strength</option>
              <option>Cardio</option>
              <option>Flexibility</option>
              <option>Core</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-sheet-border">
                <th className="th">Class</th>
                <th className="th">Trainer</th>
                <th className="th">Difficulty</th>
                <th className="th">Capacity</th>
                <th className="th">Price</th>
                <th className="th">Schedule</th>
                <th className="th">Status</th>
                <th className="th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map(c => (
                <tr key={c.id} className="hover:bg-sheet/50 transition-colors">
                  <td className="td">
                    <p className="font-semibold text-ink">{c.title}</p>
                    <p className="text-xs text-ink-ghost">{c.discipline}</p>
                  </td>
                  <td className="td text-ink-muted text-sm">{c.trainer}</td>
                  <td className="td">
                    <span className={`badge text-[10px] ${diffBadge[c.difficulty]}`}>
                      {c.difficulty.charAt(0).toUpperCase() + c.difficulty.slice(1)}
                    </span>
                  </td>
                  <td className="td text-sm">
                    <span className={c.booked >= c.capacity ? 'text-bad font-bold' : 'text-ink'}>
                      {c.booked}/{c.capacity}
                    </span>
                  </td>
                  <td className="td font-semibold text-ink">{c.price === 0 ? 'Free' : `$${c.price}`}</td>
                  <td className="td text-ink-muted text-xs">{c.time}</td>
                  <td className="td">
                    <span className={`badge text-[10px] ${statusBadge[c.status]}`}>
                      {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </span>
                  </td>
                  <td className="td text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="btn btn-ghost p-1.5"><Pencil size={14} /></button>
                      <button className="btn btn-ghost p-1.5 text-bad hover:bg-bad-light"><Trash2 size={14} /></button>
                    </div>
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
