'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import type { Plan } from '@/types';
import { DeletePlanModal } from './DeletePlanModal';

interface PlanCardProps {
    plan: Plan;
    onEdit: (plan: Plan) => void;
    onDeleted: (planId: string) => void;
}

export function PlanCard({ plan, onEdit, onDeleted }: PlanCardProps) {
    const router = useRouter();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleDelete = async () => {
        setIsDeleting(true);
        setDeleteError(null);
        try {
            await api.delete(`/plans/${plan.id}`);
            onDeleted(plan.id);
        } catch {
            setDeleteError('Failed to delete plan. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteError(null);
    };

    return (
        <>
            <div className="flex flex-col gap-4 p-5 bg-surface rounded-lg border h-full">
                <div className="flex items-start justify-between gap-4">
                    <h3 className="font-mono font-semibold text-text-primary">{plan.name}</h3>
                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={() => onEdit(plan)}
                            className="cursor-pointer text-xs px-3 py-1.5 rounded-md border border-border text-text-secondary hover:text-text-primary hover:bg-background transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="cursor-pointer text-xs px-3 py-1.5 rounded-md border border-error/40 text-error hover:bg-error/5 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-text-muted">Current Age</span>
                        <span className="text-sm font-medium text-text-primary">
                            {plan.current_age}
                        </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-text-muted">Retirement Age</span>
                        <span className="text-sm font-medium text-text-primary">
                            {plan.retirement_age}
                        </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-text-muted">Monthly Contributions</span>
                        <span className="text-sm font-medium text-text-primary">
                            {formatCurrency(parseFloat(plan.monthly_contributions))}
                        </span>
                    </div>
                </div>
                <div className="mt-auto">
                    <button
                        onClick={() => router.push(`/plans/${plan.id}`)}
                        className="cursor-pointer w-full py-2 text-sm rounded-md bg-accent text-white hover:bg-accent-hover transition-colors"
                    >
                        View Projection
                    </button>
                </div>
            </div>

            {showDeleteModal && (
                <DeletePlanModal
                    planName={plan.name}
                    isDeleting={isDeleting}
                    error={deleteError}
                    onConfirm={handleDelete}
                    onCancel={handleCloseDeleteModal}
                />
            )}
        </>
    );
}
