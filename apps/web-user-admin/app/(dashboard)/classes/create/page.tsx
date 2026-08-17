import { ArrowLeft } from 'lucide-react'

export default function CreateClassPage() {
  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        <a href="/classes" className="btn btn-ghost p-2"><ArrowLeft size={18} /></a>
        <div>
          <h1 className="text-xl font-bold text-ink">Add Class</h1>
          <p className="text-sm text-ink-muted mt-0.5">Schedule a new fitness class</p>
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="font-semibold text-ink text-sm border-b border-sheet-border pb-3">Class Details</h2>
        <div>
          <label className="text-xs font-medium text-ink-muted mb-1 block">Class Title</label>
          <input className="input" placeholder="e.g. Morning Yoga Flow" />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-muted mb-1 block">Description</label>
          <textarea className="input resize-none h-20" placeholder="Describe this class…" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Discipline</label>
            <select className="input">
              <option>HIIT</option><option>Strength</option><option>Cardio</option>
              <option>Flexibility</option><option>Core</option><option>Recovery</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Difficulty</label>
            <select className="input">
              <option>beginner</option><option>intermediate</option><option>advanced</option><option>all_levels</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Trainer</label>
            <select className="input">
              <option>Felix Wagner</option><option>Rania Khalil</option>
              <option>Omar Siddiqui</option><option>Elena Popov</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Max Participants</label>
            <input type="number" className="input" placeholder="20" />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Start Time</label>
            <input type="datetime-local" className="input" />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">End Time</label>
            <input type="datetime-local" className="input" />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Duration (min)</label>
            <input type="number" className="input" placeholder="45" />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Price ($)</label>
            <input type="number" className="input" placeholder="0 for free" />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <a href="/classes" className="btn btn-outline">Cancel</a>
          <button className="btn btn-ink">Create Class</button>
        </div>
      </div>
    </div>
  )
}
