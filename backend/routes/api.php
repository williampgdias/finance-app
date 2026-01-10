<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\TransactionController;
use App\Http\Controllers\PotController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\RecurringBillController;
use App\Http\Controllers\AiController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/transactions', [TransactionController::class, 'index']);
Route::get('/pots', [PotController::class, 'index']);
Route::get('/budgets', [BudgetController::class, 'index']);
Route::get('/recurring-bills', [RecurringBillController::class, 'index']);

Route::post('/pots', [PotController::class, 'store']);
Route::post('/budgets', [BudgetController::class, 'store']);
Route::post('/ai/ask', [AiController::class, 'ask']);
Route::post('/transactions', [TransactionController::class, 'store']);

Route::put('/transactions/{id}', [TransactionController::class, 'update']);
Route::put('/pots/{id}', [PotController::class, 'update']);

Route::delete('/transactions/{id}', [TransactionController::class, 'destroy']);
Route::delete('/budgets/{id}', [BudgetController::class, 'destroy']);
Route::delete('/pots/{id}', [PotController::class, 'destroy']);