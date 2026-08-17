import { ArrowLeft, Plus, Trash2 } from 'lucide-react'

export default function CreateTrainerPage() {
  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        <a href="/trainers" className="btn btn-ghost p-2"><ArrowLeft size={18} /></a>
        <div>
          <h1 className="text-xl font-bold text-ink">Add Trainer</h1>
          <p className="text-sm text-ink-muted mt-0.5">Register a new trainer profile</p>
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="font-semibold text-ink text-sm border-b border-sheet-border pb-3">Profile Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Full Name</label>
            <input className="input" placeholder="e.g. Felix Wagner" />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Email</label>
            <input type="email" className="input" placeholder="felix@gympulse.app" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-ink-muted mb-1 block">Bio</label>
            <textarea className="input resize-none h-20" placeholder="Trainer biography…" />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Years of Experience</label>
            <input type="number" className="input" placeholder="5" />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-muted mb-1 block">Hourly Rate ($)</label>
            <input type="number" className="input" placeholder="80" />
          </div>
        </div>

        {/* Specialties */}
        <div>
          <label className="text-xs font-medium text-ink-muted mb-1 block">Specialties</label>
          <div className="space-y-2">
            {['HIIT', 'Strength'].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <input className="input flex-1" defaultValue={s} />
                <button className="btn btn-ghost p-1.5 text-bad hover:bg-bad-light"><Trash2 size={14} /></button>
              </div>
            ))}
            <button className="btn btn-outline h-8 text-xs w-full"><Plus size={13} /> Add Specialty</button>
          </div>
        </div>

        {/* Certifications */}
        <div>
          <label className="text-xs font-medium text-ink-muted mb-1 block">Certifications</label>
          <div className="space-y-2">
            {['ACE Personal Trainer'].map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <input className="input flex-1" defaultValue={c} />
                <button className="btn btn-ghost p-1.5 text-bad hover:bg-bad-light"><Trash2 size={14} /></button>
              </div>
            ))}
            <button className="btn btn-outline h-8 text-xs w-full"><Plus size={13} /> Add Certification</button>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <a href="/trainers" className="btn btn-outline">Cancel</a>
          <button className="btn btn-ink">Create Trainer</button>
        </div>
      </div>
    </div>
  )
}
