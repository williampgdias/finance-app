<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    public function index()
    {
        return Budget::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string',
            'maximum' => 'required|numeric',
            'theme' => 'required|string',
        ]);

        $budget = Budget::create([
            'category' => $validated['category'],
            'maximum' => $validated['maximum'],
            'theme' => $validated['theme'],
            'current' => 0,
        ]);

        return response()->json($budget, 201);
    }
}