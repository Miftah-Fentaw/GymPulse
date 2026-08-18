'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ServerCrash } from 'lucide-react';
import { apiFetch } from '@/lib/apiClient';

export default function CreateSupplierPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    contact_name: '',
    email: '',
    phone: '',
    category: '',
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    const { error } = await apiFetch('/admin/shop/suppliers', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (error) setErrorMsg(error);
    else router.push('/suppliers');
  };

  return (
    <div className="space-y-5 max-w-xl">
      <div className="flex items-center gap-3">
        <Link href="/suppliers" className="btn btn-ghost p-2"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Add Supplier</h1>
          <p className="text-sm text-gray-400 mt-0.5">Register a new product supplier</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <ServerCrash size={16} className="mt-0.5 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-4">
        <h2 className="font-semibold text-sm text-gray-700 pb-2 border-b border-surface-border">Supplier Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Company Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Contact Person</label>
            <input className="input" value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Email</label>
            <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Phone</label>
            <input type="tel" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Category</label>
            <input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-500 mb-1 block">Address</label>
            <input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Link href="/suppliers" className="btn btn-outline">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Add Supplier'}</button>
        </div>
      </form>
    </div>
  );
}
