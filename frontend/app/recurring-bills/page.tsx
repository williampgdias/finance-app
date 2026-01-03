'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { ReceiptText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface RecurringBill {
    id: number;
    name: string;
    amount: string;
    status: 'paid' | 'upcoming';
    due_day: string;
    logo: string;
}

export default function RecurringBillsPage() {
    const [bills, setBills] = useState<RecurringBill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const response = await axios.get(
                    'http://localhost/api/recurring-bills'
                );
                setBills(response.data);
            } catch (error) {
                console.error('Error fetching bills:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBills();
    }, []);

    // Calculations
    const totalBills = bills.reduce(
        (acc, bill) => acc + Number(bill.amount),
        0
    );
    const totalPaid = bills
        .filter((b) => b.status === 'paid')
        .reduce((acc, b) => acc + Number(b.amount), 0);
    const totalUpcoming = bills
        .filter((b) => b.status === 'upcoming')
        .reduce((acc, b) => acc + Number(b.amount), 0);

    const countUpcoming = bills.filter((b) => b.status === 'upcoming').length;

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-500" size={48} />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 p-8 pb-20">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Recurring Bills
            </h1>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Side: Summary Cards */}
                <div className="xl:col-span-1 space-y-6">
                    {/* Total Box */}
                    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-gray-800 rounded-full">
                                <ReceiptText size={24} />
                            </div>
                            <h2 className="text-xl font-bold">Total Monthly</h2>
                        </div>
                        <p className="text-gray-400 text-sm mb-1">
                            Total estimates
                        </p>
                        <p className="text-4xl font-bold">
                            {new Intl.NumberFormat('en-IE', {
                                style: 'currency',
                                currency: 'EUR',
                            }).format(totalBills)}
                        </p>
                    </div>

                    {/* Summary Box */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">
                            Summary
                        </h3>
                        <p className="text-gray-500 text-sm mb-4">
                            You have{' '}
                            <span className="font-bold text-gray-900">
                                {countUpcoming} bills
                            </span>{' '}
                            upcoming this month.
                        </p>
                        <hr className="border-gray-100 my-4" />

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">
                                    Paid so far
                                </span>
                                <span className="font-bold text-gray-900">
                                    {new Intl.NumberFormat('en-IE', {
                                        style: 'currency',
                                        currency: 'EUR',
                                    }).format(totalPaid)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Upcoming</span>
                                <span className="font-bold text-gray-900">
                                    {new Intl.NumberFormat('en-IE', {
                                        style: 'currency',
                                        currency: 'EUR',
                                    }).format(totalUpcoming)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Bills List */}
                <div className="xl:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-gray-900">Your Bills</h3>
                    </div>
                    <div>
                        {bills.map((bill) => (
                            <div
                                key={bill.id}
                                className={`
                                    flex items-center justify-between p-6 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors
                                    ${
                                        bill.status === 'paid'
                                            ? 'opacity-60 grayscale-[0.5]'
                                            : ''
                                    }
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Logo / Icon */}
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                                        {bill.logo || '🧾'}
                                    </div>

                                    <div>
                                        <p className="font-bold text-gray-900">
                                            {bill.name}
                                        </p>
                                        <div className="text-xs flex items-center gap-1 mt-1">
                                            {bill.status === 'paid' ? (
                                                <span className="text-green-600 font-bold flex items-center gap-1">
                                                    Paid{' '}
                                                    <CheckCircle2 size={12} />
                                                </span>
                                            ) : (
                                                <span className="text-orange-500 font-bold flex items-center gap-1">
                                                    Due on {bill.due_day}th{' '}
                                                    <AlertCircle size={12} />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className={`font-bold ${
                                        bill.status === 'paid'
                                            ? 'text-gray-900'
                                            : 'text-orange-600'
                                    }`}
                                >
                                    {new Intl.NumberFormat('en-IE', {
                                        style: 'currency',
                                        currency: 'EUR',
                                    }).format(Number(bill.amount))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
