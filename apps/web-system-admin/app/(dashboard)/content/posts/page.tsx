'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Trash2, Globe, EyeOff, FileText, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '../../../../lib/apiClient';
import { asList } from '../../../../lib/utils';

export default function ContentPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await apiFetch('/admin/content');
    if (error) {
      setErrorMsg(error);
      setPosts([]);
    } else {
      setPosts(asList(data));
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const togglePublish = async (p: any) => {
    const path = p.is_published
      ? `/admin/content/${p.id}/unpublish`
      : `/admin/content/${p.id}/publish`;
    const { error } = await apiFetch(path, { method: 'POST' });
    if (error) alert(error);
    else load();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete post "${title}"? This cannot be undone.`)) return;
    const { error } = await apiFetch(`/admin/content/${id}`, { method: 'DELETE' });
    if (error) alert(error);
    else load();
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return posts.filter((p) => {
      const matchSearch = (p.title || '').toLowerCase().includes(q);
      const matchType = !typeFilter || p.content_type === typeFilter;
      const matchStatus =
        !statusFilter ||
        (statusFilter === 'published' ? p.is_published : !p.is_published);
      return matchSearch && matchType && matchStatus;
    });
  }, [posts, search, typeFilter, statusFilter]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Content Posts</h1>
          <p className="text-sm text-slate-500 mt-0.5">Articles, tips and announcements for app users</p>
        </div>
        <a href="/content/posts/create" className="btn btn-primary h-9 text-sm">
          <Plus size={16} />
          Create Post
        </a>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-8 h-9 text-sm" placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <select className="input h-9 w-auto text-sm py-0" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">All Types</option>
              <option value="article">article</option>
              <option value="workout">workout</option>
              <option value="program">program</option>
              <option value="tip">tip</option>
              <option value="announcement">announcement</option>
            </select>
            <select className="input h-9 w-auto text-sm py-0" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-400 gap-2 text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading posts…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">Post</th>
                  <th className="table-th">Type</th>
                  <th className="table-th">Status</th>
                  <th className="table-th">Date</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-surface/40 transition-colors">
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <FileText size={15} className="text-slate-400" />
                        </div>
                        <p className="font-medium text-slate-800">{p.title}</p>
                      </div>
                    </td>
                    <td className="table-td capitalize text-slate-500">{p.content_type || '—'}</td>
                    <td className="table-td">
                      <span className={`badge ${p.is_published ? 'badge-success' : 'badge-neutral'}`}>
                        {p.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="table-td text-slate-400">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="table-td text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className={`btn btn-ghost p-1.5 ${p.is_published ? 'text-warning hover:bg-warning-light' : 'text-success hover:bg-success-light'}`}
                          title={p.is_published ? 'Unpublish' : 'Publish'}
                          onClick={() => togglePublish(p)}
                        >
                          {p.is_published ? <EyeOff size={15} /> : <Globe size={15} />}
                        </button>
                        <button
                          className="btn btn-ghost p-1.5 text-danger hover:bg-danger-light"
                          title="Delete"
                          onClick={() => handleDelete(p.id, p.title)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && !errorMsg && (
                  <tr>
                    <td colSpan={5} className="table-td text-center text-slate-400 py-10">
                      No posts yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
