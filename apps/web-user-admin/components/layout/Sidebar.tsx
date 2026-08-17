'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Ban,
  Crown,
  Dumbbell,
  Calendar,
  ClipboardList,
  BarChart2,
  TrendingUp,
  Activity,
  ShieldCheck,
  ScrollText,
  Bell,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Zap,
  UserX,
  Filter,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Item {
  label: string
  href?: string
  icon: React.ReactNode
  badge?: string | number
  children?: { label: string; href: string }[]
}

interface Group {
  title?: string
  items: Item[]
}

const nav: Group[] = [
  {
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={17} /> },
    ],
  },
  {
    title: 'Members',
    items: [
      {
        label: 'All Members',
        icon: <Users size={17} />,
        children: [
          { label: 'Active Members',   href: '/members' },
          { label: 'Banned Members',   href: '/members/banned' },
          { label: 'Premium Members',  href: '/members/premium' },
          { label: 'New Registrations',href: '/members/new' },
        ],
      },
      { label: 'Pending Approvals', href: '/members/pending',  icon: <UserCheck size={17} />, badge: 8 },
      { label: 'Banned Users',      href: '/members/banned',   icon: <UserX size={17} /> },
      { label: 'Membership Tiers',  href: '/members/tiers',    icon: <Crown size={17} /> },
    ],
  },
  {
    title: 'Classes & Bookings',
    items: [
      {
        label: 'Classes',
        icon: <Dumbbell size={17} />,
        children: [
          { label: 'All Classes',    href: '/classes' },
          { label: 'Schedule',       href: '/classes/schedule' },
          { label: 'Add Class',      href: '/classes/create' },
        ],
      },
      {
        label: 'Bookings',
        icon: <ClipboardList size={17} />,
        badge: 12,
        children: [
          { label: 'All Bookings',   href: '/bookings' },
          { label: 'Pending',        href: '/bookings?status=pending' },
          { label: 'Confirmed',      href: '/bookings?status=confirmed' },
          { label: 'Cancelled',      href: '/bookings?status=cancelled' },
          { label: 'No-Shows',       href: '/bookings?status=no_show' },
        ],
      },
      { label: 'Calendar',          href: '/classes/schedule', icon: <Calendar size={17} /> },
    ],
  },
  {
    title: 'Trainers',
    items: [
      {
        label: 'Trainers',
        icon: <ShieldCheck size={17} />,
        children: [
          { label: 'All Trainers',   href: '/trainers' },
          { label: 'Add Trainer',    href: '/trainers/create' },
          { label: 'Pending Review', href: '/trainers/pending' },
        ],
      },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Overview',       href: '/analytics',           icon: <BarChart2 size={17} /> },
      { label: 'Member Growth',  href: '/analytics/growth',    icon: <TrendingUp size={17} /> },
      { label: 'Class Activity', href: '/analytics/activity',  icon: <Activity size={17} /> },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Audit Logs',     href: '/audit-logs',  icon: <ScrollText size={17} /> },
      { label: 'Notifications',  href: '/notifications',icon: <Bell size={17} />, badge: 3 },
      { label: 'Settings',       href: '/settings',     icon: <Settings size={17} /> },
      { label: 'Help',           href: '/help',         icon: <HelpCircle size={17} /> },
    ],
  },
]

function NavRow({ item }: { item: Item }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(() =>
    item.children ? item.children.some(c => pathname.startsWith(c.href)) : false
  )

  if (item.children) {
    const isActive = item.children.some(c => pathname.startsWith(c.href))
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn('nav-item', isActive && 'text-ink font-semibold')}
        >
          <span className="shrink-0">{item.icon}</span>
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge !== undefined && (
            <span className="bg-ink text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
              {item.badge}
            </span>
          )}
          {open
            ? <ChevronDown size={13} className="opacity-40 shrink-0" />
            : <ChevronRight size={13} className="opacity-40 shrink-0" />}
        </button>
        {open && (
          <div className="ml-10 mt-0.5 space-y-0.5">
            {item.children.map(c => {
              const active = pathname === c.href || pathname.startsWith(c.href + '/')
              return (
                <Link
                  key={c.href}
                  href={c.href}
                  className={cn(
                    'block px-3 py-1.5 rounded-xl text-[13px] transition-all',
                    active
                      ? 'bg-ink text-white font-semibold'
                      : 'text-ink-muted hover:bg-sheet-hover hover:text-ink'
                  )}
                >
                  {c.label}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const active = pathname === item.href
  return (
    <Link href={item.href!} className={cn('nav-item', active && 'active')}>
      <span className="shrink-0">{item.icon}</span>
      <span className="flex-1">{item.label}</span>
      {item.badge !== undefined && (
        <span className={cn(
          'text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0',
          active ? 'bg-white text-ink' : 'bg-ink text-white'
        )}>
          {item.badge}
        </span>
      )}
    </Link>
  )
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-sheet-card flex flex-col z-40 shadow-xs">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-ink flex items-center justify-center shrink-0">
            <Zap size={15} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-ink leading-tight">GymPulse</p>
            <p className="text-[10px] text-ink-ghost">User Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
        {nav.map((group, gi) => (
          <div key={gi}>
            {group.title && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-ghost px-4 pt-4 pb-1.5">
                {group.title}
              </p>
            )}
            {group.items.map(item => <NavRow key={item.label} item={item} />)}
          </div>
        ))}
      </nav>

      {/* User profile at bottom */}
      <div className="px-4 py-4 border-t border-sheet-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-ink-muted flex items-center justify-center">
              <span className="text-xs font-bold text-white">UA</span>
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-bad rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-[8px] font-bold text-white">8</span>
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink leading-tight truncate">User Admin</p>
            <p className="text-[10px] text-ink-ghost truncate">admin@gympulse.app</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
