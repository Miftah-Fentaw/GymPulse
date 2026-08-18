'use client';

import { UserCheck } from 'lucide-react';

export default function PendingMembersPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-warn-light flex items-center justify-center">
          <UserCheck size={20} className="text-warn" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-ink">Pending Approvals</h1>
          <p className="text-sm text-ink-muted mt-0.5">Member approval is not part of the current API</p>
        </div>
      </div>

      <div className="card py-12 text-center">
        <p className="text-sm font-semibold text-ink">Approvals are not required</p>
        <p className="text-xs text-ink-muted mt-1 max-w-md mx-auto">
          Members are active after signup. There is no approval queue to review.
        </p>
      </div>
    </div>
  );
}
