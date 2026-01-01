'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Transaction } from '@/types/Transaction';

export default function Home() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Function to fetch data from our Laravel API
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'http://localhost/api/transactions'
                );
                setTransactions(response.data);
            } catch (err) {
                setError(
                    'Failed to load transactions. Is the backend running?'
                );
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-8">Loading data... ⏳</div>;
    if (error) return <div className="p-8 text-red-500">{error} 🚨</div>;

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Transactions
            </h1>

            <div className="bg-white rounded-lg shadow overflow-hidden max-w-4xl">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">
                                Name
                            </th>
                            <th className="p-4 font-semibold text-gray-600">
                                Category
                            </th>
                            <th className="p-4 font-semibold text-gray-600">
                                Date
                            </th>
                            <th className="p-4 font-semibold text-right text-gray-600">
                                Amount
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((t) => (
                            <tr
                                key={t.id}
                                className="border-b hover:bg-gray-50 transition"
                            >
                                <td className="p-4 flex items-center gap-3">
                                    {t.avatar ? (
                                        <Image
                                            src={t.avatar}
                                            alt={t.name}
                                            width={40}
                                            height={40}
                                            className="rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-xs">
                                            N/A
                                        </div>
                                    )}
                                    <span className="font-medium text-gray-800">
                                        {t.name}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500">
                                    {t.category}
                                </td>
                                <td className="p-4 text-gray-500 text-sm">
                                    {new Date(t.date).toLocaleDateString(
                                        'en-IE'
                                    )}
                                </td>
                                <td
                                    className={`p-4 text-right font-bold ${
                                        t.is_income
                                            ? 'text-green-600'
                                            : 'text-gray-900'
                                    }`}
                                >
                                    {t.is_income ? '+' : '-'}${t.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
