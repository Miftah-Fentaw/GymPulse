import { Save, Key } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800">My Profile</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your super admin account details</p>
      </div>

      {/* Avatar + name */}
      <div className="card flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-sidebar-bg flex items-center justify-center shrink-0">
          <span className="text-xl font-bold text-white">SA</span>
        </div>
        <div className="flex-1">
          <p className="font-bold text-slate-800 text-lg">Super Admin</p>
          <p className="text-sm text-slate-400">admin@gympulse.app</p>
          <p className="text-xs mt-1">
            <span className="badge badge-info">super_admin</span>
          </p>
        </div>
        <button className="btn btn-outline text-sm">Change Avatar</button>
      </div>

      {/* Profile form */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-slate-700 pb-2 border-b border-surface-border">Profile Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Full Name</label>
            <input className="input" defaultValue="Super Admin" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Email Address</label>
            <input type="email" className="input" defaultValue="admin@gympulse.app" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Phone</label>
            <input className="input" placeholder="+1 555 000 0000" />
          </div>
        </div>
        <div className="flex justify-end">
          <button className="btn btn-primary gap-1.5"><Save size={14} /> Save Changes</button>
        </div>
      </div>

      {/* Password */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-slate-700 pb-2 border-b border-surface-border">Change Password</h2>
        <div className="grid grid-cols-1 gap-3 max-w-sm">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Current Password</label>
            <input type="password" className="input" placeholder="••••••••" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">New Password</label>
            <input type="password" className="input" placeholder="Min 8 characters" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Confirm New Password</label>
            <input type="password" className="input" placeholder="Repeat new password" />
          </div>
        </div>
        <div className="flex justify-end">
          <button className="btn btn-primary gap-1.5"><Key size={14} /> Update Password</button>
        </div>
      </div>
    </div>
  )
}
