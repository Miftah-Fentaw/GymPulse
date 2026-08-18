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

interface AuthContextType {
  user: any | null;
  role: string | null;
  loading: boolean;
  backendError: string | null;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  backendError: null,
  signIn: async () => ({ success: false }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const verifyAuthSession = async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setRole(null);
      setLoading(false);
      return;
    }

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
    const adminRole = data?.app_metadata?.admin_role || getStoredUser()?.app_metadata?.admin_role || 'super_admin';
    setRole(adminRole);
    setLoading(false);
  };

  useEffect(() => {
    verifyAuthSession();
  }, []);

  // Protection Guard
  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname?.startsWith('/login');
      const token = getStoredToken();
      if (!token && !isAuthPage) {
        router.push('/login');
      } else if (token && user && isAuthPage) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, pathname, router]);

  const signIn = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    setBackendError(null);

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
    setLoading(false);

    router.push('/dashboard');
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
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        backendError,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
