'use client';

import { Transaction } from '@/types/Transaction';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface BudgetsChartProps {
    transactions: Transaction[];
}

export default function BudgetsChart({ transactions }: BudgetsChartProps) {
    // Filter on the expenses
    const expenses = transactions.filter((t) => !t.is_income);

    // Group by category and sum the values.
    const dataMap = expenses.reduce((acc, t) => {
        const category = t.category || 'General';
        const amount = Number(t.amount);

        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += amount;
        return acc;
    }, {} as Record<string, number>);

    // Convert to a format that ReCharts understands.
    const data = Object.keys(dataMap).map((category) => ({
        name: category,
        value: dataMap[category],
    }));

    // Colors for the chart
    const COLORS = ['#277C78', '#626070', '#82C9D7', '#F2CDAC', '#C94736'];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm h-80 flex flex-col border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Budgets</h2>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    strokeWidth={0}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1',
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="flex gap-4 justify-center mt-4 text-xs text-gray-500">
                {data.slice(0, 3).map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1">
                        <div
                            className="w-2 h-2 rounded-full"
                            style={{
                                backgroundColor: COLORS[index % COLORS.length],
                            }}
                        />
                        <span>{entry.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
