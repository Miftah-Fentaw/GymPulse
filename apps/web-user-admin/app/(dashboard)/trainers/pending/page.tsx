import { ShieldCheck, X, Check, Star } from 'lucide-react'

const pendingTrainers = [
  {
    name: 'Elena Popov', email: 'elena@gympulse.app', specialties: ['Cardio', 'Core'],
    exp: 4, certs: ['NASM CPT'], submitted: 'Apr 10, 2025',
  },
  {
    name: 'Hassan Karimi', email: 'hassan@gympulse.app', specialties: ['Boxing', 'HIIT'],
    exp: 7, certs: ['ACE', 'RKC Kettlebell'], submitted: 'Apr 12, 2025',
  },
  {
    name: 'Mei Zhang', email: 'mei@gympulse.app', specialties: ['Yoga', 'Flexibility'],
    exp: 5, certs: ['RYT-200', 'ACE Health Coach'], submitted: 'Apr 13, 2025',
  },
]

export default function PendingTrainersPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-warn-light flex items-center justify-center">
          <ShieldCheck size={20} className="text-warn" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-ink">Pending Trainer Review</h1>
          <p className="text-sm text-ink-muted mt-0.5">{pendingTrainers.length} trainers awaiting verification</p>
        </div>
      </div>

      <div className="space-y-3">
        {pendingTrainers.map((t, i) => (
          <div key={i} className="card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sheet border border-sheet-border flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-ink">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-ink">{t.name}</p>
                    <p className="text-xs text-ink-ghost">{t.email}</p>
                  </div>
                  <span className="text-xs text-ink-ghost shrink-0">Submitted {t.submitted}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {t.specialties.map(s => (
                    <span key={s} className="badge badge-neutral text-[10px]">{s}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-ink-muted">
                  <span>{t.exp} yrs experience</span>
                  <span>{t.certs.join(' · ')}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-sheet-border">
              <button className="btn btn-ink flex-1 h-9 gap-1.5">
                <Check size={14} /> Verify Trainer
              </button>
              <button className="btn btn-outline flex-1 h-9 gap-1.5 text-bad border-bad hover:bg-bad-light">
                <X size={14} /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
