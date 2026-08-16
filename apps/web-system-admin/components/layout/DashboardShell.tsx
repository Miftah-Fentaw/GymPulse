'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar collapsed={collapsed} />
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: collapsed ? 64 : 256 }}
      >
        <Topbar onToggleSidebar={() => setCollapsed(!collapsed)} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
