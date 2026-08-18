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
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-base text-gray-800 leading-tight">GymPulse</p>
            <p className="text-[11px] text-gray-400">Shop Admin Portal</p>
          </div>
        </div>

        <div className="card shadow-xl border border-gray-100 p-6 rounded-2xl bg-white">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-lg font-bold text-gray-800">Shop Admin Login</h1>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <ShieldCheck size={10} /> Go Backend API
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-5">
            Enter your credentials. All authentication requests are processed via the Go backend gateway.
          </p>

          {backendError && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
              <ServerCrash size={15} className="mt-0.5 flex-shrink-0 text-amber-600" />
              <div>
                <p className="font-bold">Backend Communication Notice</p>
                <p className="mt-0.5">{backendError}</p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle size={15} className="mt-0.5 flex-shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full"
                placeholder="Email"
                autoComplete="off"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full"
                placeholder="Password"
                autoComplete="off"
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full h-10 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Connecting to Backend...
                </>
              ) : (
                'Sign In to Shop Admin'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-gray-400 mt-5">
          GymPulse Monorepo · Strict Shop Admin Authentication
        </p>
      </div>
    </div>
  );
}
