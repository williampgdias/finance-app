'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { PiggyBank, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Pot {
    id: number;
    name: string;
    total: number;
    theme: string;
}

export default function PotsWidget() {
    const [pots, setPots] = useState<Pot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPots = async () => {
            try {
                const response = await axios.get('http://localhost/api/pots');
                // We only took the first 4 to fit in the square.
                setPots(response.data.slice(0, 4));
            } catch (error) {
                console.error('Error fetching pots:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPots();
    }, []);

    const totalSaved = pots.reduce((acc, pot) => acc + Number(pot.total), 0);

    if (loading) {
        return (
            <div className="bg-white p-8 rounded-xl shadow-sm h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-400" />
            </div>
        );
    }

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

            <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Left Side */}
                <div className="bg-beige-100 p-4 rounded-xl flex items-center gap-4 w-full md:w-5/12 bg-gray-50">
                    <div className="bg-gray-900 text-white p-3 rounded-full">
                        <PiggyBank size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Saved</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {new Intl.NumberFormat('en-IE', {
                                style: 'currency',
                                currency: 'EUR',
                            }).format(totalSaved)}
                        </p>
                    </div>
                </div>

                {/* Right Side */}
                <div className="w-full md:w-7/12 grid grid-cols-2 gap-4">
                    {pots.length === 0 ? (
                        <p className="text-xs text-gray-400 col-span-2">
                            No pots created yet.
                        </p>
                    ) : (
                        pots.map((pot) => (
                            <div
                                key={pot.id}
                                className="flex flex-col gap-1 border-l-4 pl-4"
                                style={{ borderColor: pot.theme }}
                            >
                                <span className="text-xs text-gray-500 truncate">
                                    {pot.name}
                                </span>
                                <span className="font-bold text-gray-900 text-sm">
                                    {new Intl.NumberFormat('en-IE', {
                                        style: 'currency',
                                        currency: 'EUR',
                                    }).format(Number(pot.total))}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
