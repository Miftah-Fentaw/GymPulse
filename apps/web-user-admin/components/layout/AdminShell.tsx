import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-sheet flex">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-60">
        <Topbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
