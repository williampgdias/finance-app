'use client';

import { PiggyBank } from 'lucide-react';
import Link from 'next/link';

export default function PotsWidget() {
    const pots = [
        { name: 'Savings', amount: 159.9, color: '#277C78' },
        { name: 'Concert Ticket', amount: 62.0, color: '#626070' },
        { name: 'Gift', amount: 40.0, color: '#82C9D7' },
        { name: 'New Laptop', amount: 10.0, color: '#F2CDAC' },
    ];

    const totalSaved = pots.reduce((acc, pot) => acc + pot.amount, 0);

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Pots</h2>
                <Link
                    href="/pots"
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
                >
                    See Details
                </Link>
            </div>

            <div className="flex f;ex=col md:flex-row gap-6 items-center">
                {/* Left Side */}
                <div className="bg-beige-100 p-4 rounded-xl flex items-center gap-4 w-full md:w-5/12">
                    <div className="bg-gray-900 text-white p-3 rounded-full">
                        <PiggyBank size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Saved</p>
                        <p className="text-2xl font-bold text-gray-900">
                            €{totalSaved.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Right Side */}
                <div className="w-full md:w-7/12 grid grid-cols-2 gap-4">
                    {pots.map((pot) => (
                        <div
                            key={pot.name}
                            className="flex flex-col gap-1 border-l-4 pl-4"
                            style={{ borderColor: pot.color }}
                        >
                            <span className="text-xs text-gray-500">
                                {pot.name}
                            </span>
                            <span className="font-bold text-gray-900 text-sm">
                                €{pot.amount.toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
