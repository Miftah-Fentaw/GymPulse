'use client';

import { useEffect, useMemo, useState } from 'react';
import { Package, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';
import { asArray, categoryName, getLowStockThreshold, isLowStock, money } from '@/lib/shop';

export default function InventoryReportPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const threshold = getLowStockThreshold();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        apiFetch('/admin/shop/products?per_page=100'),
        apiFetch('/admin/shop/categories'),
      ]);
      if (prodRes.error) setErrorMsg(prodRes.error);
      setProducts(asArray(prodRes.data));
      setCategories(asArray(catRes.data));
      setLoading(false);
    })();
  }, []);

  const report = useMemo(() => {
    const low = products.filter((p) => isLowStock(Number(p.stock), threshold));
    const out = products.filter((p) => Number(p.stock) === 0);
    const value = products.reduce((sum, p) => sum + Number(p.price || 0) * Number(p.stock || 0), 0);
    const byCat = categories.map((c) => {
      const rows = products.filter((p) => p.category_id === c.id || categoryName(p) === c.name);
      const inStock = rows.filter((p) => Number(p.stock) > 0).length;
      return {
        cat: c.name,
        total: rows.length,
        inStock,
        lowStock: rows.filter((p) => isLowStock(Number(p.stock), threshold)).length,
        outOfStock: rows.filter((p) => Number(p.stock) === 0).length,
        value: rows.reduce((sum, p) => sum + Number(p.price || 0) * Number(p.stock || 0), 0),
      };
    });
    const uncategorized = products.filter((p) => !p.category_id);
    if (uncategorized.length) {
      byCat.push({
        cat: 'Uncategorized',
        total: uncategorized.length,
        inStock: uncategorized.filter((p) => Number(p.stock) > 0).length,
        lowStock: uncategorized.filter((p) => isLowStock(Number(p.stock), threshold)).length,
        outOfStock: uncategorized.filter((p) => Number(p.stock) === 0).length,
        value: uncategorized.reduce((sum, p) => sum + Number(p.price || 0) * Number(p.stock || 0), 0),
      });
    }
    return { low, out, value, byCat };
  }, [products, categories, threshold]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400 gap-2">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Loading inventory report…</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Inventory Report</h1>
        <p className="text-sm text-gray-400 mt-0.5">Stock levels computed from live products</p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Products', value: String(products.length), color: 'text-brand', bg: 'bg-brand/10' },
          { label: 'In Stock', value: String(products.filter((p) => Number(p.stock) > 0).length), color: 'text-success', bg: 'bg-success/10' },
          { label: 'Low Stock', value: String(report.low.length), color: 'text-warning', bg: 'bg-warning/10' },
          { label: 'Inventory Value', value: money(report.value), color: 'text-violet', bg: 'bg-violet/10' },
        ].map((s) => (
          <div key={s.label} className="card">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${s.bg}`}>
              <Package size={16} className={s.color} />
            </div>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-border">
          <p className="font-semibold text-sm text-gray-700">Stock by Category</p>
        </div>
        {report.byCat.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12">No categories or products yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface">
                <tr>
                  <th className="th">Category</th>
                  <th className="th">Total</th>
                  <th className="th">In Stock</th>
                  <th className="th">Low Stock</th>
                  <th className="th">Out of Stock</th>
                  <th className="th">Inventory Value</th>
                </tr>
              </thead>
              <tbody>
                {report.byCat.map((c) => (
                  <tr key={c.cat} className="hover:bg-surface/60 transition-colors">
                    <td className="td font-semibold text-gray-800">{c.cat}</td>
                    <td className="td">{c.total}</td>
                    <td className="td text-success font-medium">{c.inStock}</td>
                    <td className="td text-warning font-medium">{c.lowStock}</td>
                    <td className="td text-danger font-medium">{c.outOfStock}</td>
                    <td className="td font-semibold">{money(c.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <p className="font-semibold text-sm text-gray-700 mb-4">Items Below Reorder Threshold</p>
        {report.low.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No low-stock items.</p>
        ) : (
          <div className="space-y-3">
            {report.low.map((item) => {
              const pct = (Number(item.stock) / threshold) * 100;
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 flex-1 truncate">{item.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-20 h-1.5 bg-surface rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${pct <= 30 ? 'bg-danger' : 'bg-warning'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                    <span className={`text-xs font-bold w-12 text-right ${pct <= 30 ? 'text-danger' : 'text-warning'}`}>
                      {item.stock}/{threshold}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
