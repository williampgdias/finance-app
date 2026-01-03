<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pots = [
            [
                'name' => 'Savings',
                'target' => 2000.00,
                'total' => 159.00,
                'theme' => '#277C78',
            ],
            [
                'name' => 'Concert Ticket',
                'target' => 150.00,
                'total' => 62.00,
                'theme' => '#626070', // Roxo
            ],
            [
                'name' => 'Gift',
                'target' => 60.00,
                'total' => 40.00,
                'theme' => '#82C9D7', // Azul Claro
            ],
            [
                'name' => 'New Laptop',
                'target' => 1000.00,
                'total' => 10.00,
                'theme' => '#F2CDAC', // Bege
            ],
            [
                'name' => 'Holiday',
                'target' => 1500.00,
                'total' => 540.00,
                'theme' => '#C94736', // Vermelho
            ],
        ];

        foreach ($pots as $pot) {
            \App\Models\Pot::create($pot);
        }
    }
}