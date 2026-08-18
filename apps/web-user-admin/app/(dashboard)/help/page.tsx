'use client';

import { HelpCircle, BookOpen } from 'lucide-react';

const faqs = [
  { q: 'How do I ban a member?', a: 'Go to Members → All Members, find the user, then click the Ban icon in the Actions column.' },
  { q: 'How do I create a class?', a: 'Go to Classes → Add Class or click the "Add Class" button on any class page.' },
  { q: 'How do I verify a trainer?', a: 'Go to Trainers → Pending Review to see all trainers awaiting verification, then click Verify.' },
  { q: 'Can I cancel a booking?', a: 'Yes. Go to Bookings, find the booking, and update the status to Cancelled.' },
  { q: 'What does "No-Show" mean?', a: 'A no-show booking means the member confirmed but did not attend the class.' },
  { q: 'How do I export booking data?', a: 'Currently bookings can be viewed on the Bookings page. CSV export is not available yet.' },
];

const docs = [
  'Getting Started Guide',
  'Class Management Guide',
  'Member Management Guide',
  'Trainer Verification Guide',
];

export default function HelpPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-ink">Help & Documentation</h1>
        <p className="text-sm text-ink-muted mt-0.5">Find answers and guides for using the user admin panel</p>
      </div>

      <div className="card">
        <p className="font-semibold text-ink mb-3">Documentation</p>
        <div className="space-y-2">
          {docs.map((title) => (
            <div
              key={title}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sheet"
            >
              <BookOpen size={16} className="text-ink-muted" />
              <span className="text-sm text-ink">{title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle size={18} className="text-ink-muted" />
          <p className="font-semibold text-ink">Frequently Asked Questions</p>
        </div>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="border-b border-sheet-border last:border-0 pb-4 last:pb-0">
              <p className="font-semibold text-sm text-ink">{f.q}</p>
              <p className="text-sm text-ink-muted mt-1">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
