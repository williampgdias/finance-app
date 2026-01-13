'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Transaction } from '@/types/Transaction';
import SummaryCards from '@/components/SummaryCards';
import RecentTransactions from '@/components/RecentTransactions';
// import BudgetsChart from '@/components/BudgetsChart';
import HomeBudgets from '@/components/HomeBudgets';
import PotsWidget from '@/components/PotsWidget';

export default function Home() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${
                        process.env.NEXT_PUBLIC_API_URL ||
                        'http://localhost/api'
                    }/transactions`
                );
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 p-8">
                <div className="animate-pulse flex flex-col gap-8">
                    <div className="h-40 bg-gray-200 rounded-xl 2-full"></div>
                    <div className="h-96 bg-gray-200 rounded-xl 2-full"></div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 p-8 pb-20">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Overview</h1>

            {/* Summary Cards Section */}
            <SummaryCards transactions={transactions} />

            {/* Placeholder for other widgets (Pots, Budgets, etc) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PotsWidget />

                {/* <BudgetsChart transactions={transactions} /> */}
                <HomeBudgets />
                <div className="col-span-1 lg:col-span-2">
                    <RecentTransactions transactions={transactions} />
                </div>
            </div>
        </main>
    );
}
