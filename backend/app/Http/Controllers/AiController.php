<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AiController extends Controller
{
    public function ask(Request $request)
    {
        $request->validate([
            'question' => 'required|string|max:1000',
        ]);

        $userQuestion = $request->input('question');
        $apiKey = env('GEMINI_API_KEY');

        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}";

        $systemInstruction = "You are a personal financial advisor, sarcastic but helpful. Answer concisely, directly, and give practical advice about money.";

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