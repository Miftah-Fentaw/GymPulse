import { createApiClient, type ApiClient } from "@gympulse/api-client";

const STAFF_ROLES = new Set(["owner", "manager", "receptionist"]);

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
};

const listeners = new Set<() => void>();

const state: SessionState = {
  accessToken: null,
  refreshToken: typeof localStorage !== "undefined" ? localStorage.getItem("gp_refresh") : null,
  user: null,
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

export function isStaff(user: UserSummary | null | undefined) {
  return (user?.staff_roles ?? []).some((r) => STAFF_ROLES.has(r));
}

export function setSession(next: Partial<SessionState>) {
  if (next.accessToken !== undefined) state.accessToken = next.accessToken;
  if (next.refreshToken !== undefined) {
    state.refreshToken = next.refreshToken;
    if (next.refreshToken) localStorage.setItem("gp_refresh", next.refreshToken);
    else localStorage.removeItem("gp_refresh");
  }
  if (next.user !== undefined) state.user = next.user;
  emit();
}

export function clearSession() {
  setSession({ accessToken: null, refreshToken: null, user: null });
}

const baseUrl = import.meta.env.VITE_API_URL ?? "";

export const api: ApiClient = createApiClient(baseUrl || window.location.origin, {
  getAccessToken: () => state.accessToken,
});

export async function login(email: string, password: string) {
  const { data, error, response } = await api.POST("/v1/auth/login", {
    body: { email, password },
  });
  if (error || !data) {
    throw new Error(response.status === 403 ? "forbidden" : "failed");
  }
  if (!isStaff(data.user as UserSummary)) {
    throw new Error("forbidden");
  }
  setSession({
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? state.refreshToken,
    user: data.user as UserSummary,
  });
  return data;
}

export async function refreshSession() {
  const { data, error } = await api.POST("/v1/auth/refresh", {
    body: state.refreshToken ? { refresh_token: state.refreshToken } : {},
  });
  if (error || !data) {
    clearSession();
    return false;
  }
  if (!isStaff(data.user as UserSummary)) {
    clearSession();
    return false;
  }
  setSession({
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? state.refreshToken,
    user: data.user as UserSummary,
  });
  return true;
}

export async function logout() {
  try {
    await api.POST("/v1/auth/logout", {});
  } finally {
    clearSession();
  }
}

export function firstName(user: UserSummary | null) {
  const name = user?.name?.trim() || user?.email?.split("@")[0] || "there";
  return name.split(/\s+/)[0] ?? name;
}
