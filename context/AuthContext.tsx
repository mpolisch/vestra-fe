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
    refreshUser: () => Promise<void>;
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

    const refreshUser = useCallback(async () => {
        setStatus('loading');
        try {
            const res = await api.get<ApiSuccess<AuthUser>>('/auth/me');
            setUser(res.data.data);
            setStatus('authenticated');
        } catch {
            setUser(null);
            setStatus('unauthenticated');
        }
    }, []);

    // Re-validate on bfcache restore. When the browser restores from back/forward
    // cache, any in-flight requests are frozen and never resolve, which can leave
    // the layout stuck in a loading state. Re-fetching auth flips `status` back
    // to 'loading' and then 'authenticated', which retriggers the layout's effect
    // (status is in its deps) and cleanly re-fetches plans.
    useEffect(() => {
        const onPageShow = (e: PageTransitionEvent) => {
            if (e.persisted) {
                refreshUser();
            }
        };
        window.addEventListener('pageshow', onPageShow);
        return () => window.removeEventListener('pageshow', onPageShow);
    }, [refreshUser]);

    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            setUser(null);
            setStatus('unauthenticated');
            router.push('/login');
        }
    }, [router]);

    return (
        <AuthContext.Provider value={{ user, status, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
