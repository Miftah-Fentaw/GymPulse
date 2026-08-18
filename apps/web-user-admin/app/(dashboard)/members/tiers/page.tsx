'use client';

import { Crown } from 'lucide-react';

export default function MembershipTiersPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-ink">Membership Tiers</h1>
        <p className="text-sm text-ink-muted mt-0.5">How member plans are represented in this admin</p>
      </div>

      <div className="card max-w-2xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-sheet flex items-center justify-center">
            <Crown size={18} className="text-ink" />
          </div>
          <p className="font-bold text-ink">No billed tiers in the API yet</p>
        </div>
        <p className="text-sm text-ink-muted leading-relaxed">
          The backend does not expose membership plans, pricing, or revenue for app users.
          Premium is only shown when a user record includes <code>user_metadata.tier = premium</code>.
          There is no MRR or paid-plan count to display.
        </p>
      </div>
    </div>
  );
}
