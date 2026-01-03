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
}