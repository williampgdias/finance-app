<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Transaction;
use Carbon\Carbon;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Transaction::truncate();

        $transactions = [
            [
                'name' => 'Emma Richardson',
                'category' => 'General',
                'amount' => 75.50,
                'date' => Carbon::parse('2024-08-19'),
                'is_income' => true,
                'avatar' => 'https://i.pravatar.cc/150?u=emma', // Imagem fake
                'is_recurring' => false,
            ],
            [
                'name' => 'Savory Bites Bistro',
                'category' => 'Dining Out',
                'amount' => 55.50,
                'date' => Carbon::parse('2024-08-19'),
                'is_income' => false,
                'avatar' => null,
                'is_recurring' => false,
            ],
            [
                'name' => 'Daniel Carter',
                'category' => 'General',
                'amount' => 42.30,
                'date' => Carbon::parse('2024-08-18'),
                'is_income' => false,
                'avatar' => 'https://i.pravatar.cc/150?u=daniel',
                'is_recurring' => false,
            ],
            [
                'name' => 'Sun Park',
                'category' => 'General',
                'amount' => 120.00,
                'date' => Carbon::parse('2024-08-17'),
                'is_income' => true,
                'avatar' => 'https://i.pravatar.cc/150?u=sun',
                'is_recurring' => false,
            ],
            [
                'name' => 'Urban Services Hub',
                'category' => 'General',
                'amount' => 65.00,
                'date' => Carbon::parse('2024-08-17'),
                'is_income' => false,
                'avatar' => null,
                'is_recurring' => false,
            ],
        ];

        foreach ($transactions as $transaction) {
            Transaction::create($transaction);
        }
    }
}