import { HelpCircle, BookOpen, ExternalLink, MessageSquare } from 'lucide-react'

const faqs = [
  { q: 'How do I add a new product?',           a: 'Go to Products → Add Product or click "Add Product" in the sidebar. Fill in all required fields and save.' },
  { q: 'How do I update an order status?',      a: 'Go to Orders, find the order, click View, then use the status dropdown to update it.' },
  { q: 'How do I create a discount coupon?',    a: 'Go to Coupons and click "Create Coupon". Set the type, value, and expiry date.' },
  { q: 'How do I add a supplier?',              a: 'Go to Shipping → Suppliers → Add Supplier. Fill in company and contact details.' },
  { q: 'How do I handle a return request?',     a: 'Go to Sales → Returns. Review the request and approve or reject it from the table.' },
  { q: 'Where can I see sales analytics?',      a: 'Go to Reports → Sales Report for revenue charts and top product breakdowns.' },
  { q: 'Can I upload multiple product images?', a: 'Yes. On the product edit page, click the image upload zone and select multiple files (up to 8).' },
]

const docs = [
  { title: 'Product Management Guide',    href: '#' },
  { title: 'Order Processing Workflow',   href: '#' },
  { title: 'Coupons & Promotions Guide',  href: '#' },
  { title: 'Supplier Setup Guide',        href: '#' },
  { title: 'Returns & Refunds Policy',    href: '#' },
  { title: 'Reports Glossary',            href: '#' },
]

export default function HelpPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Help & Docs</h1>
        <p className="text-sm text-gray-400 mt-0.5">Guides and answers for using the shop admin panel</p>
      </div>

      {/* Docs */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={17} className="text-brand" />
          <p className="font-semibold text-gray-700">Documentation</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {docs.map(d => (
            <a
              key={d.title}
              href={d.href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-surface transition-colors"
            >
              <BookOpen size={14} className="text-gray-400 shrink-0" />
              <span className="text-sm text-gray-700 flex-1">{d.title}</span>
              <ExternalLink size={12} className="text-gray-400 shrink-0" />
            </a>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle size={17} className="text-brand" />
          <p className="font-semibold text-gray-700">Frequently Asked Questions</p>
        </div>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="border-b border-surface-border last:border-0 pb-4 last:pb-0">
              <p className="font-semibold text-sm text-gray-800">{f.q}</p>
              <p className="text-sm text-gray-500 mt-1">{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact block */}
      <div className="card bg-brand text-white">
        <div className="flex items-start gap-3">
          <MessageSquare size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Still need help?</p>
            <p className="text-sm text-white/70 mt-0.5">Contact the super admin or submit a support ticket.</p>
            <a href="/support" className="btn mt-3 bg-white text-brand hover:bg-white/90 h-9 text-sm">
              Open a Ticket
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
