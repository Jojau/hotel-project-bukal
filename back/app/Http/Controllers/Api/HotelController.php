<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\HotelRequest;
use App\Models\Hotel;
use Illuminate\Http\Request;

class HotelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Hotel::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(HotelRequest $request)
    {
        $data = $request->validated();
        $hotel = Hotel::create($data);
        return response()->json($hotel, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Hotel $hotel)
    {
        return $hotel;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Hotel $hotel)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Hotel $hotel)
    {
        $hotel->delete();
        return response()->json(null, 204);
    }
}
