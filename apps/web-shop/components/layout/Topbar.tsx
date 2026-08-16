'use client'

import { Bell, Search, LogOut, Settings, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

export function Topbar({ title }: { title?: string }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="h-14 bg-white border-b border-surface-border flex items-center px-6 gap-4 sticky top-0 z-30">
      {/* Page title slot — populated by child pages */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden sm:flex items-center">
        <Search size={14} className="absolute left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search products, orders..."
          className="input pl-8 h-8 w-56 text-xs bg-surface"
        />
      </div>

      {/* Bell */}
      <button className="relative btn btn-ghost p-2" aria-label="Notifications">
        <Bell size={18} />
        <span className="absolute top-1 right-1 w-2 h-2 bg-brand rounded-full border-2 border-white" />
      </button>

      {/* Profile */}
      <div ref={profileRef} className="relative">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center gap-2 hover:bg-surface px-2 py-1.5 rounded-xl transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-white">SA</span>
          </div>
          <span className="hidden sm:block text-xs font-semibold text-gray-700">Shop Admin</span>
          <ChevronDown size={13} className="text-gray-400 hidden sm:block" />
        </button>

        {profileOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lift border border-surface-border overflow-hidden">
            <Link
              href="/settings"
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-surface"
            >
              <Settings size={14} /> Settings
            </Link>
            <div className="border-t border-surface-border">
              <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-danger hover:bg-danger-light">
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
