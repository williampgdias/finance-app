'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Ellipsis,
    Loader2,
    Plus,
    X,
    ChevronRight,
    Trash2,
    Pencil,
} from 'lucide-react';

interface Budget {
    id: number;
    category: string;
    maximum: number;
    current: number;
    theme: string;
}

export default function BudgetsPage() {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Estado para controlar qual menu está aberto
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    // Estados do Formulário
    const [editingId, setEditingId] = useState<number | null>(null); // Null = Criando, Numero = Editando
    const [category, setCategory] = useState('');
    const [maximum, setMaximum] = useState('');
    const [theme, setTheme] = useState('#277C78');

    const themeColors = [
        '#277C78',
        '#82C9D7',
        '#F2CDAC',
        '#626070',
        '#C94736',
        '#826CB0',
    ];

    const [summary, setSummary] = useState({ totalLimit: 0, totalSpent: 0 });

    const fetchBudgets = async () => {
        try {
            const response = await axios.get('http://localhost/api/budgets');
            const data: Budget[] = response.data;
            setBudgets(data);

            const totalLimit = data.reduce(
                (acc, curr) => acc + Number(curr.maximum),
                0
            );
            const totalSpent = data.reduce(
                (acc, curr) => acc + Number(curr.current),
                0
            );
            setSummary({ totalLimit, totalSpent });
        } catch (error) {
            console.error('Error fetching budgets:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    // Preparar formulário para edição
    const handleEditClick = (budget: Budget) => {
        setEditingId(budget.id);
        setCategory(budget.category);
        setMaximum(budget.maximum.toString());
        setTheme(budget.theme);
        setOpenMenuId(null); // Fecha o menu
        setShowForm(true); // Abre o modal
    };

    // Reseta o formulário
    const resetForm = () => {
        setEditingId(null);
        setCategory('');
        setMaximum('');
        setTheme('#277C78');
        setShowForm(false);
    };

    const handleSaveBudget = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!category || !maximum) return;

        try {
            if (editingId) {
                // EDITAR (PUT)
                await axios.put(`http://localhost/api/budgets/${editingId}`, {
                    category,
                    maximum: parseFloat(maximum),
                    theme,
                });
            } else {
                // CRIAR (POST)
                await axios.post('http://localhost/api/budgets', {
                    category,
                    maximum: parseFloat(maximum),
                    theme,
                });
            }

            resetForm();
            fetchBudgets();
        } catch (error) {
            console.error(error);
            alert('Error saving budget');
        }
    };

    const handleDeleteBudget = async (id: number) => {
        if (!confirm('Delete this budget?')) return;
        try {
            await axios.delete(`http://localhost/api/budgets/${id}`);
            setOpenMenuId(null);
            fetchBudgets();
        } catch (error) {
            console.error(error);
            alert('Error deleting budget');
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
                <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
                <button
                    onClick={() => {
                        if (showForm) resetForm();
                        else setShowForm(true);
                    }}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    {showForm ? <X size={16} /> : <Plus size={16} />}
                    {showForm ? 'Cancel' : 'Add New Budget'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8 animate-in slide-in-from-top-4 max-w-2xl mx-auto border border-gray-100">
                    <h2 className="font-bold text-lg mb-6 text-gray-900">
                        {editingId ? 'Edit Budget' : 'Create New Budget'}
                    </h2>
                    <form onSubmit={handleSaveBudget} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                    className="w-full p-3 border border-gray-200 rounded-lg text-gray-900"
                                    placeholder="e.g. Groceries"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">
                                    Maximum Spend (€)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={maximum}
                                    onChange={(e) => setMaximum(e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-lg text-gray-900"
                                    placeholder="e.g. 200.00"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">
                                Theme Color
                            </label>
                            <div className="flex gap-3">
                                {themeColors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setTheme(color)}
                                        className={`w-8 h-8 rounded-full transition-transform ${
                                            theme === color
                                                ? 'ring-2 ring-offset-2 ring-gray-900 scale-110'
                                                : ''
                                        }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full bg-gray-900 text-white p-3 rounded-lg font-bold hover:bg-gray-800 flex justify-center items-center gap-2"
                            >
                                {editingId ? 'Save Changes' : 'Create Budget'}{' '}
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Chart Summary - Left Side */}
                <div className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                    <div className="w-64 h-64 rounded-full border-[32px] border-gray-100 flex items-center justify-center relative">
                        {/* Simples hack visual para o gráfico de donut */}
                        <div className="absolute inset-0 border-[32px] border-transparent border-t-gray-900 rounded-full rotate-45 opacity-20"></div>
                        <div className="text-center z-10">
                            <p className="text-4xl font-bold text-gray-900">
                                €{summary.totalSpent.toFixed(0)}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                of €{summary.totalLimit.toFixed(0)} limit
                            </p>
                        </div>
                    </div>
                    <h2 className="text-xl font-bold mt-8">Spending Summary</h2>
                </div>

                {/* Budget List - Right Side */}
                <div className="flex flex-col gap-6">
                    {budgets.map((budget) => {
                        const percentage =
                            (budget.current / budget.maximum) * 100;
                        return (
                            <div
                                key={budget.id}
                                className="bg-white p-6 rounded-xl shadow-sm relative"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{
                                                backgroundColor: budget.theme,
                                            }}
                                        ></div>
                                        <h3 className="font-bold text-gray-900 text-lg">
                                            {budget.category}
                                        </h3>
                                    </div>

                                    {/* OPTIONS MENU */}
                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                setOpenMenuId(
                                                    openMenuId === budget.id
                                                        ? null
                                                        : budget.id
                                                )
                                            }
                                            className="text-gray-400 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition"
                                        >
                                            <Ellipsis size={20} />
                                        </button>

                                        {openMenuId === budget.id && (
                                            <div className="absolute right-0 mt-2 bg-white shadow-xl border border-gray-100 rounded-lg py-2 z-20 w-40 animate-in fade-in zoom-in-95 duration-200">
                                                <button
                                                    onClick={() =>
                                                        handleEditClick(budget)
                                                    }
                                                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 font-medium"
                                                >
                                                    <Pencil size={14} /> Edit
                                                    Budget
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteBudget(
                                                            budget.id
                                                        )
                                                    }
                                                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                                                >
                                                    <Trash2 size={14} /> Delete
                                                    Budget
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 mb-2">
                                    Maximum of €
                                    {Number(budget.maximum).toFixed(2)}
                                </p>

                                <div className="w-full h-8 bg-gray-100 rounded-lg p-1 mb-4">
                                    <div
                                        className="h-full rounded-md transition-all duration-500"
                                        style={{
                                            width: `${Math.min(
                                                percentage,
                                                100
                                            )}%`,
                                            backgroundColor: budget.theme,
                                        }}
                                    ></div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div
                                        className="w-1/2 border-l-4 pl-4"
                                        style={{ borderColor: budget.theme }}
                                    >
                                        <p className="text-xs text-gray-500 mb-1">
                                            Spent
                                        </p>
                                        <p className="font-bold text-gray-900">
                                            €{budget.current.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="w-1/2 border-l-4 pl-4 border-gray-200">
                                        <p className="text-xs text-gray-500 mb-1">
                                            Remaining
                                        </p>
                                        <p className="font-bold text-gray-900">
                                            €
                                            {(
                                                budget.maximum - budget.current
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
