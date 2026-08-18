'use client';

import { useEffect, useState } from 'react';
import { PackageX, Plus, Loader2, ServerCrash } from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';
import { asArray, categoryName, money } from '@/lib/shop';

export default function OutOfStockPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await apiFetch('/admin/shop/products?per_page=100');
    if (error) {
      setErrorMsg(error);
      setItems([]);
    } else {
      setItems(asArray(data).filter((p) => Number(p.stock) === 0));
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const restock = async (id: string) => {
    const raw = prompt('New stock quantity', '10');
    if (raw == null) return;
    const stock = Number(raw);
    if (!Number.isFinite(stock) || stock < 0) {
      alert('Enter a valid stock quantity.');
      return;
    }
    const { error } = await apiFetch(`/admin/shop/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    });
    if (error) alert(error);
    else load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-danger-light flex items-center justify-center">
          <PackageX size={20} className="text-danger" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Out of Stock</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {loading ? 'Loading…' : `${items.length} products with zero inventory`}
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-xs">Loading products…</span>
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-16">No out-of-stock products.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface">
                <tr>
                  <th className="th">Product</th>
                  <th className="th">Category</th>
                  <th className="th">Price</th>
                  <th className="th text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="hover:bg-surface/60 transition-colors">
                    <td className="td">
                      <p className="font-semibold text-xs text-gray-800">{p.name}</p>
                    </td>
                    <td className="td"><span className="badge badge-neutral text-[10px]">{categoryName(p)}</span></td>
                    <td className="td font-bold text-gray-800">{money(p.price)}</td>
                    <td className="td text-right">
                      <button className="btn btn-outline h-7 text-xs gap-1" onClick={() => restock(p.id)}>
                        <Plus size={12} /> Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
