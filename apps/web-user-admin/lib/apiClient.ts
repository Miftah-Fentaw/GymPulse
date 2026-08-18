const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('gympulse_admin_token');
}

export function setStoredToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem('gympulse_admin_token', token);
  } else {
    localStorage.removeItem('gympulse_admin_token');
  }
}

export function getStoredUser(): any | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('gympulse_admin_user');
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
    localStorage.setItem('gympulse_admin_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('gympulse_admin_user');
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

export function asArray<T = any>(data: any): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && Array.isArray(data.users)) return data.users as T[];
  if (data && Array.isArray(data.items)) return data.items as T[];
  return [];
}

export function extractCount(value: any): number {
  if (value == null) return 0;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value !== '' && Number.isFinite(Number(value))) {
    return Number(value);
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return 0;
    return extractCount(value[0]);
  }
  if (typeof value === 'object') {
    if ('count' in value) return extractCount(value.count);
    if ('total' in value) return extractCount(value.total);
  }
  return 0;
}

export function formatDate(iso?: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString();
}

export function formatDay(iso?: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString();
}

export function initialsFrom(name?: string | null, email?: string | null): string {
  const src = (name || email || 'GP').trim();
  const parts = src.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}
