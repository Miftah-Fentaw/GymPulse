import { Plus, Search, Pencil, Trash2, Globe, EyeOff, Dumbbell } from 'lucide-react'

const workouts = [
  { id: '1', title: 'Full Body HIIT', category: 'HIIT', difficulty: 'intermediate', exercises: 12, duration: 45, published: true, created: 'Mar 10, 2025' },
  { id: '2', title: 'Beginner Upper Body', category: 'Strength', difficulty: 'beginner', exercises: 8, duration: 30, published: true, created: 'Mar 8, 2025' },
  { id: '3', title: 'Core Blast', category: 'Core', difficulty: 'advanced', exercises: 10, duration: 25, published: false, created: 'Apr 1, 2025' },
  { id: '4', title: 'Yoga Flow Morning', category: 'Flexibility', difficulty: 'beginner', exercises: 15, duration: 40, published: true, created: 'Feb 20, 2025' },
  { id: '5', title: 'Power Legs', category: 'Strength', difficulty: 'advanced', exercises: 9, duration: 50, published: true, created: 'Apr 5, 2025' },
]

const diffBadge: Record<string, string> = {
  beginner: 'badge-success',
  intermediate: 'badge-warning',
  advanced: 'badge-danger',
  all_levels: 'badge-neutral',
}

export default function WorkoutsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Workouts</h1>
          <p className="text-sm text-slate-500 mt-0.5">Create and manage workout content</p>
        </div>
        <a href="/content/workouts/create" className="btn btn-primary h-9 text-sm">
          <Plus size={16} />
          Create Workout
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: '128', color: 'text-brand' },
          { label: 'Published', value: '112', color: 'text-success' },
          { label: 'Drafts', value: '16', color: 'text-warning' },
          { label: 'Categories', value: '8', color: 'text-slate-600' },
        ].map((s) => (
          <div key={s.label} className="card py-4">
            <p className="text-xs text-slate-400">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-8 h-9 text-sm" placeholder="Search workouts..." />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <select className="input h-9 w-auto text-sm py-0">
              <option>All Difficulties</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <select className="input h-9 w-auto text-sm py-0">
              <option>All Statuses</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-th">Workout</th>
                <th className="table-th">Category</th>
                <th className="table-th">Difficulty</th>
                <th className="table-th">Exercises</th>
                <th className="table-th">Duration</th>
                <th className="table-th">Status</th>
                <th className="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((w) => (
                <tr key={w.id} className="hover:bg-surface/40 transition-colors">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                        <Dumbbell size={16} className="text-brand" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{w.title}</p>
                        <p className="text-xs text-slate-400">{w.created}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-td">
                    <span className="badge badge-neutral">{w.category}</span>
                  </td>
                  <td className="table-td">
                    <span className={`badge ${diffBadge[w.difficulty]}`}>
                      {w.difficulty.charAt(0).toUpperCase() + w.difficulty.slice(1)}
                    </span>
                  </td>
                  <td className="table-td">{w.exercises}</td>
                  <td className="table-td">{w.duration} min</td>
                  <td className="table-td">
                    <span className={`badge ${w.published ? 'badge-success' : 'badge-neutral'}`}>
                      {w.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="table-td text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        className={`btn btn-ghost p-1.5 ${w.published ? 'text-warning hover:bg-warning-light' : 'text-success hover:bg-success-light'}`}
                        title={w.published ? 'Unpublish' : 'Publish'}
                      >
                        {w.published ? <EyeOff size={15} /> : <Globe size={15} />}
                      </button>
                      <button className="btn btn-ghost p-1.5" title="Edit">
                        <Pencil size={15} />
                      </button>
                      <button className="btn btn-ghost p-1.5 text-danger hover:bg-danger-light" title="Delete">
                        <Trash2 size={15} />
                      </button>
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
