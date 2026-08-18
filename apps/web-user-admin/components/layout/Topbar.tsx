'use client'

import { Bell, Search, LogOut, Settings, ChevronDown, Trophy } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { MOCK_DISCIPLINES } from '@/lib/mockDisciplines'

export function Topbar() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const currentSport = MOCK_DISCIPLINES[0] // Default Boxing

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-sheet-card border-b border-sheet-border sticky top-0 z-30">
      {/* Search & Active Sport Pill */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center">
          <Search size={14} className="absolute left-3 text-ink-ghost" />
          <input
            type="text"
            placeholder="Search workouts, members, classes…"
            className="input pl-8 h-9 w-60 text-xs bg-sheet border-sheet-border focus:bg-white"
          />
        </div>

        <Link
          href="/sport"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink/5 border border-ink/10 hover:bg-ink/10 transition-colors text-xs font-semibold text-ink"
        >
          <span>{currentSport.icon}</span>
          <span>{currentSport.name} Lead</span>
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Bell */}
        <button className="btn btn-ghost p-2 relative" aria-label="Notifications">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-bad rounded-full border-2 border-white" />
        </button>

        {/* Profile dropdown */}
        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 hover:bg-sheet px-2.5 py-1.5 rounded-xl transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-ink flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-white">SA</span>
            </div>
            <span className="hidden sm:block text-xs font-bold text-ink">Sport & User Admin</span>
            <ChevronDown size={13} className="text-ink-ghost hidden sm:block" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-card border border-sheet-border overflow-hidden z-50">
              <div className="px-4 py-2.5 bg-sheet/50 border-b border-sheet-border">
                <p className="text-xs font-bold text-ink truncate">Sport Admin</p>
                <p className="text-[10px] text-ink-ghost truncate">admin@gympulse.app</p>
              </div>
              <Link href="/sport" className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-ink hover:bg-sheet transition-colors">
                <Trophy size={14} /> My Managed Sport
              </Link>
              <Link href="/settings" className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-ink hover:bg-sheet transition-colors">
                <Settings size={14} /> Settings
              </Link>
              <div className="border-t border-sheet-border">
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-bad hover:bg-bad-light transition-colors">
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
