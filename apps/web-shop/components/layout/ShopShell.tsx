import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function ShopShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-56">
        <Topbar />
        <main className="flex-1 p-6">{children}</main>
        <footer className="text-center text-[11px] text-gray-400 py-4 border-t border-surface-border">
          © 2025 GymPulse Shop Admin. All rights reserved.
        </footer>
      </div>
    </div>
  )
}
