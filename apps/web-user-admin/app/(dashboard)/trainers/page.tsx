import { Plus, Search, Star, Pencil, Trash2 } from 'lucide-react'

const trainers = [
  { id: '1', name: 'Felix Wagner',  email: 'felix@gympulse.app',  specialties: ['HIIT','Strength'],       exp: 6, rating: 4.9, classes: 48, verified: true,  status: 'active'  },
  { id: '2', name: 'Rania Khalil',  email: 'rania@gympulse.app',  specialties: ['Yoga','Flexibility'],    exp: 8, rating: 4.8, classes: 60, verified: true,  status: 'active'  },
  { id: '3', name: 'Omar Siddiqui', email: 'omar@gympulse.app',   specialties: ['Powerlifting','Cardio'], exp: 5, rating: 4.7, classes: 32, verified: true,  status: 'active'  },
  { id: '4', name: 'Elena Popov',   email: 'elena@gympulse.app',  specialties: ['Cardio','Core'],         exp: 4, rating: 4.5, classes: 28, verified: false, status: 'pending' },
]

function Stars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={11} className={i <= Math.floor(n) ? 'text-amber-400 fill-amber-400' : 'text-sheet-border fill-sheet-border'} />
      ))}
      <span className="text-xs text-ink-muted ml-1">{n}</span>
    </div>
  )
}

export default function TrainersPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Trainers</h1>
          <p className="text-sm text-ink-muted mt-0.5">Manage certified gym trainers</p>
        </div>
        <a href="/trainers/create" className="btn btn-ink">
          <Plus size={15} /> Add Trainer
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trainers.map(t => (
          <div key={t.id} className="card text-center">
            <div className="w-14 h-14 rounded-full bg-sheet border-2 border-sheet-border flex items-center justify-center mx-auto mb-3">
              <span className="text-base font-bold text-ink">
                {t.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <p className="font-bold text-ink">{t.name}</p>
            <p className="text-xs text-ink-ghost mb-2">{t.email}</p>
            <div className="flex flex-wrap gap-1 justify-center mb-3">
              {t.specialties.map(s => (
                <span key={s} className="badge badge-neutral text-[10px]">{s}</span>
              ))}
            </div>
            <Stars n={t.rating} />
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-sheet-border text-xs text-ink-muted">
              <span>{t.exp}y exp</span>
              <span>{t.classes} classes</span>
              <span className={`badge text-[10px] ${t.verified ? 'badge-ok' : 'badge-warn'}`}>
                {t.verified ? 'Verified' : 'Pending'}
              </span>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="btn btn-outline flex-1 h-8 text-xs"><Pencil size={12} /> Edit</button>
              <button className="btn btn-ghost h-8 text-xs text-bad hover:bg-bad-light"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
