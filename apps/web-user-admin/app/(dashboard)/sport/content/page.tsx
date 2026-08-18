'use client'

import { useState } from 'react'
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle,
  FileText,
  Video,
  HelpCircle,
  MoreHorizontal,
} from 'lucide-react'
import { MOCK_DISCIPLINES, MOCK_SPORT_ARTICLES, SportArticle } from '@/lib/mockDisciplines'

export default function SportContentPage() {
  const currentSport = MOCK_DISCIPLINES[0] // Boxing
  const [articles, setArticles] = useState<SportArticle[]>(MOCK_SPORT_ARTICLES['disc-boxing'] || [])
  const [search, setSearch] = useState('')

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentSport.icon}</span>
            <h1 className="text-xl font-bold text-ink">{currentSport.name} Articles & Media</h1>
          </div>
          <p className="text-xs text-ink-muted mt-0.5">
            Manage sport-specific articles, media blocks, and coaching tips for {currentSport.name}.
          </p>
        </div>

        <button className="btn btn-ink h-9 text-xs gap-1.5 shrink-0">
          <Plus size={15} /> Publish New Article
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost" />
          <input
            type="text"
            placeholder="Search articles or tips…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-8 h-9 w-full text-xs"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.map(a => (
          <div key={a.id} className="card hover:border-ink/20 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="badge badge-neutral text-[10px]">{a.category}</span>
                <span className="badge badge-ink text-[10px] uppercase">{a.contentType}</span>
              </div>

              <h3 className="text-base font-bold text-ink">{a.title}</h3>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">{a.description}</p>

              <p className="text-[10px] text-ink-ghost mt-3">By {a.author} • {a.publishedAt}</p>
            </div>

            <div className="mt-5 pt-3 border-t border-sheet-border flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                <CheckCircle size={12} /> Published
              </span>
              <button className="btn btn-ghost p-1 text-ink-ghost hover:text-ink">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
