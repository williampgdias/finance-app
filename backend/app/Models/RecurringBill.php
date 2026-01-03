<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecurringBill extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'amount',
        'due_day',
        'status',
        'logo',
        'theme'
    ];
}
