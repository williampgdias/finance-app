'use client';

import { Ellipsis, PiggyBank, Plus, Minus } from 'lucide-react';

export default function PotsPage() {
    const pots = [
        {
            name: 'Savings',
            target: 2000.0,
            total: 159.0,
            theme: '#277C78',
        },
        {
            name: 'Concert Ticket',
            target: 150.0,
            total: 62.0,
            theme: '#626070',
        },
        {
            name: 'Gift',
            target: 60.0,
            total: 40.0,
            theme: '#82C9D7',
        },
        {
            name: 'New Laptop',
            target: 1000.0,
            total: 10.0,
            theme: '#F2CDAC',
        },
        {
            name: 'Holiday',
            target: 1500.0,
            total: 540.0,
            theme: '#C94736',
        },
    ];

    return (
        <main className="min-h-screen bg-gray-50 p-8 pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Pots</h1>
                <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors flex items-center gap-2">
                    <Plus size={16} />
                    Add New Pot
                </button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {pots.map((pot) => {
                    const percentage = (pot.total / pot.target) * 100;

                    return (
                        <div
                            key={pot.name}
                            className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between h-full"
                        >
                            {/* Card top */}
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: pot.theme }}
                                    ></div>
                                    <h2 className="font-bold text-gray-900 text-lg">
                                        {pot.name}
                                    </h2>
                                </div>
                                <button className="text-gray-400 hover:text-gray-900">
                                    <Ellipsis size={20} />
                                </button>
                            </div>

                            {/* Main info */}
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">
                                        Total Saved
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        €{pot.total.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            {/* Progress bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-gray-500 mb-2">
                                    <span className="font-bold text-gray-900">
                                        {percentage.toFixed(1)}%
                                    </span>
                                    <span>
                                        Target of €{pot.target.toFixed(2)}
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500 ease-out"
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: pot.theme,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
                                <button className="flex-1 bg-beige-100 py-3 rounded-lg text-sm font-bold text-gray-900 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                    <Plus size={16} />
                                    Add Money
                                </button>
                                <button className="flex-1 bg-white border border-gray-200 py-3 rounded-lg text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                    <Minus size={16} />
                                    Withdraw
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}
