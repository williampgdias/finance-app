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
            'name' => 'required|string',
            'target' => 'required|numeric',
            'theme' => 'required|string',
        ]);

        $validated['total'] = 0;

        // Create on DB
        $pot = Pot::create($validated);
        return response()->json($pot, 201);
    }

    public function update(Request $request, $id)
    {
        $pot = Pot::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'target' => 'sometimes|numeric',
            'total' => 'sometimes|numeric',
            'theme' => 'sometimes|string',
        ]);

        $pot->update($validated);

        return response()->json($pot);
    }

    public function destroy($id)
    {
        $pot = Pot::findOrFail($id);
        $pot->delete();
        return response()->noContent();
    }
}
