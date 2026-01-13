'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    ReceiptText,
    CheckCircle2,
    Loader2,
    AlertCircle,
    Search,
    Plus,
    X,
    ChevronRight,
    Ellipsis,
    Pencil,
    Trash2,
} from 'lucide-react';

/**
 * Interface representing a Recurring Bill entity.
 * Matches the structure returned by the Laravel API.
 */
interface RecurringBill {
    id: number;
    name: string;
    amount: string; // Received as string from decimal columns in DB
    status: 'paid' | 'upcoming';
    due_day: string; // Day of the month (1-31)
    logo: string;
}

export default function RecurringBillsPage() {
    // ============================================================================
    // State Management
    // ============================================================================

    // Data States
    const [bills, setBills] = useState<RecurringBill[]>([]);
    const [loading, setLoading] = useState(true);

    // UI/UX States (Search, Sort, and Menu visibility)
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('latest');
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    // Form/Modal States
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Form Input States
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDay, setDueDay] = useState('1');
    const [status, setStatus] = useState<'paid' | 'upcoming'>('upcoming');

    // ============================================================================
    // API Interactions
    // ============================================================================

    /**
     * Fetches the list of recurring bills from the backend.
     * Runs on component mount and after any CRUD operation.
     */
    const fetchBills = async () => {
        try {
            const response = await axios.get(
                'https://robust-delight-production.up.railway.app/api/recurring-bills'
            );
            setBills(response.data);
        } catch (error) {
            console.error('Failed to fetch recurring bills:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBills();
    }, []);

    // ============================================================================
    // Event Handlers & CRUD Logic
    // ============================================================================

    /**
     * Resets the form state to default values and closes the modal.
     */
    const resetForm = () => {
        setEditingId(null);
        setName('');
        setAmount('');
        setDueDay('1');
        setStatus('upcoming');
        setShowForm(false);
    };

    /**
     * Prepares the form for editing an existing bill.
     * Populates state with the selected bill's data.
     * @param bill - The bill object to be edited.
     */
    const handleEditClick = (bill: RecurringBill) => {
        setEditingId(bill.id);
        setName(bill.name);
        setAmount(bill.amount.toString());
        setDueDay(bill.due_day.toString());
        setStatus(bill.status);

        setOpenMenuId(null); // Close the dropdown menu
        setShowForm(true); // Open the modal

        // Enhance UX by scrolling to the top where the form opens
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /**
     * Handles form submission for both Creation and Updates.
     * Distinguishes between POST (Create) and PUT (Update) based on `editingId`.
     */
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payload = {
                name,
                amount: parseFloat(amount),
                due_day: parseInt(dueDay),
                status,
            };

            if (editingId) {
                // Update existing resource (PUT)
                await axios.put(
                    `https://robust-delight-production.up.railway.app/api/recurring-bills/${editingId}`,
                    payload
                );
            } else {
                // Create new resource (POST)
                await axios.post(
                    'https://robust-delight-production.up.railway.app/api/recurring-bills',
                    payload
                );
            }

            resetForm();
            fetchBills(); // Refresh data to reflect changes
        } catch (error) {
            console.error('Error saving bill:', error);
            alert('Failed to save the bill. Please try again.');
        }
    };

    /**
     * Deletes a bill by ID after user confirmation.
     * @param id - The ID of the bill to delete.
     */
    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to permanently delete this bill?'))
            return;

        try {
            await axios.delete(
                `https://robust-delight-production.up.railway.app/api/recurring-bills/${id}`
            );
            setOpenMenuId(null);
            fetchBills();
        } catch (error) {
            console.error('Error deleting bill:', error);
            alert('Failed to delete the bill.');
        }
    };

    // ============================================================================
    // Data Computation & Filtering
    // ============================================================================

    // Compute financial summaries for the dashboard widgets
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

    // Apply Search Filter and Sorting Logic
    const filteredBills = bills
        .filter((bill) =>
            bill.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case 'highest':
                    return Number(b.amount) - Number(a.amount);
                case 'lowest':
                    return Number(a.amount) - Number(b.amount);
                case 'a-z':
                    return a.name.localeCompare(b.name);
                case 'oldest':
                    return Number(a.due_day) - Number(b.due_day);
                // Default: Latest due date (closest to end of month)
                default:
                    return Number(a.due_day) - Number(b.due_day);
            }
        });

    // ============================================================================
    // Render
    // ============================================================================

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-500" size={48} />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 p-8 pb-20">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Recurring Bills
                </h1>
                <button
                    onClick={() => {
                        if (showForm) resetForm();
                        else setShowForm(true);
                    }}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-md"
                >
                    {showForm ? <X size={16} /> : <Plus size={16} />}
                    {showForm ? 'Cancel' : 'Add New Bill'}
                </button>
            </div>

            {/* Form Modal (Conditional Rendering) */}
            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8 animate-in slide-in-from-top-4 max-w-2xl mx-auto border border-gray-100">
                    <h2 className="font-bold text-lg mb-6 text-gray-900">
                        {editingId
                            ? 'Edit Bill Details'
                            : 'Add New Recurring Bill'}
                    </h2>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">
                                    Bill Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none"
                                    placeholder="e.g. Netflix"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">
                                    Amount (€)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none"
                                    placeholder="14.99"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">
                                    Due Day (of month)
                                </label>
                                <select
                                    value={dueDay}
                                    onChange={(e) => setDueDay(e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none"
                                >
                                    {Array.from(
                                        { length: 31 },
                                        (_, i) => i + 1
                                    ).map((day) => (
                                        <option key={day} value={day}>
                                            {day}th of month
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">
                                    Payment Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) =>
                                        setStatus(
                                            e.target.value as
                                                | 'paid'
                                                | 'upcoming'
                                        )
                                    }
                                    className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none"
                                >
                                    <option value="upcoming">Upcoming</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </div>
                        </div>
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="w-full bg-gray-900 text-white p-3 rounded-lg font-bold hover:bg-gray-800 flex justify-center items-center gap-2 transition-colors"
                            >
                                {editingId ? 'Save Changes' : 'Create Bill'}{' '}
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column: Financial Summaries */}
                <div className="xl:col-span-1 space-y-6">
                    {/* Primary Total Card */}
                    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between h-48 relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
                            <ReceiptText size={150} />
                        </div>
                        <div className="flex items-center gap-4 z-10">
                            <div className="p-3 bg-gray-800 rounded-full">
                                <ReceiptText size={24} />
                            </div>
                            <h2 className="text-xl font-bold">Total Monthly</h2>
                        </div>
                        <div className="z-10">
                            <p className="text-gray-400 text-sm mb-1">
                                Estimated total cost
                            </p>
                            <p className="text-4xl font-bold">
                                {new Intl.NumberFormat('en-IE', {
                                    style: 'currency',
                                    currency: 'EUR',
                                }).format(totalBills)}
                            </p>
                        </div>
                    </div>

                    {/* Breakdown Summary Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4">
                            Summary
                        </h3>
                        <p className="text-gray-500 text-sm mb-4">
                            You have{' '}
                            <span className="font-bold text-gray-900">
                                {countUpcoming} bills
                            </span>{' '}
                            currently pending payment.
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
                                <span className="font-bold text-orange-600">
                                    {new Intl.NumberFormat('en-IE', {
                                        style: 'currency',
                                        currency: 'EUR',
                                    }).format(totalUpcoming)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Interactive Bills List */}
                <div className="xl:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col min-h-125 border border-gray-100">
                    {/* List Controls: Search & Sort */}
                    <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="relative w-full sm:w-auto flex-1 max-w-md">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder="Search bills..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-sm text-gray-500 whitespace-nowrap hidden sm:block">
                                Sort by
                            </span>
                            <select
                                className="p-2 border border-gray-200 rounded-lg text-sm text-gray-700 font-bold focus:outline-none w-full sm:w-auto cursor-pointer bg-white"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="latest">Latest Due Date</option>
                                <option value="oldest">
                                    Earliest Due Date
                                </option>
                                <option value="a-z">Name (A-Z)</option>
                                <option value="highest">Highest Amount</option>
                                <option value="lowest">Lowest Amount</option>
                            </select>
                        </div>
                    </div>

                    {/* Scrollable List Container */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredBills.length > 0 ? (
                            filteredBills.map((bill) => (
                                <div
                                    key={bill.id}
                                    className={`
                                        flex items-center justify-between p-6 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors
                                        ${
                                            bill.status === 'paid'
                                                ? 'opacity-70 bg-gray-50/50'
                                                : ''
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Icon Placeholder */}
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl shadow-sm border border-gray-100">
                                            {bill.logo || '🧾'}
                                        </div>

                                        {/* Bill Details */}
                                        <div>
                                            <p className="font-bold text-gray-900">
                                                {bill.name}
                                            </p>
                                            <div className="text-xs flex items-center gap-1 mt-1">
                                                {bill.status === 'paid' ? (
                                                    <span className="text-green-600 font-bold flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-full">
                                                        Paid{' '}
                                                        <CheckCircle2
                                                            size={12}
                                                        />
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500 font-medium flex items-center gap-1">
                                                        Monthly -{' '}
                                                        <span
                                                            className={`font-bold ${
                                                                Number(
                                                                    bill.due_day
                                                                ) < 10
                                                                    ? 'text-orange-500'
                                                                    : 'text-gray-900'
                                                            }`}
                                                        >
                                                            Due {bill.due_day}th
                                                        </span>
                                                        {Number(bill.due_day) <
                                                            15 &&
                                                            bill.status ===
                                                                'upcoming' && (
                                                                <AlertCircle
                                                                    size={12}
                                                                    className="text-orange-500"
                                                                />
                                                            )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action & Price Section */}
                                    <div className="flex items-center gap-4">
                                        <div className="font-bold text-gray-900">
                                            {new Intl.NumberFormat('en-IE', {
                                                style: 'currency',
                                                currency: 'EUR',
                                            }).format(Number(bill.amount))}
                                        </div>

                                        {/* Dropdown Menu Trigger */}
                                        <div className="relative">
                                            <button
                                                onClick={() =>
                                                    setOpenMenuId(
                                                        openMenuId === bill.id
                                                            ? null
                                                            : bill.id
                                                    )
                                                }
                                                className="text-gray-400 hover:text-gray-900 p-2 rounded-full hover:bg-gray-200 transition-colors"
                                                aria-label="Options"
                                            >
                                                <Ellipsis size={20} />
                                            </button>

                                            {/* Context Menu */}
                                            {openMenuId === bill.id && (
                                                <div className="absolute right-0 top-8 bg-white shadow-xl border border-gray-100 rounded-lg py-1 z-20 w-32 animate-in fade-in zoom-in-95 duration-200">
                                                    <button
                                                        onClick={() =>
                                                            handleEditClick(
                                                                bill
                                                            )
                                                        }
                                                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 font-medium"
                                                    >
                                                        <Pencil size={14} />{' '}
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                bill.id
                                                            )
                                                        }
                                                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                                                    >
                                                        <Trash2 size={14} />{' '}
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            /* Empty State */
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
                                <Search size={48} className="mb-4 opacity-20" />
                                <p>No bills found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
