'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ArrowUpDown,
    PieChart,
    PiggyBank,
    ReceiptText,
    ChevronLeft,
    ChevronRight,
    Sparkles,
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    const [isMinimized, setIsMinimized] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsMinimized(true);
                setIsMobile(true);
            } else {
                setIsMobile(false);
                setIsMinimized(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const menuItems = [
        { name: 'Overview', href: '/', icon: LayoutDashboard },
        { name: 'Transactions', href: '/transactions', icon: ArrowUpDown },
        { name: 'Budgets', href: '/budgets', icon: PieChart },
        { name: 'Pots', href: '/pots', icon: PiggyBank },
        {
            name: 'Recurring Bills',
            href: '/recurring-bills',
            icon: ReceiptText,
        },
        {
            name: 'Advisor',
            href: '/advisor',
            icon: Sparkles,
        },
    ];

    const toggleSidebar = () => {
        setIsMinimized(!isMinimized);
    };

    return (
        <aside
            className={`
                bg-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out
                ${
                    isMinimized ? 'w-20' : 'w-72'
                } sticky top-0 h-screen z-50 shrink-0
            `}
        >
            {/* Logo Area */}
            <div
                className={`h-24 flex items-center ${
                    isMinimized ? 'justify-center' : 'px-8'
                }`}
            >
                {isMinimized ? (
                    <span className="text-xl font-bold">F.</span>
                ) : (
                    <h1 className="text-3xl font-bold tracking-wide">
                        finance
                    </h1>
                )}
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                                flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200
                                ${
                                    isActive
                                        ? 'bg-white text-gray-900 font-bold border-l-4 border-green-500'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }
                                ${isMinimized ? 'justify-center' : ''}
                            `}
                        >
                            <item.icon size={20} className="shrink-0" />

                            <span
                                className={`
                                whitespace-nowrap overflow-hidden transition-all duration-300
                                ${
                                    isMinimized
                                        ? 'w-0 opacity-0 hidden'
                                        : 'w-auto opacity-100 block'
                                }
                            `}
                            >
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Minimize Menu Button */}
            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={toggleSidebar}
                    className={`
                        flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 w-full p-2 rounded-lg hover:bg-gray-800
                        ${isMinimized ? 'justify-center' : ''}
                    `}
                >
                    {isMinimized ? (
                        <ChevronRight size={20} />
                    ) : (
                        <ChevronLeft size={20} />
                    )}

                    <span
                        className={`
                        whitespace-nowrap overflow-hidden transition-all duration-300
                        ${
                            isMinimized
                                ? 'w-0 opacity-0 hidden'
                                : 'w-auto opacity-100 block'
                        }
                    `}
                    >
                        Minimize Menu
                    </span>
                </button>
            </div>
        </aside>
    );
}
