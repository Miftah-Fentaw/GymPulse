'use client';

import { useState } from 'react';
import { ArrowLeft, Zap, Loader2 } from 'lucide-react';
import { apiFetch } from '../../../lib/apiClient';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);
    const { error } = await apiFetch('/admin/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim() }),
    });
    setSubmitting(false);
    if (error) {
      setErrorMsg(error);
      return;
    }
    setSuccessMsg('If an admin account exists, a reset email has been sent.');
  };

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
            Enter your email and we&apos;ll send a reset link.
          </p>
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs">
              {successMsg}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 block">Email</label>
              <input
                type="email"
                className="input"
                placeholder="Email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full h-11" disabled={submitting}>
              {submitting ? <Loader2 size={16} className="animate-spin" /> : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
