'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { NavBar } from '@/components/layout/NavBar';
import { api } from '@/lib/api';
import type { Plan } from '@/types';
import type { ApiSuccess } from '@/types/api';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { status } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [readyForPath, setReadyForPath] = useState<string | null>(null);

    const ready = readyForPath === pathname;

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        if (status !== 'authenticated') {
            return;
        }
        let cancelled = false;
        api.get<ApiSuccess<Plan[]>>('/plans')
            .then((res) => {
                if (cancelled) return;
                const plans = res.data.data;
                if (plans.length === 0 && pathname !== '/onboarding') {
                    router.replace('/onboarding');
                } else if (plans.length > 0 && pathname === '/onboarding') {
                    router.replace('/dashboard');
                } else {
                    setReadyForPath(pathname);
                }
            })
            .catch(() => {
                if (!cancelled) router.push('/login');
            });

        return () => {
            cancelled = true;
        };
        // router is intentionally excluded: its reference changes during Next.js
        // router initialization, which would fire navigations before the router is ready.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, pathname]);

    if (status !== 'authenticated' || !ready) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <p className="font-mono text-sm text-text-muted">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <NavBar />
            <main className="flex-1">{children}</main>
        </div>
    );
}
