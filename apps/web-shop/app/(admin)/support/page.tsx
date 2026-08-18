'use client';

import { MessageSquare } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Support</h1>
        <p className="text-sm text-gray-400 mt-0.5">Contact the platform super admin</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare size={18} className="text-brand" />
          <p className="font-semibold text-gray-700">My Tickets</p>
        </div>
        <p className="text-sm text-gray-500">Support tickets are not enabled.</p>
      </div>

      <div className="card space-y-3">
        <p className="font-semibold text-gray-700">New Support Ticket</p>
        <p className="text-sm text-gray-500">
          There is no tickets API on the GymPulse backend. This form is disabled so it does not pretend to submit.
        </p>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Subject</label>
          <input className="input" disabled placeholder="Not available" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">Message</label>
          <textarea className="input resize-none h-28" disabled placeholder="Not available" />
        </div>
        <div className="flex justify-end">
          <button type="button" className="btn btn-primary opacity-50 cursor-not-allowed" disabled>
            Submit Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
