<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

use App\Models\Transaction;
use App\Models\Budget;
use App\Models\Pot;
use App\Models\RecurringBill;

class AiController extends Controller
{
    public function ask(Request $request)
    {
        $request->validate([
            'question' => 'required|string|max:1000',
        ]);

        $userQuestion = $request->input('question');
        $apiKey = env('GEMINI_API_KEY');

        $transactions = Transaction::latest()->take(30)->get();
        $balance = Transaction::sum('amount');

        $budgets = Budget::all();
        $pots = Pot::all();
        $recurring = RecurringBill::where('status', 'upcoming')->get();

        $context = "HERE IS THE USER'S FINANCIAL DATA:\n";
        $context .= "- Current Balance: " . number_format($balance, 2) . " EUR\n";

        $context .= "- Recent Transactions: \n";
        foreach ($transactions as $t) {
            $context .= " * {$t->name}: {$t->amount} EUR ({$t->date})\n";
        }

        $context .= "- Budgets: \n";
        foreach ($budgets as $b) {
            $remaining = $b->maximum - $b->current;
            $context .= " * {$b->category}: Spent {$b->current}/{$b->maximum} (Remaining: {$remaining})\n";
        }

        $context .= "- Upcoming Bills (Must Pay): \n";
        foreach ($recurring as $r) {
            $context .= "  * {$r->name}: {$r->amount} EUR (Due day: {$r->due_day})\n";
        }

        $context .= "- Savings Pots: \n";
        foreach ($pots as $p) {
            $context .= "  * {$p->name}: {$p->total} EUR (Target: {$p->target})\n";
        }

        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";

        $systemInstruction = "You are a personal financial advisor, sarcastic but helpful.
        Answer concisely, directly, and give practical advice about money.
        ALWAYS use the provided financial data to answer. If the user asks if they can afford something, check their balance and bills first.

        $context";

        $payload = [
            "system_instruction" => [
                "parts" => [["text" => $systemInstruction]]
            ],
            "contents" => [
                [
                    "parts" => [["text" => $userQuestion]]
                ]
            ]
        ];

        $response = Http::withHeaders([
            'Content-Type' => 'application/json'
        ])->post($url, $payload);

        $result = $response->json();

        if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
            $answer = $result['candidates'][0]['content']['parts'][0]['text'];
        } else {
            $errorMsg = $result['error']['message'] ?? 'Unknown error in the Google API.';
            return response()->json(['error' => $errorMsg], 500);
        }

        return response()->json([
            'message' => $answer
        ]);
    }
}
