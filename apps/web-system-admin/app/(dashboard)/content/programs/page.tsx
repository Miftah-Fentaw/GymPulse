import { Plus, Search, Pencil, Trash2, Globe, EyeOff, Layers } from 'lucide-react'

const programs = [
  { id: '1', title: '12-Week Fat Loss', difficulty: 'intermediate', weeks: 12, workouts: 36, published: true, premium: true, created: 'Jan 15, 2025' },
  { id: '2', title: 'Beginner Starter Pack', difficulty: 'beginner', weeks: 4, workouts: 12, published: true, premium: false, created: 'Feb 1, 2025' },
  { id: '3', title: 'Muscle Builder Pro', difficulty: 'advanced', weeks: 16, workouts: 48, published: false, premium: true, created: 'Mar 20, 2025' },
  { id: '4', title: 'Cardio Endurance Challenge', difficulty: 'intermediate', weeks: 8, workouts: 24, published: true, premium: false, created: 'Apr 2, 2025' },
]

const diffBadge: Record<string, string> = {
  beginner: 'badge-success',
  intermediate: 'badge-warning',
  advanced: 'badge-danger',
}

export default function ProgramsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Programs</h1>
          <p className="text-sm text-slate-500 mt-0.5">Multi-week fitness programs for users</p>
        </div>
        <a href="/content/programs/create" className="btn btn-primary h-9 text-sm">
          <Plus size={16} />
          Create Program
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {programs.map((p) => (
          <div key={p.id} className="card hover:border-brand transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                <Layers size={18} className="text-brand" />
              </div>
              <div className="flex items-center gap-2">
                {p.premium && <span className="badge badge-warning">Premium</span>}
                <span className={`badge ${p.published ? 'badge-success' : 'badge-neutral'}`}>
                  {p.published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">{p.title}</h3>
            <p className="text-xs text-slate-400 mb-3">{p.created}</p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className={`badge ${diffBadge[p.difficulty]}`}>
                {p.difficulty.charAt(0).toUpperCase() + p.difficulty.slice(1)}
              </span>
              <span>{p.weeks} weeks</span>
              <span>{p.workouts} workouts</span>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-surface-border">
              <button className="btn btn-outline h-8 text-xs flex-1">
                <Pencil size={13} />
                Edit
              </button>
              <button className={`btn h-8 text-xs ${p.published ? 'btn-outline text-warning' : 'btn-primary'}`}>
                {p.published ? <EyeOff size={13} /> : <Globe size={13} />}
                {p.published ? 'Unpublish' : 'Publish'}
              </button>
            </div>
          </div>
        ))}
        {/* Add new card */}
        <a href="/content/programs/create" className="card border-dashed flex flex-col items-center justify-center gap-2 hover:border-brand hover:bg-brand/5 transition-all cursor-pointer min-h-[180px]">
          <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center">
            <Plus size={20} className="text-slate-400" />
          </div>
          <p className="text-sm text-slate-400 font-medium">Create New Program</p>
        </a>
      </div>
    </div>
  )
}
