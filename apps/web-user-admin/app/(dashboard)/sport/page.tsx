'use client'

import { useState } from 'react'
import {
  Trophy,
  Users,
  Dumbbell,
  Layers,
  BookOpen,
  Calendar,
  CheckCircle,
  Edit3,
  Save,
  Plus,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'
import { MOCK_DISCIPLINES, MOCK_DISCIPLINE_CATEGORIES, Discipline } from '@/lib/mockDisciplines'

export default function SportOverviewPage() {
  const [sport, setSport] = useState<Discipline>(MOCK_DISCIPLINES[0]) // Boxing
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(sport.name)
  const [description, setDescription] = useState(sport.description)
  const [color, setColor] = useState(sport.color)
  const categories = MOCK_DISCIPLINE_CATEGORIES[sport.slug] || []

  const handleSave = () => {
    setSport({ ...sport, name, description, color })
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div
        className="rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-card transition-all"
        style={{
          background: `linear-gradient(135deg, ${sport.color} 0%, #111111 100%)`,
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/20">
              {sport.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                  Active Managed Discipline
                </span>
                {sport.isActive && (
                  <span className="bg-emerald-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle size={10} /> Active
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold mt-1 tracking-tight">{sport.name}</h1>
              <p className="text-xs text-white/80 max-w-xl mt-1 leading-relaxed">{sport.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl bg-white text-ink font-semibold text-xs hover:bg-white/90 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Edit3 size={14} /> {isEditing ? 'Cancel Edit' : 'Edit Sport Settings'}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Form Modal/Card */}
      {isEditing && (
        <div className="card border-ink/20 animate-in fade-in slide-in-from-top-2 duration-200">
          <h3 className="text-base font-bold text-ink mb-4 flex items-center gap-2">
            <Edit3 size={16} /> Edit {sport.name} Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-ink-muted block mb-1">Discipline Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input w-full text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-muted block mb-1">Color Theme</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-9 h-9 rounded-xl border border-sheet-border cursor-pointer"
                />
                <input
                  type="text"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="input flex-1 text-xs"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-ink-muted block mb-1">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
                className="input w-full text-xs p-3"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-sheet-border">
            <button onClick={() => setIsEditing(false)} className="btn btn-ghost text-xs">
              Cancel
            </button>
            <button onClick={handleSave} className="btn btn-ink text-xs gap-1.5">
              <Save size={14} /> Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Sport Quick Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Enrolled Members</span>
            <Users size={16} />
          </div>
          <p className="text-2xl font-bold text-ink">{sport.enrolledMembers.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1">Exclusive to {sport.name}</p>
        </div>

        <div className="card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Workouts</span>
            <Dumbbell size={16} />
          </div>
          <p className="text-2xl font-bold text-ink">{sport.activeWorkouts}</p>
          <a href="/sport/workouts" className="text-[10px] text-ink-muted hover:text-ink font-semibold mt-1 flex items-center gap-0.5">
            Manage <ArrowUpRight size={10} />
          </a>
        </div>

        <div className="card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Programs</span>
            <Layers size={16} />
          </div>
          <p className="text-2xl font-bold text-ink">{sport.trainingPrograms}</p>
          <a href="/sport/programs" className="text-[10px] text-ink-muted hover:text-ink font-semibold mt-1 flex items-center gap-0.5">
            Manage <ArrowUpRight size={10} />
          </a>
        </div>

        <div className="card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Articles</span>
            <BookOpen size={16} />
          </div>
          <p className="text-2xl font-bold text-ink">{sport.publishedArticles}</p>
          <a href="/sport/content" className="text-[10px] text-ink-muted hover:text-ink font-semibold mt-1 flex items-center gap-0.5">
            Manage <ArrowUpRight size={10} />
          </a>
        </div>

        <div className="card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-ink-muted mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Classes</span>
            <Calendar size={16} />
          </div>
          <p className="text-2xl font-bold text-ink">{sport.activeClasses}</p>
          <a href="/classes" className="text-[10px] text-ink-muted hover:text-ink font-semibold mt-1 flex items-center gap-0.5">
            View Schedule <ArrowUpRight size={10} />
          </a>
        </div>
      </div>

      {/* Two column section: Categories & Quick Management Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Active Categories for this Sport */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-ink">{sport.name} Categories</h3>
              <p className="text-xs text-ink-muted">Content and workout grouping taxonomy for this discipline.</p>
            </div>
            <a href="/sport/categories" className="btn btn-outline h-8 text-xs gap-1">
              <Plus size={14} /> Add Category
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((cat, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-sheet border border-sheet-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sport.color }} />
                  <span className="text-xs font-bold text-ink">{cat}</span>
                </div>
                <span className="text-[10px] text-ink-ghost font-semibold">Active</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sport Admin Quick Actions */}
        <div className="card">
          <h3 className="text-base font-bold text-ink mb-3 flex items-center gap-2">
            <Sparkles size={16} /> Quick Actions
          </h3>
          <div className="space-y-2">
            <a
              href="/sport/workouts?create=true"
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-sheet hover:bg-sheet-hover border border-sheet-border transition-colors text-xs font-semibold text-ink"
            >
              <span className="flex items-center gap-2">
                <Dumbbell size={15} /> Create {sport.name} Workout
              </span>
              <ArrowUpRight size={14} />
            </a>

            <a
              href="/sport/programs?create=true"
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-sheet hover:bg-sheet-hover border border-sheet-border transition-colors text-xs font-semibold text-ink"
            >
              <span className="flex items-center gap-2">
                <Layers size={15} /> Create Training Program
              </span>
              <ArrowUpRight size={14} />
            </a>

            <a
              href="/sport/content?create=true"
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-sheet hover:bg-sheet-hover border border-sheet-border transition-colors text-xs font-semibold text-ink"
            >
              <span className="flex items-center gap-2">
                <BookOpen size={15} /> Publish Article / Tip
              </span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
