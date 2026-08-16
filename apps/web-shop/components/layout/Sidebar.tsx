'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  ShoppingCart,
  BarChart2,
  Tag,
  Layers,
  Star,
  AlertTriangle,
  RefreshCcw,
  Truck,
  Users,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  Zap,
  PercentSquare,
  MessageSquare,
  HelpCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href?: string
  icon: React.ReactNode
  badge?: string
  children?: { label: string; href: string }[]
}

interface NavGroup {
  title?: string
  items: NavItem[]
}

const navigation: NavGroup[] = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard',      href: '/dashboard',   icon: <LayoutDashboard size={16} /> },
    ],
  },
  {
    title: 'Inventory',
    items: [
      {
        label: 'Products',
        icon: <Package size={16} />,
        children: [
          { label: 'All Products',   href: '/products' },
          { label: 'Add Product',    href: '/products/create' },
          { label: 'Low Stock',      href: '/products/low-stock' },
          { label: 'Out of Stock',   href: '/products/out-of-stock' },
        ],
      },
      {
        label: 'Categories',
        icon: <Layers size={16} />,
        children: [
          { label: 'All Categories', href: '/categories' },
          { label: 'Add Category',   href: '/categories/create' },
        ],
      },
      { label: 'Add Product',     href: '/products/create', icon: <PackagePlus size={16} /> },
    ],
  },
  {
    title: 'Sales',
    items: [
      {
        label: 'Orders',
        icon: <ShoppingCart size={16} />,
        badge: '12',
        children: [
          { label: 'All Orders',     href: '/orders' },
          { label: 'Pending',        href: '/orders?status=pending' },
          { label: 'Processing',     href: '/orders?status=processing' },
          { label: 'Shipped',        href: '/orders?status=shipped' },
          { label: 'Delivered',      href: '/orders?status=delivered' },
          { label: 'Cancelled',      href: '/orders?status=cancelled' },
        ],
      },
      { label: 'Returns',          href: '/returns',    icon: <RefreshCcw size={16} /> },
      { label: 'Coupons',          href: '/coupons',    icon: <PercentSquare size={16} /> },
      { label: 'Reviews',          href: '/reviews',    icon: <Star size={16} /> },
    ],
  },
  {
    title: 'Shipping',
    items: [
      { label: 'Shipments',        href: '/shipments',  icon: <Truck size={16} /> },
      {
        label: 'Suppliers',
        icon: <Users size={16} />,
        children: [
          { label: 'All Suppliers', href: '/suppliers' },
          { label: 'Add Supplier',  href: '/suppliers/create' },
        ],
      },
    ],
  },
  {
    title: 'Reports',
    items: [
      { label: 'Sales Report',     href: '/reports/sales',      icon: <BarChart2 size={16} /> },
      { label: 'Inventory Report', href: '/reports/inventory',  icon: <FileText size={16} /> },
      { label: 'Low Stock Alerts', href: '/reports/low-stock',  icon: <AlertTriangle size={16} />, badge: '4' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Settings',         href: '/settings',   icon: <Settings size={16} /> },
      { label: 'Support',          href: '/support',    icon: <MessageSquare size={16} /> },
      { label: 'Help & Docs',      href: '/help',       icon: <HelpCircle size={16} /> },
    ],
  },
]

function NavRow({ item }: { item: NavItem }) {
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
          className={cn('nav-link w-full', isActive && 'text-brand')}
        >
          <span className="shrink-0 opacity-70">{item.icon}</span>
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge && (
            <span className="bg-brand text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none">
              {item.badge}
            </span>
          )}
          {open ? <ChevronDown size={13} className="opacity-50" /> : <ChevronRight size={13} className="opacity-50" />}
        </button>
        {open && (
          <div className="ml-6 mt-0.5 space-y-0.5">
            {item.children.map(child => {
              const active = pathname === child.href || pathname.startsWith(child.href + '/')
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={cn(
                    'block px-3 py-1.5 rounded-lg text-[13px] transition-all',
                    active ? 'text-brand font-semibold bg-brand-light' : 'text-gray-400 hover:text-gray-700 hover:bg-surface'
                  )}
                >
                  {child.label}
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
    <Link href={item.href!} className={cn('nav-link', active && 'active')}>
      <span className="shrink-0 opacity-70">{item.icon}</span>
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className="bg-brand text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none">
          {item.badge}
        </span>
      )}
    </Link>
  )
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-56 bg-white border-r border-surface-border flex flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-surface-border shrink-0">
        <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center">
          <Zap size={15} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-sm text-gray-800 leading-tight">GymPulse</p>
          <p className="text-[10px] text-gray-400">Shop Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navigation.map((group, gi) => (
          <div key={gi}>
            {group.title && (
              <p className="nav-group-label">{group.title}</p>
            )}
            {group.items.map(item => (
              <NavRow key={item.label} item={item} />
            ))}
          </div>
        ))}
      </nav>

      {/* Profile strip */}
      <div className="px-3 py-3 border-t border-surface-border shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-surface cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-white">SA</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-700 leading-tight truncate">Shop Admin</p>
            <p className="text-[10px] text-gray-400 truncate">admin@gympulse.app</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
