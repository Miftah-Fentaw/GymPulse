'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  apiFetch,
  getStoredToken,
  setStoredToken,
  getStoredUser,
  setStoredUser,
} from '../lib/apiClient';

export interface Discipline {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  is_active?: boolean;
}

interface AuthContextType {
  user: any | null;
  role: string | null;
  loading: boolean;
  backendError: string | null;
  myDisciplines: Discipline[];
  activeDiscipline: Discipline | null;
  setActiveDiscipline: (disc: Discipline | null) => void;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshDisciplines: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  backendError: null,
  myDisciplines: [],
  activeDiscipline: null,
  setActiveDiscipline: () => {},
  signIn: async () => ({ success: false }),
  signOut: async () => {},
  refreshDisciplines: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [myDisciplines, setMyDisciplines] = useState<Discipline[]>([]);
  const [activeDiscipline, setActiveDiscipline] = useState<Discipline | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const fetchMyDisciplines = async () => {
    const { data, error } = await apiFetch('/admin/my-disciplines');
    if (!error && Array.isArray(data)) {
      setMyDisciplines(data);
      if (data.length > 0 && !activeDiscipline) {
        setActiveDiscipline(data[0]);
      }
    } else if (error) {
      console.warn('Failed to load disciplines from backend:', error);
    }
  };

  const verifyAuthSession = async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setRole(null);
      setMyDisciplines([]);
      setActiveDiscipline(null);
      setLoading(false);
      return;
    }

    // Verify token with backend GET /admin/auth/me
    const { data, error, status } = await apiFetch('/admin/auth/me');

    if (error || !data) {
      if (status === 401 || status === 403) {
        setStoredToken(null);
        setStoredUser(null);
        setUser(null);
        setRole(null);
      } else {
        setBackendError(error || 'Failed to verify authentication with backend.');
      }
      setLoading(false);
      return;
    }

    setBackendError(null);
    setUser(data);
    const adminRole = data?.app_metadata?.admin_role || getStoredUser()?.app_metadata?.admin_role || 'sport_admin';
    setRole(adminRole);

    await fetchMyDisciplines();
    setLoading(false);
  };

  useEffect(() => {
    verifyAuthSession();
  }, []);

  // Strict Protection Guard
  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname?.startsWith('/login');
      const token = getStoredToken();
      if (!token && !isAuthPage) {
        router.push('/login');
      } else if (token && user && isAuthPage) {
        router.push('/');
      }
    }
  }, [user, loading, pathname, router]);

  const signIn = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    setBackendError(null);

    // Call Backend API POST /admin/auth/signin
    const { data, error } = await apiFetch('/admin/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), password: pass }),
    });

    if (error || !data) {
      setLoading(false);
      return { success: false, error: error || 'Authentication failed' };
    }

    const token = data.access_token;
    const userData = data.user;
    const adminRole = data.admin_role || userData?.app_metadata?.admin_role;

    if (!token || !adminRole) {
      setLoading(false);
      return { success: false, error: 'Access Denied: User account is not an authorized admin.' };
    }

    setStoredToken(token);
    setStoredUser(userData);
    setUser(userData);
    setRole(adminRole);

    await fetchMyDisciplines();
    setLoading(false);

    router.push('/');
    return { success: true };
  };

  const signOut = async () => {
    const token = getStoredToken();
    if (token) {
      await apiFetch('/admin/auth/signout', { method: 'POST' });
    }
    setStoredToken(null);
    setStoredUser(null);
    setUser(null);
    setRole(null);
    setMyDisciplines([]);
    setActiveDiscipline(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        backendError,
        myDisciplines,
        activeDiscipline,
        setActiveDiscipline,
        signIn,
        signOut,
        refreshDisciplines: fetchMyDisciplines,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
