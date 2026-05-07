'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import {
    createPlanSchema,
    updatePlanSchema,
    type CreatePlanDTO,
    type CreatePlanInput,
} from '@/lib/schemas';
import { getErrorMessage } from '@/lib/errors';
import { inputClassName } from '@/lib/styles';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import type { Plan } from '@/types';
import type { ApiSuccess } from '@/types/api';

interface PlanFormProps {
    plan?: Plan;
    onSuccess: (result: Plan) => void;
    onCancel: () => void;
}

export function PlanForm({ plan, onSuccess, onCancel }: PlanFormProps) {
    const isEdit = plan !== undefined;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<CreatePlanInput, unknown, CreatePlanDTO>({
        // updatePlanSchema is .partial() — its resolver output type has all fields optional,
        // which genuinely mismatches CreatePlanDTO. The form is always fully pre-filled in
        // edit mode so validation is equivalent at runtime; cast is safe.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(isEdit ? updatePlanSchema : createPlanSchema) as any,
        defaultValues: isEdit
            ? {
                  name: plan.name,
                  current_age: plan.current_age,
                  retirement_age: plan.retirement_age,
                  annual_income: parseFloat(plan.annual_income),
                  current_savings: parseFloat(plan.current_savings),
                  monthly_contributions: parseFloat(plan.monthly_contributions),
                  risk_tolerance: plan.risk_tolerance,
                  retirement_goal: plan.retirement_goal
                      ? parseFloat(plan.retirement_goal)
                      : undefined,
                  tfsa_balance: parseFloat(plan.tfsa_balance),
                  rrsp_balance: parseFloat(plan.rrsp_balance),
                  fhsa_balance: parseFloat(plan.fhsa_balance),
                  contribution_priority: plan.contribution_priority,
              }
            : {
                  contribution_priority: 'tfsa_first',
                  risk_tolerance: 'conservative',
                  tfsa_balance: 0,
                  rrsp_balance: 0,
                  fhsa_balance: 0,
              },
    });

    const onSubmit = async (data: CreatePlanDTO) => {
        try {
            if (isEdit) {
                const res = await api.put<ApiSuccess<Plan>>(`/plans/${plan.id}`, data);
                onSuccess(res.data.data);
            } else {
                const res = await api.post<ApiSuccess<Plan>>('/plans', data);
                onSuccess(res.data.data);
            }
        } catch (err: unknown) {
            setError('root', { message: getErrorMessage(err) });
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onCancel}
        >
            <div
                className="w-full max-w-xl bg-surface rounded-lg border shadow-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-surface border-b px-6 py-4 flex items-center justify-between">
                    <h2 className="font-mono text-lg font-bold text-text-primary">
                        {isEdit ? 'Edit Plan' : 'New Plan'}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="cursor-pointer text-text-muted hover:text-text-primary transition-colors"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="flex flex-col gap-6 p-6"
                >
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
                            {errors.name && (
                                <p className="text-xs text-error">{errors.name.message}</p>
                            )}
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
                                    className={inputClassName}
                                />
                                {errors.current_age && (
                                    <p className="text-xs text-error">
                                        {errors.current_age.message}
                                    </p>
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

                    {/* Finances */}
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
                                registration={register('current_savings')}
                            />
                            {errors.current_savings && (
                                <p className="text-xs text-error">
                                    {errors.current_savings.message}
                                </p>
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
                                registration={register('retirement_goal')}
                            />
                            {errors.retirement_goal && (
                                <p className="text-xs text-error">
                                    {errors.retirement_goal.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Accounts */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-mono text-sm font-semibold text-text-primary uppercase tracking-wide">
                            Your Accounts
                        </h3>
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
                                    <p className="text-xs text-error">
                                        {errors.tfsa_balance.message}
                                    </p>
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
                                    <p className="text-xs text-error">
                                        {errors.rrsp_balance.message}
                                    </p>
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
                                    <p className="text-xs text-error">
                                        {errors.fhsa_balance.message}
                                    </p>
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
                                <p className="text-xs text-error">
                                    {errors.risk_tolerance.message}
                                </p>
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

                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="cursor-pointer px-4 py-2 text-sm rounded-md border border-border text-text-primary hover:bg-background transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="cursor-pointer px-4 py-2 text-sm rounded-md bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Plan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
