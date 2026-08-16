import { Zap } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-sidebar-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">GymPulse</p>
            <p className="text-sidebar-muted text-xs">Super Admin Panel</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-xl font-bold text-slate-800 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-400 mb-6">Sign in to your admin account</p>

          <form className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                className="input"
                placeholder="admin@gympulse.app"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <a href="/forgot-password" className="text-sm text-brand hover:underline">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn btn-primary w-full h-11">
              Sign In
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-sidebar-muted mt-6">
          GymPulse v1.0 · Super Admin Only
        </p>
      </div>
    </div>
  )
}
