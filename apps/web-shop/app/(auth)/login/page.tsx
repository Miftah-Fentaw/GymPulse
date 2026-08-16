import { Zap } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-base text-gray-800 leading-tight">GymPulse</p>
            <p className="text-[11px] text-gray-400">Shop Admin</p>
          </div>
        </div>

        <div className="card">
          <h1 className="text-lg font-bold text-gray-800 mb-0.5">Sign in</h1>
          <p className="text-xs text-gray-400 mb-5">Access your shop admin panel</p>

          <form className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Email</label>
              <input type="email" className="input" placeholder="shop@gympulse.app" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Password</label>
              <input type="password" className="input" placeholder="••••••••" />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
                <input type="checkbox" className="rounded" /> Remember me
              </label>
              <a href="#" className="text-xs text-brand hover:underline">Forgot password?</a>
            </div>
            <button type="submit" className="btn btn-primary w-full h-10">Sign In</button>
          </form>
        </div>

        <p className="text-center text-[11px] text-gray-400 mt-5">GymPulse Shop Admin · Shop Admin Only</p>
      </div>
    </div>
  )
}
