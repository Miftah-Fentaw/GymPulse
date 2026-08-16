'use client'

import { Bell, Menu, Search, LogOut, User, Settings, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface TopbarProps {
  onToggleSidebar: () => void
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="h-16 bg-white border-b border-surface-border flex items-center px-4 gap-4 sticky top-0 z-30">
      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className="btn btn-ghost p-2 text-slate-500"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="relative hidden md:flex items-center flex-1 max-w-sm">
        <Search size={16} className="absolute left-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search anything..."
          className="input pl-9 h-9 bg-surface text-sm"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="btn btn-ghost p-2 text-slate-500 relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full border-2 border-white" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-dropdown border border-surface-border overflow-hidden">
              <div className="px-4 py-3 border-b border-surface-border flex items-center justify-between">
                <span className="font-semibold text-sm">Notifications</span>
                <span className="badge badge-info">3 new</span>
              </div>
              <div className="divide-y divide-surface-border">
                {[
                  { title: 'New order placed', time: '2 min ago', dot: 'bg-brand' },
                  { title: 'User reported content', time: '15 min ago', dot: 'bg-warning' },
                  { title: 'Storage at 80% capacity', time: '1h ago', dot: 'bg-danger' },
                ].map((n, i) => (
                  <div key={i} className="px-4 py-3 hover:bg-surface cursor-pointer flex gap-3 items-start">
                    <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.dot}`} />
                    <div>
                      <p className="text-sm font-medium text-slate-700">{n.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-surface-border text-center">
                <button className="text-xs text-brand font-medium hover:underline">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-surface transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">SA</span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-slate-800 leading-tight">Super Admin</p>
              <p className="text-[11px] text-slate-400 leading-tight">admin@gympulse.app</p>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden md:block" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-dropdown border border-surface-border overflow-hidden">
              <div className="px-4 py-3 border-b border-surface-border">
                <p className="font-semibold text-sm">Super Admin</p>
                <p className="text-xs text-slate-400">admin@gympulse.app</p>
              </div>
              <div className="py-1">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-surface"
                >
                  <User size={15} />
                  My Profile
                </Link>
                <Link
                  href="/system/settings"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-surface"
                >
                  <Settings size={15} />
                  Settings
                </Link>
              </div>
              <div className="border-t border-surface-border py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger-light">
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
