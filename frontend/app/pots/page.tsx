'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Ellipsis, PiggyBank, Plus, Minus, Loader2 } from 'lucide-react';

interface Pot {
    id: number;
    name: string;
    target: number;
    total: number;
    theme: string;
}

export default function PotsPage() {
    const [pots, setPots] = useState<Pot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPots = async () => {
            try {
                const response = await axios.get('http://localhost/api/pots');
                setPots(response.data);
            } catch (error) {
                console.error('Error retrieving pots:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPots();
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-gray-500">
                    <Loader2 className="animate-spin" size={48} />
                    <p>Loading your pots...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 p-8 pb-20">
            {/* Header */}
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
                    const total = Number(pot.total);
                    const target = Number(pot.target);
                    const percentage = (total / target) * 100;

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
                                        {new Intl.NumberFormat('en-IE', {
                                            style: 'currency',
                                            currency: 'EUR',
                                        }).format(total)}
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
                                        Target of{' '}
                                        {new Intl.NumberFormat('en-IE', {
                                            style: 'currency',
                                            currency: 'EUR',
                                        }).format(target)}
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
