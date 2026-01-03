'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Ellipsis, Plus, Minus, Loader2, X } from 'lucide-react';

// Defining the Data Structure for a Pot
interface Pot {
    id: number;
    name: string;
    target: number;
    total: number;
    theme: string;
}

// Pre-defined color themes for the UI
const colorThemes = [
    { name: 'Green', value: '#277C78' },
    { name: 'Grey', value: '#626070' },
    { name: 'Cyan', value: '#82C9D7' },
    { name: 'Beige', value: '#F2CDAC' },
    { name: 'Red', value: '#C94736' },
];

export default function PotsPage() {
    const [pots, setPots] = useState<Pot[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State (for creating a new pot)
    const [formData, setFormData] = useState({
        name: '',
        target: '',
        theme: colorThemes[0].value,
    });

    // Fetch data from Laravel API
    useEffect(() => {
        fetchPots();
    }, []);

    const fetchPots = async () => {
        try {
            const response = await axios.get('http://localhost/api/pots');
            setPots(response.data);
        } catch (error) {
            console.error('Error fetching pots:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle Form Submission
    const handleCreatePot = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost/api/pots', {
                name: formData.name,
                target: parseFloat(formData.target),
                theme: formData.theme,
            });

            // If successful: close modal, reset form, and refresh list
            setIsModalOpen(false);
            setFormData({ name: '', target: '', theme: colorThemes[0].value });
            fetchPots();
        } catch (error) {
            console.error('Error creating pot:', error);
            alert('Failed to create pot. Please try again.');
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-gray-500">
                    <Loader2 className="animate-spin" size={48} />
                    <p>Loading your pots...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 p-8 pb-20">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Pots</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    <Plus size={16} />
                    Add New Pot
                </button>
            </div>

            {/* Pots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {pots.map((pot) => {
                    const total = Number(pot.total);
                    const target = Number(pot.target);
                    const percentage = target > 0 ? (total / target) * 100 : 0;

                    return (
                        <div
                            key={pot.name}
                            className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between h-full"
                        >
                            {/* Card top */}
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: pot.theme }}
                                    ></div>
                                    <h2 className="font-bold text-gray-900 text-lg">
                                        {pot.name}
                                    </h2>
                                </div>
                                <button className="text-gray-400 hover:text-gray-900">
                                    <Ellipsis size={20} />
                                </button>
                            </div>

                            {/* Main info */}
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">
                                        Total Saved
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {new Intl.NumberFormat('en-IE', {
                                            style: 'currency',
                                            currency: 'EUR',
                                        }).format(total)}
                                    </p>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-gray-500 mb-2">
                                    <span className="font-bold text-gray-900">
                                        {percentage.toFixed(1)}%
                                    </span>
                                    <span>
                                        Target of{' '}
                                        {new Intl.NumberFormat('en-IE', {
                                            style: 'currency',
                                            currency: 'EUR',
                                        }).format(target)}
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500 ease-out"
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: pot.theme,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
                                <button className="flex-1 bg-beige-100 py-3 rounded-lg text-sm font-bold text-gray-900 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                    <Plus size={16} />
                                    Add Money
                                </button>
                                <button className="flex-1 bg-white border border-gray-200 py-3 rounded-lg text-sm font-bold text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                    <Minus size={16} />
                                    Withdraw
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Create Pot Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl 2-full lg:w-lg md:w-md p-8 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                Add New Pot
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreatePot} className="space-y-4">
                            {/* Pot Name Input */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">
                                    Pot Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    maxLength={30}
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-500 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all "
                                    placeholder="e.g. Rainy Days"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                />
                                <p className="text-right text-xs text-gray-400 mt-1">
                                    {30 - formData.name.length} characters left
                                </p>
                            </div>

                            {/* Target Amount Input */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">
                                    Target Amount (€)
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    step="0.01"
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-500 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all"
                                    placeholder="e.g. 2000"
                                    value={formData.target}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            target: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Theme Selection */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-2">
                                    Theme
                                </label>
                                <div className="flex gap-2">
                                    {colorThemes.map((theme) => (
                                        <button
                                            key={theme.value}
                                            type="button"
                                            onClick={() =>
                                                setFormData({
                                                    ...formData,
                                                    theme: theme.value,
                                                })
                                            }
                                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                                                formData.theme === theme.value
                                                    ? 'border-gray-900 scale-110'
                                                    : 'border-transparent hover:scale-105'
                                            }`}
                                            style={{
                                                backgroundColor: theme.value,
                                            }}
                                            title={theme.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gray-900 text-white font-bold py-4 rounded-lg mt-4 hover:bg-gray-800 transition-colors"
                            >
                                Add Pot
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
