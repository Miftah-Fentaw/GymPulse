'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Package,
  ShoppingCart,
  Dumbbell,
  Layers,
  FileText,
  Megaphone,
  BarChart2,
  Settings,
  HardDrive,
  ScrollText,
  ChevronDown,
  ChevronRight,
  Zap,
  Medal,
  Activity,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    title: 'Main',
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard size={18} />,
      },
    ],
  },
  {
    title: 'People',
    items: [
      {
        label: 'App Users',
        icon: <Users size={18} />,
        children: [
          { label: 'All Users', href: '/users' },
          { label: 'Banned Users', href: '/users/banned' },
          { label: 'Membership Tiers', href: '/users/tiers' },
        ],
      },
      {
        label: 'Admin Accounts',
        icon: <ShieldCheck size={18} />,
        children: [
          { label: 'All Admins', href: '/admins' },
          { label: 'Create Admin', href: '/admins/create' },
          { label: 'Role Overview', href: '/admins/roles' },
        ],
      },
    ],
  },
  {
    title: 'Shop',
    items: [
      {
        label: 'Products',
        icon: <Package size={18} />,
        children: [
          { label: 'All Products', href: '/shop/products' },
          { label: 'Add Product', href: '/shop/products/create' },
          { label: 'Categories', href: '/shop/categories' },
        ],
      },
      {
        label: 'Orders',
        icon: <ShoppingCart size={18} />,
        children: [
          { label: 'All Orders', href: '/shop/orders' },
          { label: 'Pending', href: '/shop/orders?status=pending' },
          { label: 'Completed', href: '/shop/orders?status=delivered' },
        ],
      },
    ],
  },
  {
    title: 'Sport Content',
    items: [
      {
        label: 'Workouts',
        icon: <Dumbbell size={18} />,
        children: [
          { label: 'All Workouts', href: '/content/workouts' },
          { label: 'Create Workout', href: '/content/workouts/create' },
          { label: 'Categories', href: '/content/workout-categories' },
        ],
      },
      {
        label: 'Programs',
        icon: <Layers size={18} />,
        children: [
          { label: 'All Programs', href: '/content/programs' },
          { label: 'Create Program', href: '/content/programs/create' },
        ],
      },
      {
        label: 'Content Posts',
        icon: <FileText size={18} />,
        children: [
          { label: 'All Posts', href: '/content/posts' },
          { label: 'Create Post', href: '/content/posts/create' },
          { label: 'Categories', href: '/content/categories' },
        ],
      },
      {
        label: 'Exercises',
        href: '/content/exercises',
        icon: <Medal size={18} />,
      },
    ],
  },
  {
    title: 'Analytics',
    items: [
      {
        label: 'Platform Stats',
        href: '/analytics',
        icon: <BarChart2 size={18} />,
      },
      {
        label: 'User Activity',
        href: '/analytics/activity',
        icon: <Activity size={18} />,
      },
      {
        label: 'Revenue',
        href: '/analytics/revenue',
        icon: <TrendingUp size={18} />,
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        label: 'Announcements',
        href: '/system/announcements',
        icon: <Megaphone size={18} />,
      },
      {
        label: 'Audit Logs',
        href: '/system/audit-logs',
        icon: <ScrollText size={18} />,
      },
      {
        label: 'Storage',
        href: '/system/storage',
        icon: <HardDrive size={18} />,
      },
      {
        label: 'Platform Settings',
        href: '/system/settings',
        icon: <Settings size={18} />,
      },
      {
        label: 'Locations',
        href: '/locations',
        icon: <MapPin size={18} />,
      },
      {
        label: 'Disciplines',
        href: '/disciplines',
        icon: <Medal size={18} />,
      },
    ],
  },
];

function NavItemRow({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(() => {
    if (!item.children) return false;
    return item.children.some((c) => pathname.startsWith(c.href));
  });

  if (item.children) {
    const isActive = item.children.some((c) => pathname.startsWith(c.href));
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'sidebar-link w-full',
            isActive && 'text-white'
          )}
        >
          <span className="shrink-0">{item.icon}</span>
          <span className="flex-1 text-left">{item.label}</span>
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        {open && (
          <div className="ml-7 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3">
            {item.children.map((child) => {
              const active = pathname === child.href || pathname.startsWith(child.href + '/');
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={cn(
                    'block px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all',
                    active
                      ? 'text-white bg-sidebar-active'
                      : 'text-sidebar-muted hover:text-sidebar-text hover:bg-sidebar-hover'
                  )}
                >
                  {child.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
  return (
    <Link
      href={item.href!}
      className={cn('sidebar-link', active && 'active')}
    >
      <span className="shrink-0">{item.icon}</span>
      <span>{item.label}</span>
    </Link>
  );
}

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const { user, role } = useAuth();
  const roleDisplay = role ? role.replace('_', ' ').toUpperCase() : 'SUPER ADMIN';

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar-bg transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand shrink-0">
          <Zap size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-bold text-sm leading-tight">GymPulse</p>
            <p className="text-sidebar-muted text-[10px]">{roleDisplay}</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {navigation.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <p className="sidebar-group-title">{group.title}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) =>
                collapsed ? (
                  <Link
                    key={item.label}
                    href={item.href ?? (item.children?.[0]?.href ?? '#')}
                    title={item.label}
                    className="sidebar-link justify-center px-0"
                  >
                    {item.icon}
                  </Link>
                ) : (
                  <NavItemRow key={item.label} item={item} />
                )
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-sidebar-border shrink-0">
          <p className="text-[10px] text-sidebar-muted text-center truncate">
            {user?.email || ''}
          </p>
        </div>
      )}
    </aside>
  );
}
