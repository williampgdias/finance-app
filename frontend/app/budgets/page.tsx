'use client';

import { Ellipsis } from 'lucide-react';

export default function BudgetsPage() {
    const budgets = [
        {
            category: 'Entertainment',
            maximum: 50.0,
            current: 15.0,
            theme: '#277c78',
        },
        {
            category: 'Bills',
            maximum: 750.0,
            current: 150.0,
            theme: '#82c9d7',
        },
        {
            category: 'Dining Out',
            maximum: 75.0,
            current: 75.0,
            theme: '#F2CDAC',
        },
        {
            category: 'Personal Care',
            maximum: 100.0,
            current: 45.0,
            theme: '#626070',
        },
    ];

    return (
        <main className="min-h-screen bg-gray-50 p-8 pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
                <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">
                    + Add New Budget
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Left side */}
                <div className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center justify-center text-center h-full min-h-72">
                    <div className="w-64 h-64 border-32 border-transparent border-t-green-700 rounded-full rotate-45">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-gray-900">
                                €385
                            </p>
                            <p className="text-sm text-gray-500">
                                of €975 limit
                            </p>
                        </div>
                    </div>
                    <h2 className="text-xl font-bold mt-8">Spending Summary</h2>
                </div>

                {/* Right Side */}
                <div className="flex flex-col gap-6">
                    {budgets.map((budget) => {
                        // Calculates the percentage spent
                        const percentage =
                            (budget.current / budget.maximum) * 100;

                        return (
                            <div
                                key={budget.category}
                                className="bg-white p-6 rounded-xl shadow-sm relative"
                            >
                                {/* Card's Header */}
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

                                {/* Info de Valores */}
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500 mb-1">
                                        Maximum of €{budget.maximum.toFixed(2)}
                                    </p>

                                    {/* Barra de Progresso Customizada */}
                                    <div className="w-full h-8 bg-beige-100 rounded-lg p-1">
                                        <div
                                            className="h-full rounded-md transition-all duration-500 ease-out"
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: budget.theme,
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Resumo Financeiro do Item */}
                                <div className="flex justify-between items-center">
                                    <div
                                        className="w-1/2 border-l-4 pl-4"
                                        style={{ borderColor: budget.theme }}
                                    >
                                        <p className="text-xs text-gray-500">
                                            Spent
                                        </p>
                                        <p className="font-bold text-gray-900">
                                            €{budget.current.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="w-1/2 border-l-4 pl-4 border-gray-200">
                                        <p className="text-xs text-gray-500">
                                            Remaining
                                        </p>
                                        <p className="font-bold text-gray-900">
                                            €
                                            {(
                                                budget.maximum - budget.current
                                            ).toFixed(2)}
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
