'use client'

import { useState } from 'react'
import {
  Layers,
  Plus,
  Search,
  CheckCircle,
  Calendar,
  Dumbbell,
  MoreHorizontal,
} from 'lucide-react'
import { MOCK_DISCIPLINES, MOCK_SPORT_PROGRAMS, SportProgram } from '@/lib/mockDisciplines'

export default function SportProgramsPage() {
  const currentSport = MOCK_DISCIPLINES[0] // Boxing
  const [programs, setPrograms] = useState<SportProgram[]>(MOCK_SPORT_PROGRAMS['disc-boxing'] || [])
  const [search, setSearch] = useState('')

  const filteredPrograms = programs.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentSport.icon}</span>
            <h1 className="text-xl font-bold text-ink">{currentSport.name} Training Programs</h1>
          </div>
          <p className="text-xs text-ink-muted mt-0.5">
            Multi-week structured conditioning programs tailored specifically for {currentSport.name}.
          </p>
        </div>

        <button className="btn btn-ink h-9 text-xs gap-1.5 shrink-0">
          <Plus size={15} /> Create {currentSport.name} Program
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost" />
          <input
            type="text"
            placeholder="Search programs…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-8 h-9 w-full text-xs"
          />
        </div>
      </div>

      {/* Programs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPrograms.map(p => (
          <div key={p.id} className="card hover:border-ink/20 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="badge badge-neutral text-[10px]">{p.category}</span>
                <span className="badge badge-ink text-[10px]">{p.durationWeeks} Weeks</span>
              </div>

              <h3 className="text-base font-bold text-ink">{p.title}</h3>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">{p.description}</p>

              <div className="flex items-center gap-4 mt-4 text-xs text-ink-ghost font-medium">
                <span className="flex items-center gap-1">
                  <Calendar size={13} /> {p.durationWeeks} Weeks Duration
                </span>
                <span className="flex items-center gap-1">
                  <Dumbbell size={13} /> {p.workoutsCount} Workouts Scheduled
                </span>
              </div>
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
