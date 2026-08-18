'use client'

import { useState } from 'react'
import {
  Dumbbell,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Flame,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react'
import { MOCK_DISCIPLINES, MOCK_SPORT_WORKOUTS, SportWorkout } from '@/lib/mockDisciplines'

export default function SportWorkoutsPage() {
  const currentSport = MOCK_DISCIPLINES[0] // Boxing
  const [workouts, setWorkouts] = useState<SportWorkout[]>(MOCK_SPORT_WORKOUTS['disc-boxing'] || [])
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  // New Workout Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [durationMins, setDurationMins] = useState(45)
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')
  const [category, setCategory] = useState('Heavy Bag Drills')

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return
    const newW: SportWorkout = {
      id: `w-${Date.now()}`,
      title,
      description,
      durationMins,
      difficulty,
      disciplineId: currentSport.id,
      category,
      isPublished: true,
      exercisesCount: 6,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setWorkouts([newW, ...workouts])
    setShowCreateModal(false)
    setTitle('')
    setDescription('')
  }

  const filteredWorkouts = workouts.filter(w =>
    w.title.toLowerCase().includes(search.toLowerCase()) ||
    w.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentSport.icon}</span>
            <h1 className="text-xl font-bold text-ink">{currentSport.name} Workouts & Drills</h1>
          </div>
          <p className="text-xs text-ink-muted mt-0.5">
            Manage workouts strictly associated with the {currentSport.name} discipline.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-ink h-9 text-xs gap-1.5 shrink-0"
        >
          <Plus size={15} /> Add {currentSport.name} Workout
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost" />
          <input
            type="text"
            placeholder="Search workouts or categories…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-8 h-9 w-full text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-ink-muted">Total: <strong>{filteredWorkouts.length}</strong></span>
        </div>
      </div>

      {/* Workouts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkouts.map(w => (
          <div key={w.id} className="card flex flex-col justify-between hover:border-ink/20 transition-all">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="badge badge-neutral text-[10px]">{w.category}</span>
                <span className={`badge text-[10px] ${w.difficulty === 'beginner' ? 'badge-ok' : w.difficulty === 'intermediate' ? 'badge-warn' : 'badge-bad'}`}>
                  {w.difficulty.toUpperCase()}
                </span>
              </div>

              <h3 className="text-sm font-bold text-ink leading-tight">{w.title}</h3>
              <p className="text-xs text-ink-muted mt-1 line-clamp-2 leading-relaxed">{w.description}</p>

              <div className="flex items-center gap-4 mt-4 text-xs text-ink-ghost font-medium">
                <span className="flex items-center gap-1">
                  <Clock size={13} /> {w.durationMins} mins
                </span>
                <span className="flex items-center gap-1">
                  <Dumbbell size={13} /> {w.exercisesCount} exercises
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

      {/* Create Workout Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-card border border-sheet-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-ink">New {currentSport.name} Workout</h3>
              <button onClick={() => setShowCreateModal(false)} className="btn btn-ghost p-1 text-ink-ghost">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-ink-muted block mb-1">Workout Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 6-Round Heavy Bag Power Combination"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="input w-full text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-muted block mb-1">Description</label>
                <textarea
                  placeholder="Brief description of the workout routine…"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="input w-full text-xs p-2.5"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-ink-muted block mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={durationMins}
                    onChange={e => setDurationMins(Number(e.target.value))}
                    className="input w-full text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-muted block mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value as any)}
                    className="input w-full text-xs"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-sheet-border">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn btn-ghost text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn btn-ink text-xs">
                  Create & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
