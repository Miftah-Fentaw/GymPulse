'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Megaphone, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '../../../../lib/apiClient';
import { asList } from '../../../../lib/utils';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState('all');
  const [expiresAt, setExpiresAt] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await apiFetch('/admin/system/announcements');
    if (error) {
      setErrorMsg(error);
      setAnnouncements([]);
    } else {
      setAnnouncements(asList(data));
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    setSubmitting(true);
    const payload: Record<string, any> = {
      title: title.trim(),
      message: message.trim(),
      audience,
    };
    if (expiresAt) payload.expires_at = new Date(expiresAt).toISOString();
    const { error } = await apiFetch('/admin/system/announcements', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setSubmitting(false);
    if (error) {
      alert(error);
      return;
    }
    setTitle('');
    setMessage('');
    setAudience('all');
    setExpiresAt('');
    load();
  };

  const handleDelete = async (id: string, aTitle: string) => {
    if (!confirm(`Delete announcement "${aTitle}"? This cannot be undone.`)) return;
    const { error } = await apiFetch(`/admin/system/announcements/${id}`, { method: 'DELETE' });
    if (error) alert(error);
    else load();
  };

  const isActive = (a: any) => {
    if (!a.expires_at) return true;
    return new Date(a.expires_at).getTime() > Date.now();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Announcements</h1>
        <p className="text-sm text-slate-500 mt-0.5">Platform-wide announcements shown to app users</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-400 gap-2 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading announcements…
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => {
            const active = isActive(a);
            return (
              <div key={a.id} className="card">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-brand/10' : 'bg-slate-100'}`}>
                    <Megaphone size={18} className={active ? 'text-brand' : 'text-slate-400'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-800">{a.title}</h3>
                      <span className={`badge ${active ? 'badge-success' : 'badge-neutral'}`}>
                        {active ? 'Active' : 'Expired'}
                      </span>
                      {a.audience && <span className="badge badge-neutral">{a.audience}</span>}
                    </div>
                    <p className="text-sm text-slate-500">{a.message}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      {a.created_at ? new Date(a.created_at).toLocaleString() : '—'}
                      {a.expires_at ? ` · expires ${new Date(a.expires_at).toLocaleString()}` : ''}
                    </p>
                  </div>
                  <button
                    className="btn btn-ghost p-1.5 text-danger hover:bg-danger-light shrink-0"
                    title="Delete"
                    onClick={() => handleDelete(a.id, a.title)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
          {announcements.length === 0 && !errorMsg && (
            <div className="card text-center py-10 text-slate-400 text-sm">No announcements yet</div>
          )}
        </div>
      )}

      <form className="card" onSubmit={handleCreate}>
        <h3 className="font-semibold text-slate-800 mb-4">Create Announcement</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Title</label>
            <input className="input" placeholder="Announcement title..." value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Message</label>
            <textarea className="input resize-none h-24" placeholder="Write your announcement message..." value={message} onChange={(e) => setMessage(e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Audience</label>
              <select className="input" value={audience} onChange={(e) => setAudience(e.target.value)}>
                <option value="all">all</option>
                <option value="users">users</option>
                <option value="admins">admins</option>
                <option value="shop_admins">shop_admins</option>
                <option value="sport_admins">sport_admins</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Expires at (optional)</label>
              <input type="datetime-local" className="input" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Publish Announcement
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
