'use client';

import { HelpCircle, BookOpen, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  { q: 'How do I add a new product?', a: 'Go to Products → Add Product. Name and price are required. Categories load from the shop API.' },
  { q: 'How do I update an order status?', a: 'Go to Orders, open an order, then choose a status: pending, processing, shipped, delivered, cancelled, or refunded.' },
  { q: 'How do I create a discount coupon?', a: 'Go to Coupons and click Create Coupon. Set code, percentage or fixed value, and optional expiry.' },
  { q: 'How do I add a supplier?', a: 'Go to Shipping → Suppliers → Add Supplier. Deleting a supplier requires a super admin.' },
  { q: 'How do I handle a return request?', a: 'Go to Sales → Returns. Open a return and set status to pending, approved, rejected, or refunded.' },
  { q: 'Where can I see sales analytics?', a: 'Go to Reports → Sales Report. Totals come from delivered orders, not placeholder charts.' },
];

const docs = [
  'Product management uses GET/POST/PATCH/DELETE /admin/shop/products.',
  'Orders honor ?status= from the sidebar and update via PATCH /admin/shop/orders/{id}/status.',
  'Low stock is any product with stock greater than 0 and at or below the settings threshold (default 10).',
  'Shop settings are not a dedicated shop API. Super admins may update platform settings if allowed.',
];

export default function HelpPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Help & Docs</h1>
        <p className="text-sm text-gray-400 mt-0.5">Guides and answers for using the shop admin panel</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={17} className="text-brand" />
          <p className="font-semibold text-gray-700">Documentation</p>
        </div>
        <ul className="space-y-2">
          {docs.map((d) => (
            <li key={d} className="flex items-start gap-2.5 px-1 py-1 text-sm text-gray-600">
              <BookOpen size={14} className="text-gray-400 shrink-0 mt-0.5" />
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle size={17} className="text-brand" />
          <p className="font-semibold text-gray-700">Frequently Asked Questions</p>
        </div>
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="border-b border-surface-border last:border-0 pb-4 last:pb-0">
              <p className="font-semibold text-sm text-gray-800">{f.q}</p>
              <p className="text-sm text-gray-500 mt-1">{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-brand text-white">
        <div className="flex items-start gap-3">
          <MessageSquare size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Still need help?</p>
            <p className="text-sm text-white/70 mt-0.5">Support tickets are not enabled on this backend.</p>
            <Link href="/support" className="btn mt-3 bg-white text-brand hover:bg-white/90 h-9 text-sm">
              Go to Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
