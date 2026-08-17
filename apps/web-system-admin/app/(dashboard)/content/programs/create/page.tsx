import { ArrowLeft, Plus, Trash2 } from 'lucide-react'

const availableWorkouts = [
  'Full Body HIIT', 'Beginner Upper Body', 'Core Blast', 'Yoga Flow Morning', 'Power Legs',
]

export default function CreateProgramPage() {
  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <a href="/content/programs" className="btn btn-ghost p-2"><ArrowLeft size={18} /></a>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Create Program</h1>
          <p className="text-sm text-slate-500 mt-0.5">Build a multi-week fitness program</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-4">
          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-700 text-sm">Program Details</h2>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Program Title</label>
              <input className="input" placeholder="e.g. 12-Week Fat Loss" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Description</label>
              <textarea className="input resize-none h-20" placeholder="Describe this program…" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Difficulty Level</label>
                <select className="input">
                  <option>beginner</option><option>intermediate</option><option>advanced</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Duration (weeks)</label>
                <input type="number" className="input" placeholder="12" />
              </div>
            </div>
          </div>

          {/* Weekly schedule */}
          <div className="card space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-700 text-sm">Weekly Schedule</h2>
              <button className="btn btn-outline h-8 text-xs"><Plus size={13} /> Add Week</button>
            </div>
            {['Week 1', 'Week 2'].map(wk => (
              <div key={wk} className="border border-surface-border rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-700">{wk}</p>
                  <button className="btn btn-ghost p-1 text-danger hover:bg-danger/10"><Trash2 size={13} /></button>
                </div>
                <select className="input text-sm">
                  <option value="">Select workout…</option>
                  {availableWorkouts.map(w => <option key={w}>{w}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card space-y-3">
            <h2 className="font-semibold text-slate-700 text-sm">Settings</h2>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Status</label>
              <select className="input"><option>Draft</option><option>Published</option></select>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" className="rounded" /> Mark as Premium
            </label>
          </div>
          <div className="flex gap-2">
            <a href="/content/programs" className="btn btn-outline flex-1">Discard</a>
            <button className="btn btn-primary flex-1">Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}
