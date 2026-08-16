import { ShopShell } from '@/components/layout/ShopShell'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ShopShell>{children}</ShopShell>
}
