<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'amount',
        'date',
        'avatar',
        'is_income',
        'is_recurring',
    ];
}