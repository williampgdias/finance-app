'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ArrowUpDown,
    PieChart,
    PiggyBank,
    ReceiptText,
    ChevronLeft,
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Overview', href: '/', icon: LayoutDashboard },
        { name: 'Transactions', href: '/transaction', icon: ArrowUpDown },
        { name: 'Budgets', href: '/budgets', icon: PieChart },
        { name: 'Pots', href: '/pots', icon: PiggyBank },
        {
            name: 'Recurring Bills',
            href: '/recurring-bills',
            icon: ReceiptText,
        },
    ];

    return (
        <aside className="w-75 bg-gray-900 min-h-screen text-white flex flex-col rounded-r-2xl">
            {/* Logo */}
            <div className="p-8">
                <h1 className="text-3xl font-bold tracking-wide">finance</h1>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-200 ${
                                isActive
                                    ? 'bg-white text-gray-900 font-bold border-l-4 border-green-500'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <item.icon size={20} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Minimize Menu */}
            <div className="p-8">
                <button className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                    <ChevronLeft size={20} />
                    <span>Minimize Menu</span>
                </button>
            </div>
        </aside>
    );
}
