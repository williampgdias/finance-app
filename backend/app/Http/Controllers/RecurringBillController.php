<?php

namespace App\Http\Controllers;

use App\Models\RecurringBill;
use Illuminate\Http\Request;

class RecurringBillController extends Controller
{
    public function index()
    {
        return RecurringBill::orderBy('due_day', 'asc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'amount' => 'required|numeric',
            'due_day' => 'required|integer|min:1|max:31',
            'status' => 'required|in:paid,upcoming',
            'logo' => 'nullable|string'
        ]);

        $bill = RecurringBill::create($validated);
        return response()->json($bill, 201);
    }

    public function update(Request $request, $id)
    {
        $bill = RecurringBill::findOrFail($id);
        if (!$bill) return response()->json(['message' => 'Not found'], 404);

        $validated = $request->validate([
            'name' => 'required|string',
            'amount' => 'required|numeric',
            'due_day' => 'required|integer|min:1|max:31',
            'status' => 'required|in:paid,upcoming',
            'logo' => 'nullable|string'
        ]);

        $bill->update($validated);
        return response()->json($bill);
    }

    public function destroy($id)
    {
        $bill = RecurringBill::findOrFail($id);
        if ($bill) $bill->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
