'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Ellipsis, Loader2, Plus } from 'lucide-react';

interface Budget {
    id: number;
    category: string;
    maximum: number;
    current: number;
    theme: string;
}

export default function BudgetsPage() {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);

    // State for the Summary Chart
    const [summary, setSummary] = useState({
        totalLimit: 0,
        totalSpent: 0,
    });

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const response = await axios.get(
                    'http://localhost/api/budgets'
                );
                const data: Budget[] = response.data;

                setBudgets(data);

                // Calculate Totals for the Summary Pie Chart
                const totalLimit = data.reduce(
                    (acc, curr) => acc + Number(curr.maximum),
                    0
                );
                const totalSpent = data.reduce(
                    (acc, curr) => acc + Number(curr.current),
                    0
                );

                setSummary({ totalLimit, totalSpent });
            } catch (error) {
                console.error('Error fetching budgets:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBudgets();
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-500" size={48} />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 p-8 pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
                <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors flex items-center gap-2">
                    <Plus size={16} />+ Add New Budget
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Left side: Summary Chart */}
                <div className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center justify-center text-center h-full min-h-72">
                    <div className="w-64 h-64 rounded-full border-32 border-gray-100 flex items-center justify-center relative">
                        <div className="absolute inset-0 border-32 border-transparent border-t-gray-900 rounded-full rotate-45 opacity-20"></div>

                        <div className="text-center z-10">
                            <p className="text-4xl font-bold text-gray-900">
                                {new Intl.NumberFormat('en-IE', {
                                    style: 'currency',
                                    currency: 'EUR',
                                    maximumFractionDigits: 0,
                                }).format(summary.totalSpent)}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                of{' '}
                                {new Intl.NumberFormat('en-IE', {
                                    style: 'currency',
                                    currency: 'EUR',
                                    maximumFractionDigits: 0,
                                }).format(summary.totalLimit)}{' '}
                                limit
                            </p>
                        </div>
                    </div>
                    <h2 className="text-xl font-bold mt-8">Spending Summary</h2>
                </div>

                {/* Right Side: Budget List */}
                <div className="flex flex-col gap-6">
                    {budgets.map((budget) => {
                        const maximum = Number(budget.maximum);
                        const current = Number(budget.current);
                        const percentage = (current / maximum) * 100;

                        return (
                            <div
                                key={budget.id}
                                className="bg-white p-6 rounded-xl shadow-sm relative"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-4 h-4 rounded-full`}
                                            style={{
                                                backgroundColor: budget.theme,
                                            }}
                                        ></div>
                                        <h3 className="font-bold text-gray-900 text-lg">
                                            {budget.category}
                                        </h3>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-900">
                                        <Ellipsis size={20} />
                                    </button>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 mb-1">
                                        Maximum of{' '}
                                        {new Intl.NumberFormat('en-IE', {
                                            style: 'currency',
                                            currency: 'EUR',
                                        }).format(maximum)}
                                    </p>

                                    <div
                                        className="w-full h-8 bg-beige-100 rounded-lg p-1 bg-opacity-50"
                                        style={{ backgroundColor: '#F8F4F0' }}
                                    >
                                        <div
                                            className="h-full rounded-md transition-all duration-500 ease-out"
                                            style={{
                                                width: `${Math.min(
                                                    percentage,
                                                    100
                                                )}%`,
                                                backgroundColor: budget.theme,
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div
                                        className="w-1/2 border-l-4 pl-4"
                                        style={{ borderColor: budget.theme }}
                                    >
                                        <p className="text-xs text-gray-500">
                                            Spent
                                        </p>
                                        <p className="font-bold text-gray-900">
                                            {new Intl.NumberFormat('en-IE', {
                                                style: 'currency',
                                                currency: 'EUR',
                                            }).format(current)}
                                        </p>
                                    </div>
                                    <div className="w-1/2 border-l-4 pl-4 border-gray-200">
                                        <p className="text-xs text-gray-500">
                                            Remaining
                                        </p>
                                        <p className="font-bold text-gray-900">
                                            {new Intl.NumberFormat('en-IE', {
                                                style: 'currency',
                                                currency: 'EUR',
                                            }).format(maximum - current)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
