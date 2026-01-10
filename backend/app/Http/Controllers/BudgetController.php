<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    public function index()
    {

        $budgets = Budget::all();

        foreach ($budgets as $budget) {
            $spent = \App\Models\Transaction::where('category', $budget->category)
                ->where('amount', '<', 0)
                ->sum('amount');

            $budget->current = abs($spent);
        }

        return $budgets;
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

    public function destroy($id)
    {
        $budget = Budget::findOrFail($id);
        $budget->delete();

        return response()->noContent();
    }

    public function update(Request $request, $id)
    {
        $budget = Budget::findOrFail($id);

        if (!$budget) {
            return response()->json(['message' => 'Budget not found'], 404);
        }

        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'maximum' => 'required|numeric',
            'theme' => 'nullable|string',
        ]);

        $budget->update($validated);

        return response()->json($budget);
    }
}