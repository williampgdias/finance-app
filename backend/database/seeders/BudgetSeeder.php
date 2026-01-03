<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BudgetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $budgets = [
            [
                'category' => 'Entertainment',
                'maximum' => 50.00,
                'current' => 15.00,
                'theme' => '#277C78',
            ],
            [
                'category' => 'Bills',
                'maximum' => 750.00,
                'current' => 150.00,
                'theme' => '#82C9D7',
            ],
            [
                'category' => 'Dining Out',
                'maximum' => 75.00,
                'current' => 75.00,
                'theme' => '#F2CDAC',
            ],
            [
                'category' => 'Personal Care',
                'maximum' => 100.00,
                'current' => 45.00,
                'theme' => '#626070',
            ],
        ];

        foreach ($budgets as $budget) {
            \App\Models\Budget::create($budget);
        }
    }
}