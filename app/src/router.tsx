import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { getSession, refreshSession } from "@/lib/auth";
import { WelcomePage } from "@/routes/WelcomePage";
import { SignInPage } from "@/routes/SignInPage";
import { SignUpPage } from "@/routes/SignUpPage";
import { HomePage } from "@/routes/HomePage";
import { ExplorePage } from "@/routes/ExplorePage";
import { SchedulePage } from "@/routes/SchedulePage";
import { ProfilePage } from "@/routes/ProfilePage";
import { WorkoutDetailPage } from "@/routes/WorkoutDetailPage";
import { TrainerDetailPage } from "@/routes/TrainerDetailPage";
import { FaqPage } from "@/routes/FaqPage";
import { CheckInPage } from "@/routes/CheckInPage";
import { BillingPage } from "@/routes/BillingPage";

const publicPaths = new Set(["/welcome", "/sign-in", "/sign-up"]);

const rootRoute = createRootRoute({
  component: () => <Outlet />,
  beforeLoad: async ({ location }) => {
    const session = getSession();
    if (!session.accessToken && session.refreshToken) {
      await refreshSession();
    }
    const authed = Boolean(getSession().accessToken);
    if (!authed && !publicPaths.has(location.pathname)) {
      throw redirect({ to: "/welcome" });
    }
    if (authed && publicPaths.has(location.pathname)) {
      throw redirect({ to: "/" });
    }
  },
});

const welcomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/welcome",
  component: WelcomePage,
});

const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-in",
  component: SignInPage,
});

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-up",
  component: SignUpPage,
});

const shellRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "shell",
  component: AppShell,
});

const homeRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/",
  component: HomePage,
});

const exploreRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/explore",
  validateSearch: (search: Record<string, unknown>): { q?: string } => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  component: ExplorePage,
});

const scheduleRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/schedule",
  component: SchedulePage,
});

const profileRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/profile",
  component: ProfilePage,
});

const checkInRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/check-in",
  component: CheckInPage,
});

const billingRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/billing",
  component: BillingPage,
});

const faqRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/faq",
  component: FaqPage,
});

const workoutRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/workouts/$workoutId",
  component: WorkoutDetailPage,
});

const trainerRoute = createRoute({
  getParentRoute: () => shellRoute,
  path: "/trainers/$trainerId",
  component: TrainerDetailPage,
});

const routeTree = rootRoute.addChildren([
  welcomeRoute,
  signInRoute,
  signUpRoute,
  shellRoute.addChildren([
    homeRoute,
    exploreRoute,
    scheduleRoute,
    checkInRoute,
    billingRoute,
    profileRoute,
    faqRoute,
    workoutRoute,
    trainerRoute,
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
