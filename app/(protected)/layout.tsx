'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { NavBar } from '@/components/layout/NavBar';
import { api } from '@/lib/api';
import type { Plan } from '@/types';
import type { ApiSuccess } from '@/types/api';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { user, status } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [readyForPath, setReadyForPath] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        if (status !== 'authenticated') return;

        api.get<ApiSuccess<Plan[]>>('/plans')
            .then((res) => {
                const plans = res.data.data;
                if (plans.length === 0 && pathname !== '/onboarding') {
                    router.replace('/onboarding');
                } else if (plans.length > 0 && pathname === '/onboarding') {
                    router.replace('/dashboard');
                } else {
                    setReadyForPath(pathname);
                }
            })
            .catch(() => router.push('/login'));
    }, [status, pathname, router]);

    // readyForPath tracks which path was last verified: if pathname has changed
    // since the last check, we show the loader until the new check completes.
    const ready = readyForPath === pathname;

    if (status === 'loading' || !ready) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <p className="font-mono text-sm text-text-muted">Loading...</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <NavBar />
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
