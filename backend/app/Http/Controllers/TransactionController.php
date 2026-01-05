<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index()
    {
        return Transaction::latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'amount' => 'required|numeric',
            'category' => 'required|string',
            'date' => 'required|date',
            'recurring' => 'boolean'
        ]);

        $validated['avatar'] = 'https://ui-avatars.com/api/?name=' . urlencode($validated['name']) . '&background=random';

        $transaction = Transaction::create($validated);

        return response()->json($transaction, 201);
    }
}