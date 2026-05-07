'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { createPlanSchema, type CreatePlanDTO, type CreatePlanInput } from '@/lib/schemas';
import { getErrorMessage } from '@/lib/errors';
import { inputClassName } from '@/lib/styles';
import { CurrencyInput } from '@/components/ui/CurrencyInput';

export function OnboardingForm() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<CreatePlanInput, unknown, CreatePlanDTO>({
        resolver: zodResolver(createPlanSchema),
        defaultValues: {
            contribution_priority: 'tfsa_first',
            risk_tolerance: 'conservative',
            tfsa_balance: 0,
            rrsp_balance: 0,
            fhsa_balance: 0,
        },
    });

    const onSubmit = async (data: CreatePlanDTO) => {
        try {
            await api.post('/plans', data);
            router.push('/dashboard');
        } catch (err: unknown) {
            setError('root', {
                message: getErrorMessage(err),
            });
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto px-6 py-12">
            <div className="mb-8">
                <h2 className="font-mono text-2xl font-bold text-text-primary">Set up your plan</h2>
                <p className="text-sm text-text-secondary mt-2">
                    Tell us about yourself so we can build your retirement projection.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
                {/* About You */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="name" className="text-sm font-medium text-text-primary">
                            Plan Name{' '}
                            <span className="text-text-muted font-normal">(optional)</span>
                        </label>
                        <input
                            {...register('name')}
                            id="name"
                            type="text"
                            placeholder="My Retirement Plan"
                            className={inputClassName}
                        />
                        {errors.name && <p className="text-xs text-error">{errors.name.message}</p>}
                    </div>
                    <h3 className="font-mono text-sm font-semibold text-text-primary uppercase tracking-wide">
                        About You
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="current_age"
                                className="text-sm font-medium text-text-primary"
                            >
                                Current Age
                            </label>
                            <input
                                {...register('current_age')}
                                id="current_age"
                                type="number"
                                placeholder="23"
                                className={inputClassName}
                            />
                            {errors.current_age && (
                                <p className="text-xs text-error">{errors.current_age.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="retirement_age"
                                className="text-sm font-medium text-text-primary"
                            >
                                Retirement Age
                            </label>
                            <input
                                {...register('retirement_age')}
                                id="retirement_age"
                                type="number"
                                placeholder="65"
                                className={inputClassName}
                            />
                            {errors.retirement_age && (
                                <p className="text-xs text-error">
                                    {errors.retirement_age.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Your Finances */}
                <div className="flex flex-col gap-4">
                    <h3 className="font-mono text-sm font-semibold text-text-primary uppercase tracking-wide">
                        Your Finances
                    </h3>

                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="annual_income"
                            className="text-sm font-medium text-text-primary"
                        >
                            Annual Income (after tax)
                        </label>
                        <CurrencyInput
                            id="annual_income"
                            placeholder="65000"
                            registration={register('annual_income')}
                        />
                        {errors.annual_income && (
                            <p className="text-xs text-error">{errors.annual_income.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="current_savings"
                            className="text-sm font-medium text-text-primary"
                        >
                            Total Current Savings
                        </label>
                        <p className="text-xs text-text-muted">
                            Include all accounts — TFSA, RRSP, FHSA, and general savings
                        </p>
                        <CurrencyInput
                            id="current_savings"
                            placeholder="15000"
                            registration={register('current_savings')}
                        />
                        {errors.current_savings && (
                            <p className="text-xs text-error">{errors.current_savings.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="monthly_contributions"
                            className="text-sm font-medium text-text-primary"
                        >
                            Monthly Contributions
                        </label>
                        <CurrencyInput
                            id="monthly_contributions"
                            placeholder="500"
                            registration={register('monthly_contributions')}
                        />
                        {errors.monthly_contributions && (
                            <p className="text-xs text-error">
                                {errors.monthly_contributions.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="retirement_goal"
                            className="text-sm font-medium text-text-primary"
                        >
                            Retirement Goal{' '}
                            <span className="text-text-muted font-normal">(optional)</span>
                        </label>
                        <CurrencyInput
                            id="retirement_goal"
                            placeholder="1000000"
                            registration={register('retirement_goal')}
                        />
                        {errors.retirement_goal && (
                            <p className="text-xs text-error">{errors.retirement_goal.message}</p>
                        )}
                    </div>
                </div>

                {/* Your Accounts */}
                <div className="flex flex-col gap-4">
                    <h3 className="font-mono text-sm font-semibold text-text-primary uppercase tracking-wide">
                        Your Accounts
                    </h3>
                    <p className="text-xs text-text-muted -mt-2">
                        Enter your current balance in each registered account. Leave at 0 if you
                        don&apos;t have one.
                    </p>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="tfsa_balance"
                                className="text-sm font-medium text-text-primary"
                            >
                                TFSA
                            </label>
                            <CurrencyInput
                                id="tfsa_balance"
                                placeholder="0"
                                registration={register('tfsa_balance')}
                            />
                            {errors.tfsa_balance && (
                                <p className="text-xs text-error">{errors.tfsa_balance.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="rrsp_balance"
                                className="text-sm font-medium text-text-primary"
                            >
                                RRSP
                            </label>
                            <CurrencyInput
                                id="rrsp_balance"
                                placeholder="0"
                                registration={register('rrsp_balance')}
                            />
                            {errors.rrsp_balance && (
                                <p className="text-xs text-error">{errors.rrsp_balance.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label
                                htmlFor="fhsa_balance"
                                className="text-sm font-medium text-text-primary"
                            >
                                FHSA
                            </label>
                            <CurrencyInput
                                id="fhsa_balance"
                                placeholder="0"
                                registration={register('fhsa_balance')}
                            />
                            {errors.fhsa_balance && (
                                <p className="text-xs text-error">{errors.fhsa_balance.message}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Preferences */}
                <div className="flex flex-col gap-4">
                    <h3 className="font-mono text-sm font-semibold text-text-primary uppercase tracking-wide">
                        Preferences
                    </h3>

                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="risk_tolerance"
                            className="text-sm font-medium text-text-primary"
                        >
                            Risk Tolerance
                        </label>
                        <select
                            {...register('risk_tolerance')}
                            id="risk_tolerance"
                            className={inputClassName}
                        >
                            <option value="conservative">Conservative (4% growth)</option>
                            <option value="moderate">Moderate (6% growth)</option>
                            <option value="aggressive">Aggressive (8% growth)</option>
                        </select>
                        {errors.risk_tolerance && (
                            <p className="text-xs text-error">{errors.risk_tolerance.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="contribution_priority"
                            className="text-sm font-medium text-text-primary"
                        >
                            Contribution Priority
                        </label>
                        <select
                            {...register('contribution_priority')}
                            id="contribution_priority"
                            className={inputClassName}
                        >
                            <option value="tfsa_first">TFSA First</option>
                            <option value="balanced">Balanced (50/30/20)</option>
                            <option value="rrsp_heavy">RRSP Heavy (70/30)</option>
                        </select>
                        {errors.contribution_priority && (
                            <p className="text-xs text-error">
                                {errors.contribution_priority.message}
                            </p>
                        )}
                    </div>
                </div>

                {errors.root && (
                    <p className="text-sm text-error text-center">{errors.root.message}</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Building your plan...' : 'Build My Plan'}
                </button>
            </form>
        </div>
    );
}
