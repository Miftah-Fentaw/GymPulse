'use client';

import { Bell, Menu, Search, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

interface TopbarProps {
  onToggleSidebar: () => void;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const { user, role, signOut } = useAuth();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const userEmail = user?.email || '';
  const roleDisplay = role ? role.replace('_', ' ').toUpperCase() : '';
  const initials = userEmail ? userEmail.substring(0, 2).toUpperCase() : 'GP';

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
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-dropdown border border-surface-border overflow-hidden">
              <div className="px-4 py-3 border-b border-surface-border">
                <span className="font-semibold text-sm">Notifications</span>
              </div>
              <div className="px-4 py-10 text-center text-sm text-slate-400">
                No notifications
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
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-slate-800 leading-tight">{roleDisplay}</p>
              <p className="text-[11px] text-slate-400 leading-tight truncate max-w-[130px]">{userEmail}</p>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden md:block" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-dropdown border border-surface-border overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-surface-border">
                <p className="font-semibold text-sm truncate">{userEmail}</p>
                <p className="text-xs text-slate-400">{roleDisplay}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-surface"
                >
                  <User size={15} />
                  My Profile
                </Link>
                <Link
                  href="/system/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-surface"
                >
                  <Settings size={15} />
                  Settings
                </Link>
              </div>
              <div className="border-t border-surface-border py-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger-light text-left font-medium"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
