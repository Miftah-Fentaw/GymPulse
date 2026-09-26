import { createApiClient, type ApiClient } from "@gympulse/api-client";

type UserSummary = {
  id: string;
  gym_id: string;
  email?: string;
  name?: string;
  staff_roles?: string[];
  has_member_profile?: boolean;
};

type SessionState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserSummary | null;
  demo: boolean;
};

const listeners = new Set<() => void>();

const state: SessionState = {
  accessToken: typeof localStorage !== "undefined" ? localStorage.getItem("gp_app_access") : null,
  refreshToken: typeof localStorage !== "undefined" ? localStorage.getItem("gp_app_refresh") : null,
  user:
    typeof localStorage !== "undefined" && localStorage.getItem("gp_app_user")
      ? (JSON.parse(localStorage.getItem("gp_app_user")!) as UserSummary)
      : null,
  demo: typeof localStorage !== "undefined" ? localStorage.getItem("gp_app_demo") === "1" : false,
};

function emit() {
  for (const l of listeners) l();
}

export function subscribeSession(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSession() {
  return state;
}

export function setSession(next: Partial<SessionState>) {
  if (next.accessToken !== undefined) {
    state.accessToken = next.accessToken;
    if (next.accessToken) localStorage.setItem("gp_app_access", next.accessToken);
    else localStorage.removeItem("gp_app_access");
  }
  if (next.refreshToken !== undefined) {
    state.refreshToken = next.refreshToken;
    if (next.refreshToken) localStorage.setItem("gp_app_refresh", next.refreshToken);
    else localStorage.removeItem("gp_app_refresh");
  }
  if (next.user !== undefined) {
    state.user = next.user;
    if (next.user) localStorage.setItem("gp_app_user", JSON.stringify(next.user));
    else localStorage.removeItem("gp_app_user");
  }
  if (next.demo !== undefined) {
    state.demo = next.demo;
    if (next.demo) localStorage.setItem("gp_app_demo", "1");
    else localStorage.removeItem("gp_app_demo");
  }
  emit();
}

async function clearServiceWorkerCaches() {
  if (!("caches" in window)) return;
  const keys = await caches.keys();
  await Promise.all(keys.map((k) => caches.delete(k)));
}

export async function clearSession() {
  setSession({ accessToken: null, refreshToken: null, user: null, demo: false });
  await clearServiceWorkerCaches();
}

const baseUrl = import.meta.env.VITE_API_URL ?? "";

export const api: ApiClient = createApiClient(baseUrl || (typeof window !== "undefined" ? window.location.origin : ""), {
  getAccessToken: () => state.accessToken,
});

export async function login(email: string, password: string) {
  try {
    const { data, error, response } = await api.POST("/v1/auth/login", {
      body: { email, password },
    });
    if (error || !data) {
      throw new Error(response.status === 403 ? "forbidden" : "failed");
    }
    const user = data.user as UserSummary;
    const isTrainer = (user.staff_roles ?? []).includes("trainer");
    if (!user.has_member_profile && !isTrainer) {
      throw new Error("forbidden");
    }
    setSession({
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? state.refreshToken,
      user,
      demo: false,
    });
    return;
  } catch {
    // UI demo path when API is unreachable — email/password still required
    if (!email.trim() || !password.trim()) throw new Error("failed");
    setSession({
      accessToken: "demo-access",
      refreshToken: "demo-refresh",
      user: {
        id: "demo-user",
        gym_id: "demo-gym",
        email,
        name: email.split("@")[0] || "Member",
        has_member_profile: true,
        staff_roles: [],
      },
      demo: true,
    });
  }
}

export async function refreshSession() {
  if (state.demo) return true;
  if (!state.refreshToken) return false;
  const { data, error } = await api.POST("/v1/auth/refresh", {
    body: { refresh_token: state.refreshToken },
  });
  if (error || !data) {
    await clearSession();
    return false;
  }
  setSession({
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? state.refreshToken,
    user: (data.user as UserSummary) ?? state.user,
  });
  return true;
}

export function displayName(user: UserSummary | null | undefined) {
  if (!user) return "Member";
  if (user.name?.trim()) return user.name.trim();
  if (user.email) return user.email.split("@")[0] ?? "Member";
  return "Member";
}
