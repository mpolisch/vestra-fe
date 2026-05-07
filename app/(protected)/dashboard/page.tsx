'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Plan } from '@/types';
import type { ApiSuccess } from '@/types/api';
import { PlanList } from '@/components/plans/PlanList';
import { PlanForm } from '@/components/plans/PlanForm';

export default function DashboardPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const fetchPlans = useCallback(async () => {
        try {
            const res = await api.get<ApiSuccess<Plan[]>>('/plans');
            setPlans(res.data.data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans]);

    const handleDeleted = (planId: string) => {
        setPlans((prev) => prev.filter((p) => p.id !== planId));
    };

    const handleCreated = (created: Plan) => {
        setPlans((prev) => [...prev, created]);
        setShowCreateForm(false);
    };

    const handleUpdated = (updated: Plan) => {
        setPlans((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setEditingPlan(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <p className="text-sm text-text-muted">Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-mono text-2xl font-bold text-text-primary">Your Plans</h1>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-4 py-2 text-sm rounded-md bg-accent text-white hover:bg-accent-hover transition-colors"
                >
                    + Add New Plan
                </button>
            </div>

            {plans.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                    <p className="text-text-secondary">You don&apos;t have any plans yet.</p>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="px-4 py-2 text-sm rounded-md bg-accent text-white hover:bg-accent-hover transition-colors"
                    >
                        Create Your First Plan
                    </button>
                </div>
            ) : (
                <PlanList plans={plans} onEdit={setEditingPlan} onDeleted={handleDeleted} />
            )}

            {editingPlan && (
                <PlanForm
                    plan={editingPlan}
                    onSuccess={handleUpdated}
                    onCancel={() => setEditingPlan(null)}
                />
            )}

            {showCreateForm && (
                <PlanForm
                    onSuccess={handleCreated}
                    onCancel={() => setShowCreateForm(false)}
                />
            )}
        </div>
    );
}
