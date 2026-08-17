import { Plus, Pencil, Trash2, MapPin } from 'lucide-react'

const locations = [
  { id: '1', name: 'Dubai Marina Branch',     city: 'Dubai',     country: 'UAE',    address: '14 Marina Walk, Dubai Marina', capacity: 150, active: true  },
  { id: '2', name: 'Abu Dhabi HQ',            city: 'Abu Dhabi', country: 'UAE',    address: 'Corniche Rd, Al Bateen',       capacity: 200, active: true  },
  { id: '3', name: 'Riyadh City Centre',      city: 'Riyadh',    country: 'KSA',    address: 'King Fahd Rd, Al Olaya',       capacity: 120, active: true  },
  { id: '4', name: 'Cairo Downtown',          city: 'Cairo',     country: 'Egypt',  address: '42 Tahrir Square, Downtown',   capacity: 90,  active: false },
]

export default function LocationsPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Locations</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage physical gym locations across regions</p>
        </div>
        <button className="btn btn-primary"><Plus size={15} /> Add Location</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {locations.map(l => (
          <div key={l.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                <MapPin size={18} className="text-brand" />
              </div>
              <span className={`badge text-[10px] ${l.active ? 'badge-success' : 'badge-neutral'}`}>
                {l.active ? 'Open' : 'Closed'}
              </span>
            </div>
            <p className="font-semibold text-slate-800">{l.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{l.city}, {l.country}</p>
            <p className="text-xs text-slate-400 mt-0.5 truncate">{l.address}</p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-border text-xs text-slate-500">
              <span>Capacity: {l.capacity}</span>
              <div className="flex items-center gap-1">
                <button className="btn btn-ghost p-1"><Pencil size={13} /></button>
                <button className="btn btn-ghost p-1 text-danger hover:bg-danger/10"><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add location form */}
      <div className="card max-w-2xl">
        <h3 className="font-semibold text-slate-700 text-sm mb-4">Add New Location</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-xs font-medium text-slate-500 mb-1 block">Branch Name</label>
            <input className="input" placeholder="e.g. Sharjah Al Nahda Branch" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">City</label>
            <input className="input" placeholder="e.g. Sharjah" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Country</label>
            <input className="input" placeholder="e.g. UAE" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-slate-500 mb-1 block">Full Address</label>
            <input className="input" placeholder="Street, district, city" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Capacity</label>
            <input type="number" className="input" placeholder="100" />
          </div>
          <div className="flex items-end">
            <button className="btn btn-primary w-full">Add Location</button>
          </div>
        </div>
      </div>
    </div>
  )
}
