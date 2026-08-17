import { Zap } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-sheet flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-2xl bg-ink flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-base text-ink leading-tight">GymPulse</p>
            <p className="text-[10px] text-ink-ghost">User Admin Panel</p>
          </div>
        </div>

        <div className="card">
          <h1 className="text-xl font-bold text-ink mb-0.5">Welcome back</h1>
          <p className="text-sm text-ink-muted mb-6">Sign in to your account</p>

          <form className="space-y-4">
            <div>
              <label className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5 block">Email</label>
              <input type="email" className="input" placeholder="admin@gympulse.app" />
            </div>
            <div>
              <label className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5 block">Password</label>
              <input type="password" className="input" placeholder="••••••••" />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-sm text-ink-muted cursor-pointer">
                <input type="checkbox" className="rounded-md" /> Remember me
              </label>
              <a href="#" className="text-sm text-ink hover:underline font-medium">Forgot password?</a>
            </div>
            <button type="submit" className="btn btn-ink w-full h-11 text-base">Sign In</button>
          </form>
        </div>

        <p className="text-center text-xs text-ink-ghost mt-6">GymPulse v1.0 · User Admin Only</p>
      </div>
    </div>
  )
}
