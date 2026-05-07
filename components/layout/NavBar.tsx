'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export function NavBar() {
    const { logout } = useAuth();

    return (
        <header className="w-full border-b border-border/50 bg-surface">
            <div className="mx-auto px-10 h-12 flex items-center justify-between">
                <Link
                    href="/dashboard"
                    className="font-mono text-sm font-bold text-text-primary hover:text-text-secondary transition-colors"
                >
                    Vestra
                </Link>

                <button
                    onClick={logout}
                    className="text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                >
                    Sign out
                </button>
            </div>
        </header>
    );
}
