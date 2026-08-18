'use client';

import { useState } from 'react';
import { Key, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { apiFetch } from '../../../lib/apiClient';

export default function ProfilePage() {
  const { user, role } = useAuth();
  const email = user?.email || '';
  const fullName = user?.user_metadata?.full_name || '';
  const roleLabel = role ? role.replace('_', ' ') : '';
  const initials = (fullName || email || 'GP').substring(0, 2).toUpperCase();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    const { error } = await apiFetch('/admin/auth/update-password', {
      method: 'PUT',
      body: JSON.stringify({ password }),
    });
    setSubmitting(false);
    if (error) {
      setErrorMsg(error);
      return;
    }
    setPassword('');
    setConfirm('');
    setSuccessMsg('Password updated.');
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800">My Profile</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your super admin account details</p>
      </div>

      <div className="card flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-sidebar-bg flex items-center justify-center shrink-0">
          <span className="text-xl font-bold text-white">{initials}</span>
        </div>
        <div className="flex-1">
          <p className="font-bold text-slate-800 text-lg">{fullName || 'Admin'}</p>
          <p className="text-sm text-slate-400">{email}</p>
          <p className="text-xs mt-1">
            <span className="badge badge-info">{roleLabel}</span>
          </p>
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="font-semibold text-slate-700 pb-2 border-b border-surface-border">Profile Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Full Name</label>
            <input className="input" value={fullName} readOnly placeholder="Full name" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Email Address</label>
            <input type="email" className="input" value={email} readOnly placeholder="Email" />
          </div>
        </div>
      </div>

      <form className="card space-y-4" onSubmit={handlePassword}>
        <h2 className="font-semibold text-slate-700 pb-2 border-b border-surface-border">Change Password</h2>
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">{errorMsg}</div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs">{successMsg}</div>
        )}
        <div className="grid grid-cols-1 gap-3 max-w-sm">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">New Password</label>
            <input
              type="password"
              className="input"
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Confirm New Password</label>
            <input
              type="password"
              className="input"
              placeholder="Repeat new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary gap-1.5" disabled={submitting}>
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Key size={14} />}
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}
