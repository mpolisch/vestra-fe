import type { ProjectionDataPoint } from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ReferenceLine,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from 'recharts';

interface ProjectionChartProps {
    dataPoints: ProjectionDataPoint[];
    retirementAge: number;
}

const ACCOUNT_COLORS: Partial<Record<keyof ProjectionDataPoint, string>> = {
    tfsa_balance: '#5c8a6e',
    rrsp_balance: '#4a6e8a',
    fhsa_balance: '#8a7240',
    unregistered_balance: '#7a7a72',
};

const ACCOUNT_LABELS: Partial<Record<keyof ProjectionDataPoint, string>> = {
    tfsa_balance: 'TFSA',
    rrsp_balance: 'RRSP',
    fhsa_balance: 'FHSA',
    unregistered_balance: 'Unregistered',
};

function RetirementLabel({ viewBox }: { viewBox?: { x: number; y: number } }) {
    if (!viewBox) return null;
    return (
        <text
            x={viewBox.x - 6}
            y={viewBox.y + 16}
            textAnchor="end"
            fill="var(--color-text-secondary)"
            fontSize={11}
        >
            Retirement
        </text>
    );
}

function formatAxisValue(v: number): string {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`;
    return `$${v}`;
}

export function ProjectionChart({ dataPoints, retirementAge }: ProjectionChartProps) {
    return (
        <div className="p-4 bg-surface rounded-lg border overflow-hidden">
            <h2 className="font-mono text-sm font-semibold text-text-secondary mb-4">
                Balance Projection by Account
            </h2>
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dataPoints} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis
                            dataKey="age"
                            tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                            tickLine={false}
                            label={{
                                value: 'Age',
                                position: 'insideBottom',
                                offset: -2,
                                fontSize: 12,
                                fill: 'var(--color-text-muted)',
                            }}
                        />
                        <YAxis
                            tickFormatter={formatAxisValue}
                            tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                            tickLine={false}
                            axisLine={false}
                            width={68}
                        />
                        <Tooltip
                            formatter={(v, name) => [
                                formatCurrency(Number(v)),
                                ACCOUNT_LABELS[name as keyof ProjectionDataPoint] ?? name,
                            ]}
                            contentStyle={{
                                backgroundColor: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '8px',
                                fontSize: '12px',
                            }}
                            labelFormatter={(label) => `Age ${label}`}
                        />
                        <Legend
                            formatter={(value) =>
                                ACCOUNT_LABELS[value as keyof ProjectionDataPoint] ?? value
                            }
                            wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
                        />
                        <ReferenceLine
                            x={retirementAge}
                            stroke="var(--color-accent)"
                            strokeDasharray="4 4"
                            label={<RetirementLabel />}
                        />
                        <Area
                            dataKey="unregistered_balance"
                            stackId="1"
                            stroke={ACCOUNT_COLORS.unregistered_balance}
                            fill={ACCOUNT_COLORS.unregistered_balance}
                            fillOpacity={0.75}
                        />
                        <Area
                            dataKey="fhsa_balance"
                            stackId="1"
                            stroke={ACCOUNT_COLORS.fhsa_balance}
                            fill={ACCOUNT_COLORS.fhsa_balance}
                            fillOpacity={0.75}
                        />
                        <Area
                            dataKey="rrsp_balance"
                            stackId="1"
                            stroke={ACCOUNT_COLORS.rrsp_balance}
                            fill={ACCOUNT_COLORS.rrsp_balance}
                            fillOpacity={0.75}
                        />
                        <Area
                            dataKey="tfsa_balance"
                            stackId="1"
                            stroke={ACCOUNT_COLORS.tfsa_balance}
                            fill={ACCOUNT_COLORS.tfsa_balance}
                            fillOpacity={0.75}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
