'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Budget {
    id: number;
    category: string;
    maximum: number;
    current: number;
    theme: string;
}

export default function HomeBudgets() {
    const [budgets, setBudgets] = useState<Budget[]>([]);

    useEffect(() => {
        // Busca os budgets diretamente para mostrar no overview
        const fetchBudgets = async () => {
            try {
                const response = await axios.get(
                    `${
                        process.env.NEXT_PUBLIC_API_URL ||
                        'http://localhost/api'
                    }/budgets`
                );
                // Pega apenas os 4 primeiros para não poluir a home
                setBudgets(response.data.slice(0, 4));
            } catch (error) {
                console.error('Erro ao carregar budgets home', error);
            }
        };
        fetchBudgets();
    }, []);

    if (budgets.length === 0) {
        return (
            <div className="bg-white p-8 rounded-xl shadow-sm h-full flex items-center justify-center">
                <p className="text-gray-400">No budgets created yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Budgets</h2>
                <Link
                    href="/budgets"
                    className="text-gray-500 hover:text-gray-900 text-sm flex items-center gap-1 transition-colors"
                >
                    See Details <ChevronRight size={16} />
                </Link>
            </div>

            <div className="flex flex-col gap-6 flex-1">
                {budgets.map((budget) => (
                    <div key={budget.id} className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-bold text-gray-700">
                                {budget.category}
                            </span>
                            <span className="text-gray-500">
                                €{budget.current}{' '}
                                <span className="text-xs">
                                    / €{budget.maximum}
                                </span>
                            </span>
                        </div>
                        {/* Barra de Progresso Simples */}
                        <div className="w-full h-3 bg-gray-100 rounded-full">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${Math.min(
                                        (budget.current / budget.maximum) * 100,
                                        100
                                    )}%`,
                                    backgroundColor: budget.theme,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
