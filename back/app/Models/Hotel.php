<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hotel extends Model
{
    /** @use HasFactory<\Database\Factories\HotelFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'address',
        'address2',
        'zipcode',
        'city',
        'country',
        'longitude',
        'latitude',
        'description',
        'max_capacity',
        'price_per_night',
    ];

    public function pictures(): HasMany
    {
        return $this->hasMany(Picture::class);
    }
}
