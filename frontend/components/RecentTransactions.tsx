'use client';

import Link from 'next/link';
import { Transaction } from '@/types/Transaction';
import Image from 'next/image';

interface RecentTransactionsProps {
    transactions: Transaction[];
}

export default function RecentTransactions({
    transactions,
}: RecentTransactionsProps) {
    const recentTransactions = transactions.slice(0, 5);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IE', {
            style: 'currency',
            currency: 'EUR',
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(date);
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-gray-900">
                    Transactions
                </h2>

                <Link
                    href="/transactions"
                    className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
                >
                    View All
                </Link>
            </div>
            <div className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                        >
                            <div className="flex items-center gap-4">
                                {/* Avatar / Icon Placeholder */}
                                <div className="hidden sm:block">
                                    {transaction.avatar ? (
                                        <Image
                                            width={40}
                                            height={40}
                                            src={transaction.avatar}
                                            alt={transaction.name}
                                            className="rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold">
                                            {transaction.name
                                                .substring(0, 2)
                                                .toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-900 text-sm">
                                        {transaction.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {formatDate(transaction.date)}
                                    </span>
                                </div>
                            </div>

                            <div
                                className={`font-bold text-sm ${
                                    transaction.is_income
                                        ? 'text-green-600'
                                        : 'text-gray-900'
                                }`}
                            >
                                {transaction.is_income ? '+' : ''}
                                {formatCurrency(Number(transaction.amount))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
