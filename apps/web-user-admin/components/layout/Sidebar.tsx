'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  UserCheck,
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
  Trophy,
  BookOpen,
  FolderGit2,
  Layers,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MOCK_DISCIPLINES, Discipline } from '@/lib/mockDisciplines'

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

const baseNav: Group[] = [
  {
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={17} /> },
    ],
  },
  {
    title: 'Sport & Content',
    items: [
      { label: 'My Sport Overview', href: '/sport', icon: <Trophy size={17} /> },
      {
        label: 'Workouts & Drills',
        icon: <Dumbbell size={17} />,
        children: [
          { label: 'All Workouts', href: '/sport/workouts' },
          { label: 'Add Workout', href: '/sport/workouts?create=true' },
        ],
      },
      {
        label: 'Training Programs',
        icon: <Layers size={17} />,
        children: [
          { label: 'All Programs', href: '/sport/programs' },
          { label: 'Add Program', href: '/sport/programs?create=true' },
        ],
      },
      {
        label: 'Articles & Media',
        icon: <BookOpen size={17} />,
        children: [
          { label: 'All Content', href: '/sport/content' },
          { label: 'Create Article', href: '/sport/content?create=true' },
        ],
      },
      { label: 'Sport Categories', href: '/sport/categories', icon: <FolderGit2 size={17} /> },
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
    title: 'Classes & Schedule',
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
    title: 'Analytics & System',
    items: [
      { label: 'Overview',       href: '/analytics',           icon: <BarChart2 size={17} /> },
      { label: 'Member Growth',  href: '/analytics/growth',    icon: <TrendingUp size={17} /> },
      { label: 'Class Activity', href: '/analytics/activity',  icon: <Activity size={17} /> },
      { label: 'Audit Logs',     href: '/audit-logs',          icon: <ScrollText size={17} /> },
      { label: 'Notifications',  href: '/notifications',        icon: <Bell size={17} />, badge: 3 },
      { label: 'Settings',       href: '/settings',             icon: <Settings size={17} /> },
      { label: 'Help',           href: '/help',                 icon: <HelpCircle size={17} /> },
    ],
  },
]

function NavRow({ item }: { item: Item }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(() =>
    item.children ? item.children.some(c => pathname === c.href || pathname.startsWith(c.href + '/')) : false
  )

  if (item.children) {
    const isActive = item.children.some(c => pathname === c.href || pathname.startsWith(c.href + '/'))
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn('nav-item w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-ink-muted hover:bg-sheet-hover hover:text-ink transition-all', isActive && 'text-ink font-semibold bg-sheet')}
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
          <div className="ml-8 mt-0.5 space-y-0.5 border-l border-sheet-border pl-2">
            {item.children.map(c => {
              const active = pathname === c.href
              return (
                <Link
                  key={c.href}
                  href={c.href}
                  className={cn(
                    'block px-3 py-1.5 rounded-xl text-[12px] transition-all',
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
    <Link href={item.href!} className={cn('nav-item w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all', active ? 'bg-ink text-white font-semibold' : 'text-ink-muted hover:bg-sheet-hover hover:text-ink')}>
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
  const [activeDiscipline, setActiveDiscipline] = useState<Discipline>(MOCK_DISCIPLINES[0])
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-sheet-card flex flex-col z-40 shadow-xs border-r border-sheet-border">
      {/* Logo */}
      <div className="px-5 pt-5 pb-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-ink flex items-center justify-center shrink-0">
            <Zap size={15} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-ink leading-tight">GymPulse</p>
            <p className="text-[10px] text-ink-ghost">User & Sport Admin</p>
          </div>
        </div>
      </div>

      {/* Active Sport Switcher */}
      <div className="px-3 pb-3 shrink-0 relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-2xl bg-sheet hover:bg-sheet-hover border border-sheet-border transition-colors text-left"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base shrink-0">{activeDiscipline.icon}</span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-ghost leading-none">Managed Sport</p>
              <p className="text-xs font-bold text-ink truncate leading-tight mt-0.5">{activeDiscipline.name}</p>
            </div>
          </div>
          <ChevronDown size={14} className="text-ink-ghost shrink-0" />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-3 right-3 mt-1.5 bg-white rounded-2xl shadow-card border border-sheet-border p-1.5 z-50 space-y-0.5 max-h-56 overflow-y-auto">
            <p className="px-2.5 py-1 text-[10px] font-bold text-ink-ghost uppercase tracking-wider">Assigned Sports</p>
            {MOCK_DISCIPLINES.map(d => (
              <button
                key={d.id}
                onClick={() => {
                  setActiveDiscipline(d)
                  setDropdownOpen(false)
                }}
                className={cn(
                  'w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-left transition-colors',
                  activeDiscipline.id === d.id ? 'bg-ink text-white font-semibold' : 'hover:bg-sheet text-ink'
                )}
              >
                <span>{d.icon}</span>
                <span className="flex-1 truncate">{d.name}</span>
                <span className="text-[10px] opacity-70">{d.enrolledMembers} members</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
        {baseNav.map((group, gi) => (
          <div key={gi}>
            {group.title && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-ghost px-3 pt-3.5 pb-1">
                {group.title}
              </p>
            )}
            {group.items.map(item => <NavRow key={item.label} item={item} />)}
          </div>
        ))}
      </nav>

      {/* User profile at bottom */}
      <div className="px-4 py-3.5 border-t border-sheet-border shrink-0 bg-sheet/40">
        <div className="flex items-center gap-2.5">
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full bg-ink flex items-center justify-center">
              <span className="text-xs font-bold text-white">SA</span>
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-ok rounded-full border-2 border-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-ink leading-tight truncate">Sport Admin</p>
            <p className="text-[10px] text-ink-ghost truncate">{activeDiscipline.name} Lead</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
