'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';
import { asArray, categoryName, getLowStockThreshold, isLowStock, money } from '@/lib/shop';

export default function LowStockReportPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const threshold = getLowStockThreshold();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await apiFetch('/admin/shop/products?per_page=100');
      if (error) {
        setErrorMsg(error);
        setItems([]);
      } else {
        setItems(
          asArray(data)
            .filter((p) => isLowStock(Number(p.stock), threshold))
            .sort((a, b) => Number(a.stock) - Number(b.stock))
        );
      }
      setLoading(false);
    })();
  }, [threshold]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-warning-light flex items-center justify-center">
          <AlertTriangle size={20} className="text-warning" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Low Stock Alerts</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {loading ? 'Loading…' : `${items.length} products at or below ${threshold} units`}
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Critical (≤3 units)', value: items.filter((a) => Number(a.stock) <= 3).length, color: 'text-danger' },
          { label: `Low (4–${threshold} units)`, value: items.filter((a) => Number(a.stock) > 3).length, color: 'text-warning' },
          { label: 'Total Alerts', value: items.length, color: 'text-gray-800' },
        ].map((s) => (
          <div key={s.label} className="card py-4 text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-xs">Loading products…</span>
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-16">No low-stock products.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface">
                <tr>
                  <th className="th">Product</th>
                  <th className="th">Category</th>
                  <th className="th">Current Stock</th>
                  <th className="th">Threshold</th>
                  <th className="th">Price</th>
                  <th className="th">Urgency</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => {
                  const pct = (Number(p.stock) / threshold) * 100;
                  const isCritical = Number(p.stock) <= 3;
                  return (
                    <tr key={p.id} className="hover:bg-surface/60 transition-colors">
                      <td className="td font-semibold text-xs text-gray-800">{p.name}</td>
                      <td className="td"><span className="badge badge-neutral text-[10px]">{categoryName(p)}</span></td>
                      <td className="td">
                        <span className={`font-bold text-sm ${isCritical ? 'text-danger' : 'text-warning'}`}>{p.stock}</span>
                      </td>
                      <td className="td text-gray-400">{threshold}</td>
                      <td className="td font-semibold">{money(p.price)}</td>
                      <td className="td">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[60px] h-1.5 bg-surface rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${isCritical ? 'bg-danger' : 'bg-warning'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                          <span className={`text-[10px] font-bold ${isCritical ? 'text-danger' : 'text-warning'}`}>
                            {Math.round(pct)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
