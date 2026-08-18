'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, Package, Star,
  ImageOff, Loader2, ServerCrash,
} from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';
import {
  asArray, categoryName, formatDate, getLowStockThreshold,
  isLowStock, money, shortId, statusBadge, labelStatus,
} from '@/lib/shop';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [dashCounts, setDashCounts] = useState<any | null>(null);
  const [revenue, setRevenue] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);

    const [dashRes, productsRes, ordersRes, reviewsRes, revenueRes] = await Promise.all([
      apiFetch('/admin/system/dashboard'),
      apiFetch('/admin/shop/products?per_page=100'),
      apiFetch('/admin/shop/orders?per_page=100'),
      apiFetch('/admin/shop/reviews?per_page=100'),
      apiFetch('/admin/analytics/revenue'),
    ]);

    const productList = asArray(productsRes.data);
    const orderList = asArray(ordersRes.data);
    const reviewList = asArray(reviewsRes.data);
    setProducts(productList);
    setOrders(orderList);
    setReviews(reviewList);

    if (dashRes.status === 200 && dashRes.data) {
      setDashCounts(dashRes.data);
    } else {
      setDashCounts(null);
    }

    if (revenueRes.status === 200 && revenueRes.data) {
      const revOrders = asArray((revenueRes.data as any).orders);
      const total = revOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
      setRevenue(total);
    } else {
      const delivered = orderList.filter((o) => o.status === 'delivered');
      setRevenue(delivered.reduce((sum, o) => sum + Number(o.total_amount || 0), 0));
    }

    const firstError = [productsRes, ordersRes, reviewsRes].find((r) => r.error);
    if (firstError?.error && productList.length === 0 && orderList.length === 0) {
      setErrorMsg(firstError.error);
    }

    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const threshold = getLowStockThreshold();
  const productCount = dashCounts?.total_products ?? products.length;
  const orderCount = dashCounts?.total_orders ?? orders.length;
  const pendingCount = dashCounts?.pending_orders ?? orders.filter((o) => o.status === 'pending').length;
  const reviewCount = reviews.length;
  const lowStock = products.filter((p) => isLowStock(Number(p.stock), threshold)).slice(0, 6);
  const recentOrders = [...orders]
    .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
    .slice(0, 6);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Loading dashboard…</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Live shop overview from the GymPulse backend</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Delivered revenue', value: money(revenue), icon: <ShoppingBag size={20} className="text-white" />, gradient: 'from-orange-400 to-brand' },
          { label: 'Products', value: String(productCount ?? 0), icon: <Package size={20} className="text-white" />, gradient: 'from-emerald-400 to-teal-500' },
          { label: 'Orders', value: String(orderCount ?? 0), icon: <ShoppingBag size={20} className="text-white" />, gradient: 'from-blue-400 to-indigo-500' },
          { label: 'Reviews', value: String(reviewCount), icon: <Star size={20} className="text-white" />, gradient: 'from-yellow-400 to-amber-500' },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl p-5 bg-gradient-to-br ${s.gradient} text-white shadow-card`}>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">{s.icon}</div>
            <p className="text-xs font-medium opacity-80">{s.label}</p>
            <p className="text-2xl font-bold mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-2xl font-bold text-gray-800">{pendingCount ?? 0}</p>
          <p className="text-xs text-gray-400 mt-0.5">Pending orders</p>
          <Link href="/orders?status=pending" className="text-xs text-brand hover:underline mt-2 inline-block">View</Link>
        </div>
        <div className="card">
          <p className="text-2xl font-bold text-gray-800">{products.filter((p) => isLowStock(Number(p.stock), threshold)).length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Low stock products</p>
          <Link href="/products/low-stock" className="text-xs text-brand hover:underline mt-2 inline-block">View</Link>
        </div>
        <div className="card">
          <p className="text-2xl font-bold text-gray-800">{products.filter((p) => Number(p.stock) === 0).length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Out of stock</p>
          <Link href="/products/out-of-stock" className="text-xs text-brand hover:underline mt-2 inline-block">View</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-gray-700">Low Stock Products</p>
            <Link href="/products/low-stock" className="text-xs text-brand hover:underline">View All</Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No low-stock products.</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-surface-border flex items-center justify-center shrink-0">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt="" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <ImageOff size={14} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">{p.name}</p>
                    <p className="text-[11px] text-gray-400">{categoryName(p)} · {money(p.price)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-xs font-bold ${Number(p.stock) <= 3 ? 'text-danger' : 'text-warning'}`}>
                      {Number(p.stock)}
                    </span>
                    <p className="text-[10px] text-gray-400">in stock</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-gray-700">Recent Orders</p>
            <Link href="/orders" className="text-xs text-brand hover:underline">View All</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-surface-border flex items-center justify-center shrink-0">
                    <ShoppingBag size={14} className="text-gray-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">{shortId(o.id)}</p>
                    <p className="text-[11px] text-gray-400">{formatDate(o.created_at)} · {money(o.total_amount)}</p>
                  </div>
                  <span className={`badge ${statusBadge(o.status)} shrink-0 text-[10px]`}>
                    {labelStatus(o.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
