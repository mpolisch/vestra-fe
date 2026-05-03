'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { api } from '@/lib/api';
import { loginSchema, type LoginDTO } from '@/lib/schemas';
import type { BackendError } from '@/types/api';

const inputClassName =
    'w-full px-3 py-2 rounded-md border border-border bg-background text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent';

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');
    const rawRedirect = searchParams.get('redirect');
    // Guard against open redirect: only allow relative paths
    const redirect =
        rawRedirect && rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')
            ? rawRedirect
            : '/dashboard';

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<LoginDTO>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginDTO) => {
        try {
            await api.post('/auth/login', data);
            router.push(redirect);
        } catch (err) {
            if (axios.isAxiosError<BackendError>(err)) {
                const message = err.response?.data?.message || 'A network error occurred';
                setError('root', { message });
            } else {
                setError('root', { message: 'An unexpected error occurred' });
            }
        }
    };

    return (
        <div className="w-full max-w-md p-8 bg-surface rounded-lg border">
            <div className="mb-8 text-center">
                <h2 className="font-mono text-2xl font-bold text-text-primary">Welcome back</h2>
                <p className="text-sm text-text-secondary mt-2">Sign in to your account</p>
            </div>

            {registered && (
                <p className="mb-4 text-sm text-center text-success bg-background rounded-md px-4 py-2 border">
                    Account created — please sign in.
                </p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-sm font-medium text-text-primary">
                        Email
                    </label>
                    <input
                        {...register('email')}
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="name@example.com"
                        className={inputClassName}
                    />
                    {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="password" className="text-sm font-medium text-text-primary">
                        Password
                    </label>
                    <input
                        {...register('password')}
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="Your password"
                        className={inputClassName}
                    />
                    {errors.password && (
                        <p className="text-xs text-error">{errors.password.message}</p>
                    )}
                </div>

                {errors.root && (
                    <p className="text-sm text-error text-center">{errors.root.message}</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-1 w-full py-2.5 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-text-secondary">
                Don&apos;t have an account?{' '}
                <Link
                    href="/register"
                    className="font-medium text-text-primary underline underline-offset-4"
                >
                    Get started
                </Link>
            </p>
        </div>
    );
}
