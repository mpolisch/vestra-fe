'use client';

import { useEffect, useRef, useState, startTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { NavBar } from '@/components/layout/NavBar';
import { api } from '@/lib/api';
import type { Plan } from '@/types';
import { ApiSuccess } from '@/types/api';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { user, status } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const hasFetchedRef = useRef(false);

    const [routeReady, setRouteReady] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        if (status !== 'authenticated') return;

        // After a redirect, pathname changes and this effect re-runs.
        // hasFetchedRef prevents a second API call — we already know the user
        // has a plan, so if they manually navigate back to /onboarding, redirect them.
        if (hasFetchedRef.current) {
            if (pathname === '/onboarding') {
                router.replace('/dashboard');
            } else {
                startTransition(() => setRouteReady(true));
            }
            return;
        }

        hasFetchedRef.current = true;
        api.get<ApiSuccess<Plan[]>>('/plans')
            .then((res) => {
                const plans = res.data.data;
                if (plans.length === 0 && pathname !== '/onboarding') {
                    router.replace('/onboarding');
                    // Don't set routeReady — keep the loader until the redirect lands
                } else if (plans.length > 0 && pathname === '/onboarding') {
                    router.replace('/dashboard');
                    // Don't set routeReady — keep the loader until the redirect lands
                } else {
                    setRouteReady(true);
                }
            })
            .catch(() => router.push('/login'));
    }, [status, router, pathname]);

    if (status === 'loading' || !routeReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <p className="font-mono text-sm text-text-muted">Loading...</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <>
            <NavBar />
            {children}
        </>
    );
}
