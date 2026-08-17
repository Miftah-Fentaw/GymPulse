'use client'

import { Bell, Search, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

export function Topbar() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-sheet-card border-b border-sheet-border sticky top-0 z-30">
      {/* Search */}
      <div className="relative flex items-center">
        <Search size={14} className="absolute left-3 text-ink-ghost" />
        <input
          type="text"
          placeholder="Search members, classes…"
          className="input pl-8 h-9 w-64 text-sm bg-sheet"
        />
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
              <span className="text-[10px] font-bold text-white">UA</span>
            </div>
            <span className="hidden sm:block text-sm font-semibold text-ink">User Admin</span>
            <ChevronDown size={13} className="text-ink-ghost hidden sm:block" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-card border border-sheet-border overflow-hidden">
              <Link href="/settings" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink hover:bg-sheet transition-colors">
                <Settings size={14} /> Settings
              </Link>
              <div className="border-t border-sheet-border">
                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-bad hover:bg-bad-light transition-colors">
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
