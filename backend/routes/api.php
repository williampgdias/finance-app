<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\TransactionController;
use App\Http\Controllers\PotController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\RecurringBillController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/transactions', [TransactionController::class, 'index']);
Route::get('/pots', [PotController::class, 'index']);
Route::get('/budgets', [BudgetController::class, 'index']);
Route::get('/recurring-bills', [RecurringBillController::class, 'index']);

Route::post('/pots', [PotController::class, 'store']);
Route::post('/budgets', [BudgetController::class, 'store']);