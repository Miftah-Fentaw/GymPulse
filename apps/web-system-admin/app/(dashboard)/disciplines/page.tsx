import { Plus, Pencil, Trash2 } from 'lucide-react'

const disciplines = [
  { id: '1', name: 'HIIT',        slug: 'hiit',        color: '#EF4444', classes: 22, active: true  },
  { id: '2', name: 'Strength',    slug: 'strength',    color: '#3B82F6', classes: 35, active: true  },
  { id: '3', name: 'Cardio',      slug: 'cardio',      color: '#F59E0B', classes: 18, active: true  },
  { id: '4', name: 'Flexibility', slug: 'flexibility', color: '#10B981', classes: 11, active: true  },
  { id: '5', name: 'Core',        slug: 'core',        color: '#8B5CF6', classes: 14, active: true  },
  { id: '6', name: 'Recovery',    slug: 'recovery',    color: '#14B8A6', classes: 8,  active: false },
]

export default function DisciplinesPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Disciplines</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage sport disciplines used to categorise classes and workouts</p>
        </div>
        <button className="btn btn-primary"><Plus size={15} /> Add Discipline</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {disciplines.map(d => (
          <div key={d.id} className="card text-center hover:border-brand transition-colors cursor-pointer p-4">
            <div
              className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center"
              style={{ background: d.color + '20' }}
            >
              <span className="text-lg font-black" style={{ color: d.color }}>
                {d.name[0]}
              </span>
            </div>
            <p className="font-semibold text-sm text-slate-800">{d.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{d.classes} classes</p>
            <span className={`badge mt-2 text-[10px] ${d.active ? 'badge-success' : 'badge-neutral'}`}>
              {d.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-border flex items-center justify-between">
          <p className="font-semibold text-sm text-slate-700">All Disciplines</p>
          <button className="btn btn-primary h-8 text-xs"><Plus size={13} /> Add</button>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-th">Name</th>
              <th className="table-th">Slug</th>
              <th className="table-th">Color</th>
              <th className="table-th">Classes</th>
              <th className="table-th">Status</th>
              <th className="table-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {disciplines.map(d => (
              <tr key={d.id} className="hover:bg-surface/40 transition-colors">
                <td className="table-td font-semibold text-slate-800">{d.name}</td>
                <td className="table-td font-mono text-xs text-slate-400">{d.slug}</td>
                <td className="table-td">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md border border-surface-border inline-block" style={{ background: d.color }} />
                    <span className="text-xs font-mono text-slate-500">{d.color}</span>
                  </div>
                </td>
                <td className="table-td">{d.classes}</td>
                <td className="table-td">
                  <span className={`badge text-[10px] ${d.active ? 'badge-success' : 'badge-neutral'}`}>
                    {d.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
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

      {/* Quick add form */}
      <div className="card max-w-lg">
        <h3 className="font-semibold text-slate-700 text-sm mb-3">Add Discipline</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Name</label>
            <input className="input" placeholder="e.g. Boxing" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Slug</label>
            <input className="input" placeholder="e.g. boxing" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Color Hex</label>
            <input className="input" placeholder="#3B82F6" />
          </div>
          <div className="flex items-end">
            <button className="btn btn-primary w-full">Create</button>
          </div>
        </div>
      </div>
    </div>
  )
}
