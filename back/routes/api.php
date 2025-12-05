<?php

use App\Http\Controllers\Api\HotelController;
use App\Http\Controllers\Api\PictureController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('hotel', HotelController::class);
Route::apiResource('picture', PictureController::class);
