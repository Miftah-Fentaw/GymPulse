import { Plus, Pencil, Trash2 } from 'lucide-react'

const contentCategories = [
  { id: '1', name: 'Nutrition', slug: 'nutrition', posts: 18 },
  { id: '2', name: 'Technique', slug: 'technique', posts: 12 },
  { id: '3', name: 'Recovery', slug: 'recovery', posts: 7 },
  { id: '4', name: 'News', slug: 'news', posts: 5 },
  { id: '5', name: 'Motivation', slug: 'motivation', posts: 9 },
]

const workoutCategories = [
  { id: '1', name: 'HIIT', slug: 'hiit', workouts: 22 },
  { id: '2', name: 'Strength', slug: 'strength', workouts: 35 },
  { id: '3', name: 'Core', slug: 'core', workouts: 14 },
  { id: '4', name: 'Flexibility', slug: 'flexibility', workouts: 11 },
  { id: '5', name: 'Cardio', slug: 'cardio', workouts: 18 },
  { id: '6', name: 'Recovery', slug: 'recovery', workouts: 8 },
]

function CategoryTable({ rows, countLabel }: { rows: { id: string; name: string; slug: string; [k: string]: string | number }[]; countLabel: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="table-th">Name</th>
            <th className="table-th">Slug</th>
            <th className="table-th">{countLabel}</th>
            <th className="table-th text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-surface/40 transition-colors">
              <td className="table-td font-medium text-slate-800">{r.name}</td>
              <td className="table-td font-mono text-xs text-slate-400">{r.slug}</td>
              <td className="table-td">
                {Object.entries(r).find(([k]) => k !== 'id' && k !== 'name' && k !== 'slug')?.[1]}
              </td>
              <td className="table-td text-right">
                <div className="flex items-center justify-end gap-1">
                  <button className="btn btn-ghost p-1.5"><Pencil size={14} /></button>
                  <button className="btn btn-ghost p-1.5 text-danger hover:bg-danger-light"><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Categories</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage content and workout categories</p>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
          <p className="font-semibold text-slate-700">Content Categories</p>
          <button className="btn btn-primary h-8 text-xs"><Plus size={14} />Add Category</button>
        </div>
        <CategoryTable rows={contentCategories} countLabel="Posts" />
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
          <p className="font-semibold text-slate-700">Workout Categories</p>
          <button className="btn btn-primary h-8 text-xs"><Plus size={14} />Add Category</button>
        </div>
        <CategoryTable rows={workoutCategories} countLabel="Workouts" />
      </div>
    </div>
  )
}
