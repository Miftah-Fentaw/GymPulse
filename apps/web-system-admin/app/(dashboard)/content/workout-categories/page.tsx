import { Plus, Pencil, Trash2 } from 'lucide-react'

const categories = [
  { id: '1', name: 'HIIT',        slug: 'hiit',        workouts: 22 },
  { id: '2', name: 'Strength',    slug: 'strength',    workouts: 35 },
  { id: '3', name: 'Core',        slug: 'core',        workouts: 14 },
  { id: '4', name: 'Flexibility', slug: 'flexibility', workouts: 11 },
  { id: '5', name: 'Cardio',      slug: 'cardio',      workouts: 18 },
  { id: '6', name: 'Recovery',    slug: 'recovery',    workouts: 8  },
]

export default function WorkoutCategoriesPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Workout Categories</h1>
          <p className="text-sm text-slate-500 mt-0.5">Organise workouts into categories</p>
        </div>
        <button className="btn btn-primary"><Plus size={15} /> Add Category</button>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-th">Name</th>
              <th className="table-th">Slug</th>
              <th className="table-th">Workouts</th>
              <th className="table-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} className="hover:bg-surface/40 transition-colors">
                <td className="table-td font-semibold text-slate-800">{c.name}</td>
                <td className="table-td font-mono text-xs text-slate-400">{c.slug}</td>
                <td className="table-td">{c.workouts}</td>
                <td className="table-td text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="btn btn-ghost p-1.5"><Pencil size={14} /></button>
                    <button className="btn btn-ghost p-1.5 text-danger hover:bg-danger/10"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card max-w-md">
        <h3 className="font-semibold text-slate-700 text-sm mb-3">Add Category</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Name</label>
            <input className="input" placeholder="e.g. Pilates" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Slug</label>
            <input className="input" placeholder="e.g. pilates" />
          </div>
        </div>
        <div className="flex justify-end mt-3">
          <button className="btn btn-primary">Create</button>
        </div>
      </div>
    </div>
  )
}
