import { HardDrive, Image, Film, User } from 'lucide-react'

const buckets = [
  { name: 'product-images', label: 'Product Images', icon: <Image size={18} className="text-brand" />, bg: 'bg-brand/10', files: 1284, sizeGB: 4.2 },
  { name: 'sport-content', label: 'Sport Content', icon: <Film size={18} className="text-success" />, bg: 'bg-success/10', files: 648, sizeGB: 18.7 },
  { name: 'avatars', label: 'User Avatars', icon: <User size={18} className="text-warning" />, bg: 'bg-warning/10', files: 9821, sizeGB: 2.1 },
]

const totalGB = buckets.reduce((acc, b) => acc + b.sizeGB, 0)
const storageCapacityGB = 100

export default function StoragePage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Storage</h1>
        <p className="text-sm text-slate-500 mt-0.5">Supabase storage buckets overview</p>
      </div>

      {/* Total usage */}
      <div className="card">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center">
            <HardDrive size={22} className="text-brand" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Total Storage Used</p>
            <p className="text-2xl font-bold text-slate-800">{totalGB.toFixed(1)} GB <span className="text-sm font-normal text-slate-400">/ {storageCapacityGB} GB</span></p>
          </div>
          <div className="ml-auto">
            <span className={`badge ${totalGB / storageCapacityGB > 0.8 ? 'badge-danger' : 'badge-success'}`}>
              {Math.round((totalGB / storageCapacityGB) * 100)}% Used
            </span>
          </div>
        </div>
        <div className="h-2.5 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all"
            style={{ width: `${(totalGB / storageCapacityGB) * 100}%` }}
          />
        </div>
      </div>

      {/* Buckets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {buckets.map((b) => (
          <div key={b.name} className="card">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${b.bg}`}>
              {b.icon}
            </div>
            <h3 className="font-semibold text-slate-800">{b.label}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{b.name}</p>
            <div className="mt-4 pt-4 border-t border-surface-border flex items-center justify-between text-sm">
              <span className="text-slate-500">{b.files.toLocaleString()} files</span>
              <span className="font-semibold text-slate-800">{b.sizeGB} GB</span>
            </div>
            <div className="mt-2 h-1.5 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-brand/60 rounded-full"
                style={{ width: `${(b.sizeGB / totalGB) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
