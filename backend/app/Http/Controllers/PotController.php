<?php

namespace App\Http\Controllers;

use App\Models\Pot;
use Illuminate\Http\Request;

class PotController extends Controller
{
    public function index()
    {
        return Pot::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'target' => 'required|numeric|min:0.01',
            'theme' => 'required|string',
        ]);

        // Create on DB
        $pot = Pot::create([
            'name' => $validated['name'],
            'target' => $validated['target'],
            'theme' => $validated['theme'],
            'total' => 0,
        ]);

        // Return the created pot.
        return response()->json($pot, 201);
    }
}