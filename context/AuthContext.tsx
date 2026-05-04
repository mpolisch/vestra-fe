'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import type { ApiSuccess } from '@/types/api';
import type { AuthUser } from '@/types';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
    user: AuthUser | null;
    status: AuthStatus;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [status, setStatus] = useState<AuthStatus>('loading');

    useEffect(() => {
        api.get<ApiSuccess<AuthUser>>('/auth/me')
            .then((res) => {
                setUser(res.data.data);
                setStatus('authenticated');
            })
            .catch(() => {
                setUser(null);
                setStatus('unauthenticated');
            });
    }, []);

    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            // Always clear local state and redirect, even if the server call fails
            setUser(null);
            setStatus('unauthenticated');
            router.push('/login');
        }
    }, [router]);

    return <AuthContext.Provider value={{ user, status, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
