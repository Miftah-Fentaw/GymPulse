import { Outlet } from "@tanstack/react-router";
import { BottomNav, SideNav } from "@/components/Nav";

export function AppShell() {
  return (
    <div className="min-h-dvh bg-surface md:flex">
      <SideNav />
      <div className="relative mx-auto flex min-h-dvh w-full max-w-lg flex-1 flex-col md:max-w-none">
        <main className="flex-1 px-4 pb-24 pt-4 md:px-8 md:pb-8 md:pt-8">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
