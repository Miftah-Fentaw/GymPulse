import { Suspense } from 'react'
import { AdminShell } from '@/components/layout/AdminShell'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell>
      <Suspense fallback={null}>{children}</Suspense>
    </AdminShell>
  )
}
