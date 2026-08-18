'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Plus,
  Search,
  CheckCircle,
  Loader2,
  ServerCrash,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { apiFetch } from '../../../../lib/apiClient';

export default function SportContentPage() {
  const { activeDiscipline } = useAuth();
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [contentType, setContentType] = useState('article');

  const fetchArticles = async () => {
    setLoading(true);
    setErrorMsg(null);
    const endpoint = activeDiscipline?.id
      ? `/admin/content?discipline_id=${activeDiscipline.id}`
      : '/admin/content';

    const { data, error } = await apiFetch(endpoint);
    if (error) {
      setErrorMsg(error);
      setArticles([]);
    } else {
      setArticles(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, [activeDiscipline?.id]);

  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setShowCreateModal(true);
    }
  }, [searchParams]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setIsSubmitting(true);
    const payload = {
      title,
      body,
      type: contentType,
      discipline_id: activeDiscipline?.id,
      is_published: true,
    };

    const { error } = await apiFetch('/admin/content', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (error) {
      alert(`Error creating article via Go backend: ${error}`);
    } else {
      setShowCreateModal(false);
      setTitle('');
      setBody('');
      fetchArticles();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article? This cannot be undone.')) return;
    setActionId(id);
    const { error } = await apiFetch(`/admin/content/${id}`, { method: 'DELETE' });
    if (error) alert(error);
    else fetchArticles();
    setActionId(null);
  };

  const handleTogglePublish = async (a: any) => {
    setActionId(a.id);
    const path = a.is_published ? 'unpublish' : 'publish';
    const { error } = await apiFetch(`/admin/content/${a.id}/${path}`, { method: 'POST' });
    if (error) alert(error);
    else fetchArticles();
    setActionId(null);
  };

  const filteredArticles = articles.filter((a) =>
    (a.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.body || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{activeDiscipline?.icon || '🥊'}</span>
            <h1 className="text-xl font-bold text-ink">
              {activeDiscipline?.name || 'Sport'} Articles & Media
            </h1>
          </div>
          <p className="text-xs text-ink-muted mt-0.5">
            Manage sport-specific articles and media content directly from the Go backend.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-ink h-9 text-xs gap-1.5 shrink-0"
        >
          <Plus size={15} /> Publish New Article
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 flex-shrink-0 text-red-500" />
          <div>
            <p className="font-bold">Backend API Unreachable</p>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost" />
          <input
            type="text"
            placeholder="Search articles or media…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-8 h-9 w-full text-xs"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-ink-ghost gap-2">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-xs font-semibold">Loading articles from Go Backend…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArticles.map((a) => (
            <div key={a.id} className="card hover:border-ink/20 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="badge badge-neutral text-[10px]">
                    {a.content_categories?.name || activeDiscipline?.name || 'Article'}
                  </span>
                  <span className="badge badge-ink text-[10px] uppercase">
                    {a.type || 'Article'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-ink">{a.title}</h3>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed line-clamp-3">
                  {a.body || 'No content body.'}
                </p>

                <p className="text-[10px] text-ink-ghost mt-3">
                  Updated: {a.updated_at ? new Date(a.updated_at).toLocaleDateString() : 'Recent'}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-sheet-border flex items-center justify-between gap-2">
                <span className={`flex items-center gap-1 text-[10px] font-bold ${a.is_published ? 'text-emerald-600' : 'text-ink-muted'}`}>
                  <CheckCircle size={12} /> {a.is_published ? 'Published' : 'Draft'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleTogglePublish(a)}
                    disabled={actionId === a.id}
                    className="btn btn-outline h-7 text-[10px]"
                  >
                    {actionId === a.id ? <Loader2 size={12} className="animate-spin" /> : a.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    disabled={actionId === a.id}
                    className="btn btn-ghost p-1.5 text-bad hover:bg-bad-light"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredArticles.length === 0 && !errorMsg && (
            <div className="col-span-full py-12 text-center text-ink-ghost text-xs">
              No articles found for this discipline in the Go backend database.
            </div>
          )}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-card border border-sheet-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-ink">New {activeDiscipline?.name} Article</h3>
              <button onClick={() => setShowCreateModal(false)} className="btn btn-ghost p-1 text-ink-ghost">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-ink-muted block mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master the Jab: Distance & Footwork Secrets"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input w-full text-xs"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-muted block mb-1">Content Body</label>
                <textarea
                  placeholder="Full article content text…"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="input w-full text-xs p-2.5"
                  rows={4}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-muted block mb-1">Content Type</label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="input w-full text-xs"
                  disabled={isSubmitting}
                >
                  <option value="article">Article</option>
                  <option value="video">Video Drill</option>
                  <option value="tip">Coaching Tip</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-sheet-border">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-ghost text-xs"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-ink text-xs flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    'Publish via Backend'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
