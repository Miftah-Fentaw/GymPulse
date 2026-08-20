'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch, asArray } from '../../../../lib/apiClient';

export default function CreateTrainerPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [profileId, setProfileId] = useState('');
  const [bio, setBio] = useState('');
  const [years, setYears] = useState('');
  const [rate, setRate] = useState('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [certs, setCerts] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg(null);
      const { data, error } = await apiFetch('/admin/users');
      if (error) {
        setErrorMsg(error);
        setUsers([]);
      } else {
        setUsers(asArray(data?.users ?? data));
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileId) {
      alert('Select a member profile. profile_id is required.');
      return;
    }
    setIsSubmitting(true);
    const payload = {
      profile_id: profileId,
      bio,
      specialties: specialties.map((s) => s.trim()).filter(Boolean),
      certifications: certs.map((s) => s.trim()).filter(Boolean),
      years_experience: years ? Number(years) : 0,
      hourly_rate: rate ? Number(rate) : 0,
    };
    const { error } = await apiFetch('/admin/trainers', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (error) {
      alert(error);
      setIsSubmitting(false);
      return;
    }
    router.push('/trainers');
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-3">
        <a href="/trainers" className="btn btn-ghost p-2"><ArrowLeft size={18} /></a>
        <div>
          <h1 className="text-xl font-bold text-ink">Add Trainer</h1>
          <p className="text-sm text-ink-muted mt-0.5">Register a new trainer profile from an existing member</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-4">
        <h2 className="font-semibold text-ink text-sm border-b border-sheet-border pb-3">Profile Information</h2>
        {loading ? (
          <div className="flex items-center gap-2 text-ink-ghost py-6">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-xs">Loading members…</span>
          </div>
        ) : (
          <>
            <div>
              <label className="text-xs font-medium text-ink-muted mb-1 block">Member profile (required)</label>
              <select
                className="input"
                required
                value={profileId}
                onChange={(e) => setProfileId(e.target.value)}
              >
                <option value="">Select a member…</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.full_name ? `${u.full_name} (${u.email})` : u.email || u.id}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-ink-muted mb-1 block">Bio</label>
              <textarea
                className="input resize-none h-20"
                placeholder="Trainer biography…"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-ink-muted mb-1 block">Years of Experience</label>
                <input
                  type="number"
                  className="input"
                  placeholder="0"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-ink-muted mb-1 block">Hourly Rate ($)</label>
                <input
                  type="number"
                  className="input"
                  placeholder="0"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-ink-muted mb-1 block">Specialties</label>
              <div className="space-y-2">
                {specialties.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      className="input flex-1"
                      value={s}
                      onChange={(e) => {
                        const next = [...specialties];
                        next[i] = e.target.value;
                        setSpecialties(next);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setSpecialties(specialties.filter((_, idx) => idx !== i))}
                      className="btn btn-ghost p-1.5 text-bad hover:bg-bad-light"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setSpecialties([...specialties, ''])}
                  className="btn btn-outline h-8 text-xs w-full"
                >
                  <Plus size={13} /> Add Specialty
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-ink-muted mb-1 block">Certifications</label>
              <div className="space-y-2">
                {certs.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      className="input flex-1"
                      value={c}
                      onChange={(e) => {
                        const next = [...certs];
                        next[i] = e.target.value;
                        setCerts(next);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setCerts(certs.filter((_, idx) => idx !== i))}
                      className="btn btn-ghost p-1.5 text-bad hover:bg-bad-light"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setCerts([...certs, ''])}
                  className="btn btn-outline h-8 text-xs w-full"
                >
                  <Plus size={13} /> Add Certification
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <a href="/trainers" className="btn btn-outline">Cancel</a>
              <button type="submit" disabled={isSubmitting} className="btn btn-ink">
                {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : 'Create Trainer'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
