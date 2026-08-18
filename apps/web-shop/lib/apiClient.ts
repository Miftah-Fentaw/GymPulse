const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('gympulse_shop_admin_token');
}

export function setStoredToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('gympulse_shop_admin_token', token);
  } else {
    localStorage.removeItem('gympulse_shop_admin_token');
  }
}

export function getStoredUser(): any | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('gympulse_shop_admin_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredUser(user: any | null) {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem('gympulse_shop_admin_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('gympulse_shop_admin_user');
  }
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null; status?: number }> {
  try {
    const token = getStoredToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${cleanEndpoint}`;

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const errText = await res.text();
      let msg = `Backend Error (HTTP ${res.status}): ${res.statusText}`;
      try {
        const parsed = JSON.parse(errText);
        if (parsed.message) msg = parsed.message;
        else if (parsed.error) msg = parsed.error;
      } catch {
        if (errText) msg = errText;
      }
      return { data: null, error: msg, status: res.status };
    }

    if (res.status === 204) {
      return { data: null, error: null, status: 204 };
    }

    const json = await res.json();
    const data = json && typeof json === 'object' && 'data' in json ? json.data : json;
    return { data, error: null, status: res.status };
  } catch (err: any) {
    return {
      data: null,
      error: `GymPulse Backend Offline: Could not connect to API server at ${API_BASE_URL}. Ensure the Go backend service is running.`,
      status: 0,
    };
  }
}
