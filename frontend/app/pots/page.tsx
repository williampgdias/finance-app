/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Loader2,
    Plus,
    X,
    Ellipsis,
    Trophy,
    Trash2,
    Pencil,
    Minus,
} from 'lucide-react';

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

    // MODAL STATES
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [activePot, setActivePot] = useState<Pot | null>(null);

    // MODAL Types: 'deposit' | 'withdraw' | 'edit' | 'congrats' | null
    const [modalType, setModalType] = useState<string | null>(null);

    // Inputs
    const [amountInput, setAmountInput] = useState('');

    // Form Create/Edit Inputs
    const [formName, setFormName] = useState('');
    const [formTarget, setFormTarget] = useState('');
    const [formTheme, setFormTheme] = useState('#277C78');

    const themeColors = [
        '#277C78',
        '#82C9D7',
        '#F2CDAC',
        '#626070',
        '#C94736',
        '#826CB0',
    ];

    const fetchPots = async () => {
        try {
            const response = await axios.get('http://localhost/api/pots');
            setPots(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPots();
    }, []);

    // --- USER ACTIONS ---

    const handleOpenCreate = () => {
        setFormName('');
        setFormTarget('');
        setFormTheme('#277C78');
        setCreateModalOpen(true);
    };

    const handleSavePot = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            name: formName,
            target: parseFloat(formTarget),
            theme: formTheme,
        };

        try {
            if (activePot && modalType === 'edit') {
                await axios.put(
                    `http://localhost/api/pots/${activePot.id}`,
                    payload
                );
            } else {
                await axios.post('http://localhost/api/pots', payload);
            }
            closeAllModals();
            fetchPots();
        } catch (error) {
            alert('Error saving pot');
        }
    };

    const handleTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activePot || !amountInput) return;

        const val = parseFloat(amountInput);
        let newTotal = Number(activePot.total);

        if (modalType === 'deposit') newTotal += val;
        if (modalType === 'withdraw') newTotal -= val;

        // Avoid a negative balance
        if (newTotal < 0) newTotal = 0;

        try {
            await axios.put(`http://localhost/api/pots/${activePot.id}`, {
                total: newTotal,
            });

            // Check if you have reached the target (deposit only).
            if (
                modalType === 'deposit' &&
                newTotal >= Number(activePot.target)
            ) {
                const updatedPot = { ...activePot, total: newTotal };
                setActivePot(updatedPot);
                setModalType('congrats');
                fetchPots();
                return;
            }

            closeAllModals();
            fetchPots();
        } catch (error) {
            alert('Error processing transaction');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this pot?')) return;
        try {
            await axios.delete(`http://localhost/api/pots/${id}`);
            closeAllModals();
            fetchPots();
        } catch (error) {
            alert('Error deleting pot');
        }
    };

    const closeAllModals = () => {
        setCreateModalOpen(false);
        setModalType(null);
        setActivePot(null);
        setAmountInput('');
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
                <h1 className="text-3xl font-bold text-gray-900">Pots</h1>
                <button
                    onClick={handleOpenCreate}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors"
                >
                    <Plus size={16} /> Add New Pot
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pots.map((pot) => {
                    const total = Number(pot.total);
                    const target = Number(pot.target);
                    const percentage = Math.min((total / target) * 100, 100);
                    const isCompleted = total >= target;

                    return (
                        <div
                            key={pot.id}
                            className={`bg-white p-6 rounded-xl shadow-sm border-l-4 relative ${
                                isCompleted
                                    ? 'border-green-500 bg-green-50'
                                    : ''
                            }`}
                            style={{
                                borderColor: isCompleted
                                    ? undefined
                                    : pot.theme,
                            }}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-4 h-4 rounded-full ${
                                            isCompleted ? 'bg-green-500' : ''
                                        }`}
                                        style={{
                                            backgroundColor: isCompleted
                                                ? undefined
                                                : pot.theme,
                                        }}
                                    ></div>
                                    <div>
                                        <h2 className="font-bold text-xl text-gray-900">
                                            {pot.name}
                                        </h2>
                                        {isCompleted && (
                                            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                                COMPLETED
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="relative group">
                                    <button className="text-gray-400 hover:text-gray-900 p-1">
                                        <Ellipsis size={20} />
                                    </button>
                                    <div className="absolute right-0 top-6 bg-white shadow-lg border rounded-lg p-2 z-10 hidden group-hover:block w-32">
                                        <button
                                            onClick={() => {
                                                setActivePot(pot);
                                                setFormName(pot.name);
                                                setFormTarget(
                                                    pot.target.toString()
                                                );
                                                setFormTheme(pot.theme);
                                                setModalType('edit');
                                            }}
                                            className="flex items-center gap-2 text-sm text-gray-600 hover:bg-gray-50 w-full p-2 rounded text-left"
                                        >
                                            <Pencil size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(pot.id)}
                                            className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 w-full p-2 rounded text-left"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Total Saved
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {new Intl.NumberFormat('en-IE', {
                                            style: 'currency',
                                            currency: 'EUR',
                                        }).format(total)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-500 text-sm">
                                        Target
                                    </p>
                                    <p className="font-bold text-gray-900">
                                        {new Intl.NumberFormat('en-IE', {
                                            style: 'currency',
                                            currency: 'EUR',
                                        }).format(target)}
                                    </p>
                                </div>
                            </div>

                            <div className="w-full h-3 bg-gray-100 rounded-full mb-6 overflow-hidden">
                                <div
                                    className="h-full transition-all duration-700 ease-out"
                                    style={{
                                        width: `${percentage}%`,
                                        backgroundColor: isCompleted
                                            ? '#22c55e'
                                            : pot.theme,
                                    }}
                                ></div>
                            </div>

                            {!isCompleted ? (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setActivePot(pot);
                                            setModalType('deposit');
                                        }}
                                        className="flex-1 bg-gray-50 border border-gray-200 py-3 rounded-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors flex justify-center items-center gap-2"
                                    >
                                        <Plus size={16} /> Add Money
                                    </button>
                                    <button
                                        onClick={() => {
                                            setActivePot(pot);
                                            setModalType('withdraw');
                                        }}
                                        className="flex-1 bg-white border border-gray-200 py-3 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition-colors flex justify-center items-center gap-2"
                                    >
                                        <Minus size={16} /> Withdraw
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center font-bold text-sm">
                                    🎉 Goal Reached! Great job!
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* --- MODALS --- */}

            {/* 1. Create or Edit modal */}
            {(isCreateModalOpen || modalType === 'edit') && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">
                                {modalType === 'edit'
                                    ? 'Edit Pot'
                                    : 'Add New Pot'}
                            </h2>
                            <button onClick={closeAllModals}>
                                <X className="text-gray-500" />
                            </button>
                        </div>
                        <form onSubmit={handleSavePot} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">
                                    Pot Name
                                </label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={(e) =>
                                        setFormName(e.target.value)
                                    }
                                    className="w-full p-3 border rounded-lg text-gray-900 placeholder:text-gray-400"
                                    placeholder="Ex: Trip to Japan"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">
                                    Target Amount (€)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formTarget}
                                    onChange={(e) =>
                                        setFormTarget(e.target.value)
                                    }
                                    className="w-full p-3 border rounded-lg text-gray-900 placeholder:text-gray-400"
                                    placeholder="Ex: 5000"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2">
                                    Theme
                                </label>
                                <div className="flex gap-2">
                                    {themeColors.map((c) => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setFormTheme(c)}
                                            className={`w-8 h-8 rounded-full ${
                                                formTheme === c
                                                    ? 'ring-2 ring-offset-2 ring-gray-900 scale-110'
                                                    : ''
                                            }`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <button className="w-full bg-gray-900 text-white p-3 rounded-lg font-bold hover:bg-gray-800">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* 2. Deposit or Withdraw method */}
            {(modalType === 'deposit' || modalType === 'withdraw') &&
                activePot && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                        <div className="bg-white p-6 rounded-2xl w-full max-w-sm animate-in zoom-in-95">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {modalType === 'deposit'
                                        ? 'Add Money'
                                        : 'Withdraw Money'}
                                </h2>
                                <button onClick={closeAllModals}>
                                    <X className="text-gray-500" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between text-sm text-gray-500 mb-2">
                                    <span>New Amount</span>
                                    <span className="font-bold text-gray-900">
                                        {amountInput
                                            ? new Intl.NumberFormat('en-IE', {
                                                  style: 'currency',
                                                  currency: 'EUR',
                                              }).format(
                                                  Math.max(
                                                      0,
                                                      modalType === 'deposit'
                                                          ? Number(
                                                                activePot.total
                                                            ) +
                                                                Number(
                                                                    amountInput
                                                                )
                                                          : Number(
                                                                activePot.total
                                                            ) -
                                                                Number(
                                                                    amountInput
                                                                )
                                                  )
                                              )
                                            : '...'}
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gray-900 transition-all"
                                        style={{
                                            width: `${Math.min(
                                                (Number(activePot.total) /
                                                    Number(activePot.target)) *
                                                    100,
                                                100
                                            )}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            <form onSubmit={handleTransaction}>
                                <label className="block text-xs font-bold text-gray-500 mb-1">
                                    Amount to {modalType}
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    autoFocus
                                    value={amountInput}
                                    onChange={(e) =>
                                        setAmountInput(e.target.value)
                                    }
                                    className="w-full p-4 border-2 border-gray-900 rounded-xl text-2xl font-bold text-center mb-6 focus:outline-none text-gray-900 placeholder:text-gray-400"
                                    placeholder="0.00"
                                    required
                                />
                                <button className="w-full bg-gray-900 text-white p-3 rounded-lg font-bold hover:bg-gray-800">
                                    Confirm{' '}
                                    {modalType === 'deposit'
                                        ? 'Addition'
                                        : 'Withdrawal'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

            {/* 3. CONGRATS Modal */}
            {modalType === 'congrats' && activePot && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-md">
                    <div className="bg-white p-8 rounded-2xl w-full max-w-md text-center animate-in zoom-in-95 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-red-500 via-yellow-500 to-green-500"></div>

                        <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trophy size={40} />
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Congratulations!
                        </h2>
                        <p className="text-gray-600 mb-8">
                            You&apos;ve reached your goal of{' '}
                            <span className="font-bold text-gray-900">
                                {new Intl.NumberFormat('en-IE', {
                                    style: 'currency',
                                    currency: 'EUR',
                                }).format(activePot.target)}
                            </span>{' '}
                            for{' '}
                            <span className="font-bold text-gray-900">
                                {activePot.name}
                            </span>
                            !
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={closeAllModals}
                                className="w-full bg-green-600 text-white p-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                            >
                                Keep it as a Trophy 🏆
                            </button>
                            <button
                                onClick={() => handleDelete(activePot.id)}
                                className="w-full bg-white text-gray-500 p-3 rounded-xl font-bold hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                                Delete Pot
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
