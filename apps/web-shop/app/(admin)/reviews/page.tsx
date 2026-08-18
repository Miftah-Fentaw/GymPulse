'use client';

import { useEffect, useState } from 'react';
import { Search, Star, Trash2, Flag, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';
import { asArray, formatDate } from '@/lib/shop';

function Stars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={12} className={i <= n ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [rating, setRating] = useState('');

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const params = new URLSearchParams({ per_page: '100' });
    if (rating) params.set('rating', rating);
    const { data, error } = await apiFetch(`/admin/shop/reviews?${params.toString()}`);
    if (error) {
      setErrorMsg(error);
      setReviews([]);
    } else {
      setReviews(asArray(data));
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [rating]);

  const filtered = reviews.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [r.products?.name, r.profiles?.full_name, r.review_text].some((v) => String(v || '').toLowerCase().includes(q));
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    const { error } = await apiFetch(`/admin/shop/reviews/${id}`, { method: 'DELETE' });
    if (error) alert(error);
    else load();
  };

  const handleFlag = async (id: string) => {
    const reason = prompt('Flag reason');
    if (reason == null) return;
    const { error } = await apiFetch(`/admin/shop/reviews/${id}/flag`, {
      method: 'PATCH',
      body: JSON.stringify({ flagged: true, reason }),
    });
    if (error) alert(error);
    else load();
  };

  const avg = reviews.length
    ? (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Reviews</h1>
        <p className="text-sm text-gray-400 mt-0.5">Monitor and moderate product reviews</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Reviews', value: reviews.length, color: 'text-gray-800' },
          { label: 'Avg. Rating', value: avg, color: 'text-amber-500' },
          { label: 'Published', value: reviews.filter((r) => !r.is_flagged).length, color: 'text-success' },
          { label: 'Flagged', value: reviews.filter((r) => r.is_flagged).length, color: 'text-danger' },
        ].map((s) => (
          <div key={s.label} className="card py-4">
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-border">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-8 h-9 text-xs" placeholder="Search reviews..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input h-9 w-auto text-xs py-0 ml-auto" value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="">All Ratings</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={String(n)}>{n} Stars</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-xs">Loading reviews…</span>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-16">No reviews found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface">
                <tr>
                  <th className="th">Product</th>
                  <th className="th">User</th>
                  <th className="th">Rating</th>
                  <th className="th">Comment</th>
                  <th className="th">Status</th>
                  <th className="th">Date</th>
                  <th className="th text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-surface/60 transition-colors">
                    <td className="td font-medium text-xs text-gray-800">{r.products?.name || '—'}</td>
                    <td className="td text-xs text-gray-500">{r.profiles?.full_name || '—'}</td>
                    <td className="td"><Stars n={Number(r.rating) || 0} /></td>
                    <td className="td text-xs text-gray-500 max-w-[220px] truncate">{r.review_text || '—'}</td>
                    <td className="td">
                      <span className={`badge text-[10px] ${r.is_flagged ? 'badge-danger' : 'badge-success'}`}>
                        {r.is_flagged ? 'Flagged' : 'Published'}
                      </span>
                    </td>
                    <td className="td text-xs text-gray-400">{formatDate(r.created_at)}</td>
                    <td className="td text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="btn btn-ghost p-1.5" title="Flag" onClick={() => handleFlag(r.id)}><Flag size={13} /></button>
                        <button className="btn btn-ghost p-1.5 text-danger hover:bg-danger-light" onClick={() => handleDelete(r.id)}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
