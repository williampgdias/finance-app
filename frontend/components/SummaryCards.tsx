'use client';

import { Transaction } from '@/types/Transaction';

interface SummaryCardsProps {
    transactions: Transaction[];
}

export default function SummaryCards({ transactions }: SummaryCardsProps) {
    // Calculate Total Income
    const income = transactions
        .filter((t) => t.is_income)
        .reduce((acc, t) => acc + Number(t.amount), 0);

    // Calculate Total Expenses
    const expenses = transactions
        .filter((t) => !t.is_income)
        .reduce((acc, t) => acc + Number(t.amount), 0);

    // Calculate Current Balance (Income - Expenses)
    const balance = income - expenses;

    // Helper function to formate currency (€)
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2,
        }).format(value);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Card 1: Current Balance (Dark Theme) */}
            <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between h-40">
                <h3 className="text-gray-300 text-sm font-medium">
                    Current Balance
                </h3>
                <p className="text-4xl font-bold tracking-tight">
                    {formatCurrency(balance)}
                </p>
            </div>

            {/* Card 2: Income (Light Theme) */}
            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between h-40">
                <h3 className="text-gray-500 text-sm font-medium">Income</h3>
                <p className="text-3xl font-bold text-gray-900 tracking-tight">
                    {formatCurrency(income)}
                </p>
            </div>

            {/* Card 3: Expenses (Light Theme) */}
            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between h-40">
                <h3 className="text-gray-500 text-sm font-medium">Expenses</h3>
                <p className="text-3xl font-bold text-gray-900 tracking-tight">
                    {formatCurrency(expenses)}
                </p>
            </div>
        </div>
    );
}
