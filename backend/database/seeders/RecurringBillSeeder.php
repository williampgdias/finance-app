<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RecurringBillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bills = [
            [
                'name' => 'Spark Energy',
                'due_day' => '24',
                'amount' => 150.00,
                'status' => 'upcoming',
                'logo' => '⚡',
                'theme' => '#277C78',
            ],
            [
                'name' => 'Serenity Spa',
                'due_day' => '28',
                'amount' => 40.00,
                'status' => 'upcoming',
                'logo' => '🧖‍♀️',
                'theme' => '#F2CDAC',
            ],
            [
                'name' => 'Platinum Gym',
                'due_day' => '01',
                'amount' => 65.00,
                'status' => 'paid',
                'logo' => '💪',
                'theme' => '#82C9D7',
            ],
            [
                'name' => 'Housing Rent',
                'due_day' => '05',
                'amount' => 1200.00,
                'status' => 'paid',
                'logo' => '🏠',
                'theme' => '#F2CDAC',
            ],
            [
                'name' => 'Spotify Premium',
                'due_day' => '15',
                'amount' => 12.99,
                'status' => 'paid',
                'logo' => '🎵',
                'theme' => '#626070',
            ],
        ];

        foreach ($bills as $bill) {
            \App\Models\RecurringBill::create($bill);
        }
    }
}