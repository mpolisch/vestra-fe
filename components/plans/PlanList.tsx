'use client';

import type { Plan } from '@/types';
import { PlanCard } from './PlanCard';

interface PlanListProps {
    plans: Plan[];
    onEdit: (plan: Plan) => void;
    onDeleted: (planId: string) => void;
}

export function PlanList({ plans, onEdit, onDeleted }: PlanListProps) {
    return (
        <div className="grid gap-4 items-stretch [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
            {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} onEdit={onEdit} onDeleted={onDeleted} />
            ))}
        </div>
    );
}
