'use client';

import { useEffect, useState } from 'react';
import { FolderGit2, Plus, Trash2, Loader2, ServerCrash } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import { apiFetch } from '../../../../lib/apiClient';

export default function SportCategoriesPage() {
  const { activeDiscipline } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [newCat, setNewCat] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setErrorMsg(null);
    const endpoint = activeDiscipline?.id
      ? `/admin/content/categories?discipline_id=${activeDiscipline.id}`
      : '/admin/content/categories';

    const { data, error } = await apiFetch(endpoint);
    if (error) {
      setErrorMsg(error);
      setCategories([]);
    } else {
      setCategories(Array.isArray(data) ? data : []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [activeDiscipline?.id]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim()) return;

    setIsSubmitting(true);
    const payload = {
      name: newCat.trim(),
      slug: newCat.trim().toLowerCase().replace(/\s+/g, '-'),
      discipline_id: activeDiscipline?.id,
    };

    const { error } = await apiFetch('/admin/content/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (error) {
      alert(`Error creating category via Go backend: ${error}`);
    } else {
      setNewCat('');
      fetchCategories();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    const { error } = await apiFetch(`/admin/content/categories/${id}`, {
      method: 'DELETE',
    });

    if (error) {
      alert(`Error deleting category: ${error}`);
    } else {
      fetchCategories();
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xl">{activeDiscipline?.icon || '🥊'}</span>
          <h1 className="text-xl font-bold text-ink">
            {activeDiscipline?.name || 'Sport'} Taxonomy & Categories
          </h1>
        </div>
        <p className="text-xs text-ink-muted mt-0.5">
          Manage categories strictly associated with workouts and articles in {activeDiscipline?.name || 'this sport'}.
        </p>
      </div>

      {/* Backend Error */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 flex-shrink-0 text-red-500" />
          <div>
            <p className="font-bold">Backend API Unreachable</p>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      <div className="card space-y-4">
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            placeholder={`New ${activeDiscipline?.name || 'sport'} category (e.g. Footwork & Stance)...`}
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            className="input flex-1 text-xs"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-ink h-9 text-xs gap-1 shrink-0 flex items-center"
          >
            {isSubmitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                <Plus size={14} /> Add Category
              </>
            )}
          </button>
        </form>

        {loading ? (
          <div className="flex items-center justify-center py-8 text-ink-ghost gap-2">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-xs">Loading categories from Go Backend…</span>
          </div>
        ) : (
          <div className="space-y-2 pt-2 border-t border-sheet-border">
            {categories.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-2xl bg-sheet border border-sheet-border flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <FolderGit2 size={16} className="text-ink-muted" />
                  <div>
                    <span className="text-xs font-semibold text-ink">{c.name}</span>
                    <span className="text-[10px] text-ink-ghost block">{c.slug}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="btn btn-ghost p-1.5 text-bad hover:bg-bad-light"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            {categories.length === 0 && !errorMsg && (
              <p className="text-xs text-ink-ghost py-4 text-center">
                No categories created yet for this discipline.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
