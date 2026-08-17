import { ArrowLeft } from 'lucide-react'

export default function CreateAdminPage() {
  return (
    <div className="space-y-5 max-w-xl">
      <div className="flex items-center gap-3">
        <a href="/admins" className="btn btn-ghost p-2"><ArrowLeft size={18} /></a>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Create Admin</h1>
          <p className="text-sm text-slate-500 mt-0.5">Add a new admin account with a specific role</p>
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="font-semibold text-slate-700 text-sm border-b border-surface-border pb-3">Admin Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Full Name</label>
            <input className="input" placeholder="e.g. Rania Khalil" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Email Address</label>
            <input type="email" className="input" placeholder="rania@gympulse.app" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Password</label>
            <input type="password" className="input" placeholder="Min 8 characters" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Confirm Password</label>
            <input type="password" className="input" placeholder="Repeat password" />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">Admin Role</label>
          <select className="input">
            <option value="">Select a role…</option>
            <option value="user_admin">User Admin — manage app users</option>
            <option value="shop_admin">Shop Admin — manage products & orders</option>
            <option value="sport_admin">Sport Admin — manage workouts & content</option>
          </select>
          <p className="text-[11px] text-slate-400 mt-1">Super Admin accounts can only be created by modifying Supabase directly.</p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <a href="/admins" className="btn btn-outline">Cancel</a>
          <button className="btn btn-primary">Create Admin</button>
        </div>
      </div>
    </div>
  )
}
