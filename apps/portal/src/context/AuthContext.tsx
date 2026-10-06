'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../lib/api';

export interface UserContextType {
  id: string;
  email: string;
  displayName: string;
  organization?: { id: string; legalName: string } | null;
  role?: { id: string; name: string } | null;
}

interface AuthContextType {
  user: UserContextType | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, mfaCode?: string) => Promise<{ success: boolean; mfaRequired?: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isDirector: boolean;
  isPanaceaStaff: boolean;
  isBankClient: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserContextType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Hydrate session from localStorage or verify with server
    const savedToken = localStorage.getItem('panacea_token');
    const savedUser = localStorage.getItem('panacea_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // Fallback
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, mfaCode?: string) => {
    const res = await apiFetch<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, mfaCode }),
    });

    if (res.error) {
      return { success: false, error: res.error.message };
    }

    if (res.data?.mfaRequired) {
      return { success: false, mfaRequired: true };
    }

    if (res.data?.user && res.data?.session) {
      setUser(res.data.user);
      setToken(res.data.session.token);
      localStorage.setItem('panacea_token', res.data.session.token);
      localStorage.setItem('panacea_user', JSON.stringify(res.data.user));
      return { success: true };
    }

    return { success: false, error: 'Unexpected login response' };
  };

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('panacea_token');
    localStorage.removeItem('panacea_user');
    router.push('/login');
  };

  const isAdmin =
    user?.role?.name === 'platform_super_admin' ||
    user?.role?.name === 'security_compliance_admin' ||
    user?.role?.name === 'operations_admin';

  const isDirector =
    user?.role?.name === 'platform_super_admin' ||
    user?.role?.name === 'operations_admin';

  const isPanaceaStaff = [
    'platform_super_admin',
    'operations_admin',
    'security_compliance_admin',
    'panacea_legal_recovery_user',
    'panacea_investigation_user',
  ].includes(user?.role?.name || '');

  const isBankClient = !isPanaceaStaff;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAdmin,
        isDirector,
        isPanaceaStaff,
        isBankClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
