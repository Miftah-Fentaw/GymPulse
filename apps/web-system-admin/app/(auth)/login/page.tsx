'use client';

import React, { useState } from 'react';
import { Zap, AlertCircle, Loader2, ShieldCheck, ServerCrash } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { signIn, backendError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await signIn(email, password);
    if (!res.success) {
      setErrorMsg(res.error || 'Authentication failed via Backend API');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-sheet flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-ink flex items-center justify-center shadow-lg">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-lg text-ink leading-tight">GymPulse</p>
            <p className="text-xs text-ink-ghost font-medium">System Admin Portal</p>
          </div>
        </div>

        <div className="card shadow-xl border border-gray-100 p-8 rounded-2xl bg-white">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-ink">System Admin Login</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <ShieldCheck size={12} /> Go Backend API
            </span>
          </div>
          <p className="text-sm text-ink-muted mb-6">
            Enter your system administrator credentials. All auth requests are processed via the Go backend.
          </p>

          {backendError && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
              <ServerCrash size={16} className="mt-0.5 flex-shrink-0 text-amber-600" />
              <div>
                <p className="font-bold">Backend Communication Notice</p>
                <p className="mt-0.5">{backendError}</p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <div>
              <label className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2 block">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full h-11 px-3.5 rounded-xl border border-gray-200 focus:border-ink focus:ring-1 focus:ring-ink transition"
                placeholder="Email"
                autoComplete="off"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-2 block">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full h-11 px-3.5 rounded-xl border border-gray-200 focus:border-ink focus:ring-1 focus:ring-ink transition"
                placeholder="Password"
                autoComplete="off"
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-ink w-full h-11 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition hover:bg-black"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Connecting to Backend...
                </>
              ) : (
                'Sign In to System Portal'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-ink-ghost mt-6 font-medium">
          GymPulse Monorepo · Strict System Admin Authentication
        </p>
      </div>
    </div>
  );
}
