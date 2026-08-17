import { ArrowLeft, Zap } from 'lucide-react'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-sidebar-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">GymPulse</p>
            <p className="text-sidebar-muted text-xs">Super Admin Panel</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <a href="/login" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 mb-4">
            <ArrowLeft size={13} /> Back to sign in
          </a>
          <h1 className="text-xl font-bold text-slate-800 mb-1">Reset Password</h1>
          <p className="text-sm text-slate-400 mb-6">
            Enter your email and we'll send a reset link.
          </p>
          <form className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 block">Email</label>
              <input type="email" className="input" placeholder="admin@gympulse.app" />
            </div>
            <button type="submit" className="btn btn-primary w-full h-11">Send Reset Link</button>
          </form>
        </div>
      </div>
    </div>
  )
}
