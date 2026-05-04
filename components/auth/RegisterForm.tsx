'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { registerSchema, type RegisterDTO } from '@/lib/schemas';
import { getErrorMessage } from '@/lib/errors';

const inputClassName =
    'w-full px-3 py-2 rounded-md border border-border bg-background text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent';

export function RegisterForm() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<RegisterDTO>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterDTO) => {
        try {
            await api.post('/auth/register', { email: data.email, password: data.password });
            router.push('/login?registered=true');
        } catch (err: unknown) {
            setError('root', {
                message: getErrorMessage(err),
            });
        }
    };

    return (
        <div className="w-full max-w-md p-8 bg-surface rounded-lg border">
            <div className="mb-8 text-center">
                <h2 className="font-mono text-2xl font-bold text-text-primary">Create Account</h2>
                <p className="text-sm text-text-secondary mt-2">
                    Start planning your retirement today.
                </p>
            </div>

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
                        autoComplete="new-password"
                        placeholder="Min. 8 characters"
                        className={inputClassName}
                    />
                    {errors.password && (
                        <p className="text-xs text-error">{errors.password.message}</p>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium text-text-primary"
                    >
                        Confirm Password
                    </label>
                    <input
                        {...register('confirmPassword')}
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Re-enter your password"
                        className={inputClassName}
                    />
                    {errors.confirmPassword && (
                        <p className="text-xs text-error">{errors.confirmPassword.message}</p>
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
                    {isSubmitting ? 'Creating account...' : 'Get Started'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-text-secondary">
                Already have an account?{' '}
                <Link
                    href="/login"
                    className="font-medium text-text-primary underline underline-offset-4"
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
}
