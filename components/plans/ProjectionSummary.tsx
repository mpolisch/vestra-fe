import type { ProjectionSummary } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface StatCardProps {
    label: string;
    value: string;
    valueClass?: string;
}

function StatCard({ label, value, valueClass = 'text-text-primary' }: StatCardProps) {
    return (
        <div className="flex flex-col gap-1 p-4 bg-surface rounded-lg border min-w-[160px] flex-1">
            <span className="text-xs text-text-muted">{label}</span>
            <span className={`font-mono text-lg font-bold ${valueClass}`}>{value}</span>
        </div>
    );
}

interface ProjectionSummaryProps {
    summary: ProjectionSummary;
}

export function ProjectionSummary({ summary }: ProjectionSummaryProps) {
    return (
        <div className="flex flex-wrap gap-4">
            <StatCard
                label="Projected at Retirement"
                value={formatCurrency(summary.projected_balance_at_retirement)}
            />
            <StatCard
                label="Years Until Retirement"
                value={String(summary.years_until_retirement)}
            />
            {summary.will_meet_goal !== null && (
                <StatCard
                    label="Goal Status"
                    value={summary.will_meet_goal ? 'On Track' : 'Off Track'}
                    valueClass={summary.will_meet_goal ? 'text-success' : 'text-error'}
                />
            )}
            {summary.shortfall !== null && summary.shortfall > 0 && (
                <StatCard
                    label="Shortfall"
                    value={formatCurrency(summary.shortfall)}
                    valueClass="text-error"
                />
            )}
        </div>
    );
}
