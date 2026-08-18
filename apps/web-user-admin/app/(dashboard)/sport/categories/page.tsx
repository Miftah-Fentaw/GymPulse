'use client'

import { useState } from 'react'
import { FolderGit2, Plus, Trash2, Edit3 } from 'lucide-react'
import { MOCK_DISCIPLINES, MOCK_DISCIPLINE_CATEGORIES } from '@/lib/mockDisciplines'

export default function SportCategoriesPage() {
  const currentSport = MOCK_DISCIPLINES[0] // Boxing
  const [categories, setCategories] = useState<string[]>(
    MOCK_DISCIPLINE_CATEGORIES[currentSport.slug] || []
  )
  const [newCat, setNewCat] = useState('')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCat.trim()) return
    setCategories([...categories, newCat.trim()])
    setNewCat('')
  }

  const handleDelete = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xl">{currentSport.icon}</span>
          <h1 className="text-xl font-bold text-ink">{currentSport.name} Taxonomy & Categories</h1>
        </div>
        <p className="text-xs text-ink-muted mt-0.5">
          Manage categories strictly associated with workouts and articles in {currentSport.name}.
        </p>
      </div>

      <div className="card space-y-4">
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            placeholder={`New ${currentSport.name} category (e.g. Footwork & Stance)...`}
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            className="input flex-1 text-xs"
          />
          <button type="submit" className="btn btn-ink h-9 text-xs gap-1 shrink-0">
            <Plus size={14} /> Add Category
          </button>
        </form>

        <div className="space-y-2 pt-2 border-t border-sheet-border">
          {categories.map((c, i) => (
            <div key={i} className="p-3 rounded-2xl bg-sheet border border-sheet-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FolderGit2 size={16} className="text-ink-muted" />
                <span className="text-xs font-semibold text-ink">{c}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleDelete(i)} className="btn btn-ghost p-1.5 text-bad hover:bg-bad-light">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
