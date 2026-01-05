'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Loader2, Plus, X } from 'lucide-react';

interface Transaction {
    id: number;
    name: string;
    category: string;
    date: string;
    amount: number;
    avatar: string;
}

export default function TransactionPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form States
    const [newName, setNewName] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [newCategory, setNewCategory] = useState('General');

    const fetchTransaction = async () => {
        try {
            const response = await axios.get(
                'http://localhost/api/transactions'
            );
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransaction();
    }, []);

    const handleAddTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newAmount) return;

        try {
            await axios.post('http://localhost/api/transactions', {
                name: newName,
                amount: parseFloat(newAmount),
                category: newCategory,
                date: new Date().toISOString().split('T')[0],
                recurring: false,
            });

            setNewName('');
            setNewAmount('');
            setShowForm(false);
            fetchTransaction();
        } catch (error) {
            console.error(error);
            alert('Error adding transaction');
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-500" size={48} />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 p-8 pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Transactions
                </h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    {showForm ? <X size={16} /> : <Plus size={16} />}
                    {showForm ? 'Cancel' : 'Add New Transaction'}
                </button>
            </div>

            {/* ADD FORM */}
            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8 animate-in slide-in-from-top-4">
                    <h2 className="font-bold text-lg mb-4 text-gray-900">
                        New Transaction
                    </h2>
                    <form
                        onSubmit={handleAddTransaction}
                        className="grid gap-4 md:grid-cols-4 items-end"
                    >
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full p-2 border rounded-lg text-gray-900"
                                placeholder="Ex: Supermarket"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Amount (+ Income, - Expense)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={newAmount}
                                onChange={(e) => setNewAmount(e.target.value)}
                                className="w-full p-2 border rounded-lg text-gray-900"
                                placeholder="Ex: -50.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="w-full p-2 border rounded-lg text-gray-900 bg-white"
                            >
                                <option>General</option>
                                <option>Dining Out</option>
                                <option>Groceries</option>
                                <option>Entertainment</option>
                                <option>Transportation</option>
                                <option>Lifestyle</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="bg-green-600 text-white p-2 rounded-lg font-bold hover:bg-green-700 h-10.5"
                        >
                            Save
                        </button>
                    </form>
                </div>
            )}

            {/* LIST */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="grid grid-cols-4 p-4 border-b border-gray-100 bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <div className="col-span-2 md:col-span-1">Name</div>
                    <div className="hidden md:block">Category</div>
                    <div className="hidden md:block">Date</div>
                    <div className="text-right">Amount</div>
                </div>

                <div className="divide-y divide-gray-100">
                    {transactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="grid grid-cols-4 p-4 items-center hover:bg-gray-50 transition-colors"
                        >
                            <div className="col-span-2 md:col-span-1 flex items-center gap-3">
                                <img
                                    src={transaction.avatar}
                                    alt={transaction.name}
                                    className="w-8 h-8 rounded-full hidden sm:block"
                                />
                                <span className="font-bold text-gray-900 text-sm">
                                    {transaction.name}
                                </span>
                            </div>
                            <div className="hidden md:block text-gray-500 text-sm">
                                {transaction.category}
                            </div>
                            <div className="hidden md:block text-gray-500 text-sm">
                                {new Date(transaction.date).toLocaleDateString(
                                    'en-IE'
                                )}
                            </div>
                            <div
                                className={`text-right font-bold text-sm ${
                                    transaction.amount > 0
                                        ? 'text-green-600'
                                        : 'text-gray-900'
                                }`}
                            >
                                {transaction.amount > 0 ? '+' : ''}
                                {new Intl.NumberFormat('en-IE', {
                                    style: 'currency',
                                    currency: 'EUR',
                                }).format(transaction.amount)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
