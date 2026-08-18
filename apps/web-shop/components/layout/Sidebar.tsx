'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  ShoppingCart,
  BarChart2,
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '@/lib/apiClient';
import { asArray, getLowStockThreshold, isLowStock } from '@/lib/shop';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  badge?: string;
  children?: { label: string; href: string }[];
}

interface NavGroup {
  title?: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={16} /> },
    ],
  },
  {
    title: 'Inventory',
    items: [
      {
        label: 'Products',
        icon: <Package size={16} />,
        children: [
          { label: 'All Products', href: '/products' },
          { label: 'Add Product', href: '/products/create' },
          { label: 'Low Stock', href: '/products/low-stock' },
          { label: 'Out of Stock', href: '/products/out-of-stock' },
        ],
      },
      {
        label: 'Categories',
        icon: <Layers size={16} />,
        children: [
          { label: 'All Categories', href: '/categories' },
          { label: 'Add Category', href: '/categories/create' },
        ],
      },
      { label: 'Add Product', href: '/products/create', icon: <PackagePlus size={16} /> },
    ],
  },
  {
    title: 'Sales',
    items: [
      {
        label: 'Orders',
        icon: <ShoppingCart size={16} />,
        children: [
          { label: 'All Orders', href: '/orders' },
          { label: 'Pending', href: '/orders?status=pending' },
          { label: 'Processing', href: '/orders?status=processing' },
          { label: 'Shipped', href: '/orders?status=shipped' },
          { label: 'Delivered', href: '/orders?status=delivered' },
          { label: 'Cancelled', href: '/orders?status=cancelled' },
          { label: 'Refunded', href: '/orders?status=refunded' },
        ],
      },
      { label: 'Returns', href: '/returns', icon: <RefreshCcw size={16} /> },
      { label: 'Coupons', href: '/coupons', icon: <PercentSquare size={16} /> },
      { label: 'Reviews', href: '/reviews', icon: <Star size={16} /> },
    ],
  },
  {
    title: 'Shipping',
    items: [
      { label: 'Shipments', href: '/shipments', icon: <Truck size={16} /> },
      {
        label: 'Suppliers',
        icon: <Users size={16} />,
        children: [
          { label: 'All Suppliers', href: '/suppliers' },
          { label: 'Add Supplier', href: '/suppliers/create' },
        ],
      },
    ],
  },
  {
    title: 'Reports',
    items: [
      { label: 'Sales Report', href: '/reports/sales', icon: <BarChart2 size={16} /> },
      { label: 'Inventory Report', href: '/reports/inventory', icon: <FileText size={16} /> },
      { label: 'Low Stock Alerts', href: '/reports/low-stock', icon: <AlertTriangle size={16} /> },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Settings', href: '/settings', icon: <Settings size={16} /> },
      { label: 'Support', href: '/support', icon: <MessageSquare size={16} /> },
      { label: 'Help & Docs', href: '/help', icon: <HelpCircle size={16} /> },
    ],
  },
];

function pathOnly(href: string) {
  return href.split('?')[0];
}

function childIsActive(childHref: string, pathname: string, searchParams: URLSearchParams) {
  const [path, query] = childHref.split('?');
  if (pathname !== path && !pathname.startsWith(path + '/')) return false;
  const params = new URLSearchParams(query || '');
  const status = params.get('status');
  if (path === '/orders') {
    return (searchParams.get('status') || '') === (status || '');
  }
  return !query || Array.from(params.entries()).every(([k, v]) => searchParams.get(k) === v);
}

function NavRow({ item, pendingOrders, lowStock }: { item: NavItem; pendingOrders?: number; lowStock?: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const badge =
    item.label === 'Orders' && pendingOrders
      ? String(pendingOrders)
      : item.label === 'Low Stock Alerts' && lowStock
        ? String(lowStock)
        : item.badge;
  const [open, setOpen] = useState(() =>
    item.children ? item.children.some((c) => pathname.startsWith(pathOnly(c.href))) : false
  );

  if (item.children) {
    const isActive = item.children.some((c) => childIsActive(c.href, pathname, searchParams));
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn('nav-link w-full', isActive && 'text-brand')}
        >
          <span className="shrink-0 opacity-70">{item.icon}</span>
          <span className="flex-1 text-left">{item.label}</span>
          {badge && (
            <span className="bg-brand text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none">
              {badge}
            </span>
          )}
          {open ? <ChevronDown size={13} className="opacity-50" /> : <ChevronRight size={13} className="opacity-50" />}
        </button>
        {open && (
          <div className="ml-6 mt-0.5 space-y-0.5">
            {item.children.map((child) => {
              const active = childIsActive(child.href, pathname, searchParams);
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
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const active = pathname === item.href;
  return (
    <Link href={item.href!} className={cn('nav-link', active && 'active')}>
      <span className="shrink-0 opacity-70">{item.icon}</span>
      <span className="flex-1">{item.label}</span>
      {badge && (
        <span className="bg-brand text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none">
          {badge}
        </span>
      )}
    </Link>
  );
}

function SidebarInner() {
  const { user, role } = useAuth();
  const [pendingOrders, setPendingOrders] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const userEmail = user?.email || '';
  const roleDisplay = role ? role.replace('_', ' ').toUpperCase() : '';
  const initials = userEmail ? userEmail.substring(0, 2).toUpperCase() : 'GP';

  useEffect(() => {
    (async () => {
      const [ordersRes, productsRes] = await Promise.all([
        apiFetch('/admin/shop/orders?status=pending&per_page=100'),
        apiFetch('/admin/shop/products?per_page=100'),
      ]);
      if (!ordersRes.error) setPendingOrders(asArray(ordersRes.data).length);
      if (!productsRes.error) {
        const threshold = getLowStockThreshold();
        setLowStock(asArray(productsRes.data).filter((p) => isLowStock(Number(p.stock), threshold)).length);
      }
    })();
  }, []);

  return (
    <aside className="fixed inset-y-0 left-0 w-56 bg-white border-r border-surface-border flex flex-col z-40">
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-surface-border shrink-0">
        <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center">
          <Zap size={15} className="text-white" />
        </div>
        <div>
          <p className="font-bold text-sm text-gray-800 leading-tight">GymPulse</p>
          <p className="text-[10px] text-gray-400">{roleDisplay}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navigation.map((group, gi) => (
          <div key={gi}>
            {group.title && (
              <p className="nav-group-label">{group.title}</p>
            )}
            {group.items.map((item) => (
              <NavRow key={item.label} item={item} pendingOrders={pendingOrders} lowStock={lowStock} />
            ))}
          </div>
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-surface-border shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-surface cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-white">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-700 leading-tight truncate">{roleDisplay}</p>
            <p className="text-[10px] text-gray-400 truncate">{userEmail}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function Sidebar() {
  return (
    <Suspense fallback={<aside className="fixed inset-y-0 left-0 w-56 bg-white border-r border-surface-border" />}>
      <SidebarInner />
    </Suspense>
  );
}
