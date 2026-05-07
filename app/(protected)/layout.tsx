'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { NavBar } from '@/components/layout/NavBar';
import { api } from '@/lib/api';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { user, status } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const pathnameRef = useRef(pathname);

    useEffect(() => {
        pathnameRef.current = pathname;
    }, [pathname]);

    const [routeReady, setRouteReady] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        if (status !== 'authenticated') return;

        // Check plans once per session — pathname read via ref so this effect
        // doesn't re-run (and re-fetch) on every in-app navigation.
        api.get('/plans').then((res) => {
            const plans = res.data.data;
            const currentPath = pathnameRef.current;
            if (plans.length === 0 && currentPath !== '/onboarding') {
                router.replace('/onboarding');
            } else if (plans.length > 0 && currentPath === '/onboarding') {
                router.replace('/dashboard');
            }
            setRouteReady(true);
        });
    }, [status, router]);

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
