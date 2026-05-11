'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';
import type { Plan, ProjectionResponse } from '@/types';
import type { ApiSuccess } from '@/types/api';
import { ProjectionChart } from '@/components/plans/ProjectionChart';
import { ProjectionSummary } from '@/components/plans/ProjectionSummary';
import { ChatPanel } from '@/components/plans/ChatPanel';

export default function PlanPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [plan, setPlan] = useState<Plan | null>(null);
    const [projection, setProjection] = useState<ProjectionResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        Promise.all([
            api.get<ApiSuccess<Plan>>(`/plans/${id}`),
            api.get<ApiSuccess<ProjectionResponse>>(`/plans/${id}/projection`),
        ])
            .then(([planRes, projRes]) => {
                if (!cancelled) {
                    setPlan(planRes.data.data);
                    setProjection(projRes.data.data);
                    setLoading(false);
                }
            })
            .catch((err: unknown) => {
                if (!cancelled) {
                    setError(getErrorMessage(err));
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [id]);

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <p className="text-sm text-text-muted">Loading...</p>
            </div>
        );
    if (error || !plan || !projection)
        return (
            <div className="p-6 flex flex-col gap-6">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="text-sm text-text-muted hover:text-text-primary transition-colors cursor-pointer self-start"
                >
                    ← Back
                </button>
                <div className="flex flex-col gap-2 p-6 bg-surface rounded-lg border">
                    <p className="font-mono text-sm font-semibold text-text-primary">
                        {error ?? 'Something went wrong.'}
                    </p>
                    <p className="text-xs text-text-muted">
                        This plan could not be loaded. It may have been deleted or you may not have
                        access.
                    </p>
                </div>
            </div>
        );

    return (
        <div className="p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="text-sm text-text-muted hover:text-text-primary transition-colors cursor-pointer self-start"
                >
                    ← Back
                </button>
                <div className="flex items-baseline gap-3">
                    <h1 className="font-mono text-2xl font-bold text-text-primary">{plan.name}</h1>
                    <span className="text-xs text-text-muted">All amounts in CAD</span>
                </div>
            </div>

            <ProjectionSummary summary={projection.summary} />
            <ProjectionChart
                dataPoints={projection.data_points}
                retirementAge={plan.retirement_age}
                retirementGoal={plan.retirement_goal ? parseFloat(plan.retirement_goal) : null}
            />
            <ChatPanel planId={plan.id} />
        </div>
    );
}
