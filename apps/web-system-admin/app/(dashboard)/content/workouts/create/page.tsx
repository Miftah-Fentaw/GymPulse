import { ArrowLeft, Plus, Trash2 } from 'lucide-react'

export default function CreateWorkoutPage() {
  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <a href="/content/workouts" className="btn btn-ghost p-2"><ArrowLeft size={18} /></a>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Create Workout</h1>
          <p className="text-sm text-slate-500 mt-0.5">Build a new workout with exercises</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-4">
          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-700 text-sm">Workout Details</h2>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Title</label>
              <input className="input" placeholder="e.g. Full Body HIIT" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Description</label>
              <textarea className="input resize-none h-20" placeholder="Describe this workout…" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Difficulty</label>
                <select className="input">
                  <option>beginner</option>
                  <option>intermediate</option>
                  <option>advanced</option>
                  <option>all_levels</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Category</label>
                <select className="input">
                  <option>HIIT</option>
                  <option>Strength</option>
                  <option>Cardio</option>
                  <option>Core</option>
                  <option>Flexibility</option>
                </select>
              </div>
            </div>
          </div>

          {/* Exercises */}
          <div className="card space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-700 text-sm">Exercises</h2>
              <button className="btn btn-outline h-8 text-xs"><Plus size={13} /> Add Exercise</button>
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 p-3 bg-surface rounded-xl">
                <span className="text-xs font-bold text-slate-400 w-5 shrink-0">#{i}</span>
                <input className="input flex-1 h-8 text-xs" placeholder="Exercise name" />
                <input className="input w-16 h-8 text-xs text-center" placeholder="Sets" />
                <input className="input w-20 h-8 text-xs text-center" placeholder="Reps" />
                <button className="btn btn-ghost p-1.5 text-danger hover:bg-danger/10 shrink-0"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card space-y-3">
            <h2 className="font-semibold text-slate-700 text-sm">Settings</h2>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Status</label>
              <select className="input">
                <option>Draft</option>
                <option>Published</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Thumbnail URL</label>
              <input className="input" placeholder="https://…" />
            </div>
          </div>
          <div className="flex gap-2">
            <a href="/content/workouts" className="btn btn-outline flex-1">Discard</a>
            <button className="btn btn-primary flex-1">Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}
