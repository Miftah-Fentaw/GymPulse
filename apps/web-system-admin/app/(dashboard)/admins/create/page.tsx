'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { apiFetch } from '../../../../lib/apiClient';

type Discipline = { id: string; name: string };

export default function CreateAdminPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState('');
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    apiFetch('/admin/disciplines').then(({ data }) => {
      setDisciplines(Array.isArray(data) ? data : []);
    });
  }, []);

  const needsDiscipline = role === 'sport_admin' || role === 'user_admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (password !== confirm) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }
    if (!role) {
      setErrorMsg('Select an admin role.');
      return;
    }

    setSubmitting(true);
    const { data, error } = await apiFetch('/admin/admins', {
      method: 'POST',
      body: JSON.stringify({
        email: email.trim(),
        password,
        full_name: fullName.trim(),
        role,
      }),
    });

    if (error || !data) {
      setSubmitting(false);
      setErrorMsg(error || 'Failed to create admin.');
      return;
    }

    const created = Array.isArray(data) ? data[0] : data;
    const adminId = created?.id;
    if (adminId && needsDiscipline && selectedDisciplines.length > 0) {
      await Promise.all(
        selectedDisciplines.map((discipline_id) =>
          apiFetch(`/admin/admins/${adminId}/disciplines`, {
            method: 'POST',
            body: JSON.stringify({ discipline_id }),
          })
        )
      );
    }

    setSubmitting(false);
    router.push('/admins');
  };

  return (
    <div className="space-y-5 max-w-xl">
      <div className="flex items-center gap-3">
        <a href="/admins" className="btn btn-ghost p-2">
          <ArrowLeft size={18} />
        </a>
        <div>
          <h1 className="text-xl font-bold text-slate-800">Create Admin</h1>
          <p className="text-sm text-slate-500 mt-0.5">Add a new admin account through the Go backend</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <h2 className="font-semibold text-slate-700 text-sm border-b border-surface-border pb-3">Admin Details</h2>
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">{errorMsg}</div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Full Name</label>
            <input
              className="input"
              placeholder="Full name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Email Address</label>
            <input
              type="email"
              className="input"
              placeholder="Email"
              required
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Password</label>
            <input
              type="password"
              className="input"
              placeholder="Min 8 characters"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Confirm Password</label>
            <input
              type="password"
              className="input"
              placeholder="Repeat password"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 mb-1 block">Admin Role</label>
          <select className="input" required value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Select a role…</option>
            <option value="user_admin">User Admin — manage members, classes, trainers</option>
            <option value="shop_admin">Shop Admin — manage products and orders</option>
            <option value="sport_admin">Sport Admin — manage workouts and content</option>
            <option value="super_admin">Super Admin — full platform access</option>
          </select>
        </div>

        {needsDiscipline && (
          <div>
            <label className="text-xs font-medium text-slate-500 mb-2 block">Assigned Disciplines</label>
            {disciplines.length === 0 ? (
              <p className="text-xs text-slate-400">No disciplines yet. Create them under System → Disciplines.</p>
            ) : (
              <div className="space-y-2">
                {disciplines.map((d) => (
                  <label key={d.id} className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={selectedDisciplines.includes(d.id)}
                      onChange={(e) => {
                        setSelectedDisciplines((prev) =>
                          e.target.checked ? [...prev, d.id] : prev.filter((id) => id !== d.id)
                        );
                      }}
                    />
                    {d.name}
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <a href="/admins" className="btn btn-outline">
            Cancel
          </a>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Creating…
              </>
            ) : (
              'Create Admin'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
