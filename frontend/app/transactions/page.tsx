'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, Plus, X, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface Transaction {
    id: number;
    name: string;
    category: string;
    date: string;
    amount: number;
    avatar: string;
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // EState to know if we are EDITING (has ID) or CREATING (null)
    const [editingId, setEditingId] = useState<number | null>(null);

    // Form States
    const [newName, setNewName] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [newCategory, setNewCategory] = useState('General');

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(
                `${
                    process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api'
                }/transactions`
            );
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Prepare the form for editing.
    const handleEditClick = (t: Transaction) => {
        setEditingId(t.id);
        setNewName(t.name);
        setNewAmount(t.amount.toString());
        setNewCategory(t.category);
        setShowForm(true); // Open de Form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Função de Excluir
    const handleDeleteClick = async (id: number) => {
        if (!confirm('Are you sure you want to delete this transaction?'))
            return;

        try {
            await axios.delete(
                `${
                    process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api'
                }/transactions/${id}`
            );
            fetchTransactions(); // Update the list
        } catch (error) {
            console.error(error);
            alert('Error deleting transaction');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const cleanAmount = newAmount.toString().replace(',', '.').trim();

        if (isNaN(Number(cleanAmount))) {
            alert('Please enter a valid value (use a period or comma).');
            return;
        }

        const payload = {
            name: newName,
            amount: Number(cleanAmount),
            category: newCategory,
            date: new Date().toISOString().split('T')[0],
            recurring: false,
        };

        try {
            if (editingId) {
                // EDIT MODE (PUT)
                await axios.put(
                    `${
                        process.env.NEXT_PUBLIC_API_URL ||
                        'http://localhost/api'
                    }/transactions/${editingId}`,
                    payload
                );
            } else {
                // CREATION MODE (POST)
                await axios.post(
                    `${
                        process.env.NEXT_PUBLIC_API_URL ||
                        'http://localhost/api'
                    }/transactions`,
                    payload
                );
            }

            // Clear all
            setNewName('');
            setNewAmount('');
            setEditingId(null);
            setShowForm(false);
            fetchTransactions();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error(error);

            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                alert(`Server Error: ${error.response.data.message}`);
            } else {
                alert('Error saving transaction');
            }
        }
    };

    if (loading)
        return (
            <main className="p-8">
                <Loader2 className="animate-spin" />
            </main>
        );

    return (
        <main className="min-h-screen bg-gray-50 p-8 pb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Transactions
                </h1>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingId(null);
                        setNewName('');
                        setNewAmount('');
                    }}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    {showForm ? <X size={16} /> : <Plus size={16} />}
                    {showForm ? 'Cancel' : 'Add New Transaction'}
                </button>
            </div>

            {/* FORM (Used to Create and Edit) */}
            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8 animate-in slide-in-from-top-4 border border-gray-100">
                    <h2 className="font-bold text-lg mb-4 text-gray-900">
                        {editingId ? 'Edit Transaction' : 'New Transaction'}
                    </h2>
                    <form
                        onSubmit={handleSubmit}
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
                            {editingId
                                ? 'Update Transaction'
                                : 'Save Transaction'}
                        </button>
                    </form>
                </div>
            )}

            {/* LISTA */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="grid grid-cols-5 p-4 border-b border-gray-100 bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <div className="col-span-2 md:col-span-1">Name</div>
                    <div className="hidden md:block">Category</div>
                    <div className="hidden md:block">Date</div>
                    <div className="text-right">Amount</div>
                    <div className="text-right">Actions</div>
                </div>

                <div className="divide-y divide-gray-100">
                    {transactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="grid grid-cols-5 p-4 items-center hover:bg-gray-50 transition-colors group"
                        >
                            <div className="col-span-2 md:col-span-1 flex items-center gap-3">
                                <Image
                                    src={transaction.avatar}
                                    alt={transaction.name}
                                    width={32}
                                    height={32}
                                    className="rounded-full hidden sm:block"
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

                            {/* BOTÕES DE AÇÃO */}
                            <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEditClick(transaction)}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() =>
                                        handleDeleteClick(transaction.id)
                                    }
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
