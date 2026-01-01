'use client';

import { ReceiptText, CheckCircle2 } from 'lucide-react';

export default function RecurringBillsPage() {
    const bills = [
        {
            name: 'Spark Energy',
            dueDate: '24',
            amount: 150.0,
            status: 'upcoming',
            logo: '⚡',
        },
        {
            name: 'Serenity Spa',
            dueDate: '28',
            amount: 40.0,
            status: 'upcoming',
            logo: '🧖‍♀️',
        },
        {
            name: 'Platinum Gym',
            dueDate: '01',
            amount: 65.0,
            status: 'paid',
            logo: '💪',
        },
        {
            name: 'Housing Rent',
            dueDate: '05',
            amount: 1200.0,
            status: 'paid',
            logo: '🏠',
        },
        {
            name: 'Spotify Premium',
            dueDate: '15',
            amount: 12.99,
            status: 'paid',
            logo: '🎵',
        },
    ];

    // Calculate the total
    const totalBills = bills.reduce((acc, bill) => acc + bill.amount, 0);
    // Count how many are left to pay.
    const pendingCount = bills.filter((b) => b.status === 'upcoming').length;

    return (
        <main className="min-h-screen bg-gray-50 p-8 pb-20">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Recurring Bills
            </h1>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left side: Summary of Monthly Impact */}
                <div className="xl:col-span-1 space-y-6">
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
                            €{totalBills.toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">
                            Summary
                        </h3>
                        <p className="text-gray-500 text-sm mb-4">
                            You have{' '}
                            <span className="font-bold text-gray-900">
                                {pendingCount} bills
                            </span>{' '}
                            upcoming this month.
                        </p>
                        <hr className="border-gray-100 my-4" />
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Paid so far</span>
                            <span className="font-bold text-green-600">
                                €
                                {bills
                                    .filter((b) => b.status === 'paid')
                                    .reduce((acc, b) => acc + b.amount, 0)
                                    .toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right side: Account List */}
                <div className="xl:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-gray-900">Your Bills</h3>
                    </div>
                    <div>
                        {bills.map((bill, index) => (
                            <div
                                key={index}
                                className={`
                                    flex items-center justify-between p-6 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors
                                    ${
                                        bill.status === 'paid'
                                            ? 'opacity-60'
                                            : ''
                                    }
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                                        {bill.logo}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">
                                            {bill.name}
                                        </p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            {bill.status === 'paid' ? (
                                                <span className="text-green-600 flex items-center gap-1">
                                                    Paid{' '}
                                                    <CheckCircle2 size={12} />
                                                </span>
                                            ) : (
                                                <span className="text-orange-500 font-bold">
                                                    Due on {bill.dueDate}th
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="font-bold text-gray-900">
                                    €{bill.amount.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
