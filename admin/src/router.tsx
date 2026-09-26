import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { useSyncExternalStore } from "react";
import { AppShell } from "@/components/AppShell";
import { LoginPage } from "@/routes/LoginPage";
import { DashboardPage } from "@/routes/DashboardPage";
import { UsersPage } from "@/routes/UsersPage";
import { MembersPage } from "@/routes/MembersPage";
import { PlansPage } from "@/routes/PlansPage";
import { CheckinPage } from "@/routes/CheckinPage";
import { BillingPage } from "@/routes/BillingPage";
import { LeadsPage } from "@/routes/LeadsPage";
import { ClassesPage, ReportsPage, TrainersPage } from "@/routes/ClassesTrainersReports";
import { SettingsPage } from "@/routes/SettingsPage";
import { getSession, isOwner, refreshSession, subscribeSession } from "@/lib/auth";

function useSessionSnap() {
  return useSyncExternalStore(subscribeSession, getSession, getSession);
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const session = useSessionSnap();
  if (!session.accessToken) return <LoginPage />;
  return children;
}

const rootRoute = createRootRoute({
  component: () => <Outlet />,
  beforeLoad: async ({ location }) => {
    const session = getSession();
    if (!session.accessToken && session.refreshToken) {
      await refreshSession();
    }
    if (!getSession().accessToken && location.pathname !== "/login") {
      throw redirect({ to: "/login" });
    }
    if (getSession().accessToken && location.pathname === "/login") {
      throw redirect({ to: "/" });
    }
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const shellRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "shell",
  component: () => (
    <AuthGate>
      <AppShell />
    </AuthGate>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/",
  component: DashboardPage,
});
const usersRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/users",
  beforeLoad: () => {
    if (!isOwner(getSession().user)) {
      throw redirect({ to: "/" });
    }
  },
  component: UsersPage,
});
const membersRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/members",
  component: MembersPage,
});
const plansRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/plans",
  component: PlansPage,
});
const checkinRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/checkin",
  component: CheckinPage,
});
const billingRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/billing",
  component: BillingPage,
});
const leadsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/leads",
  component: LeadsPage,
});
const classesRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/classes",
  component: ClassesPage,
});
const trainersRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/trainers",
  component: TrainersPage,
});
const reportsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/reports",
  component: ReportsPage,
});
const settingsRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/settings",
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  shellRoute.addChildren([
    dashboardRoute,
    usersRoute,
    membersRoute,
    plansRoute,
    checkinRoute,
    billingRoute,
    leadsRoute,
    classesRoute,
    trainersRoute,
    reportsRoute,
    settingsRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
