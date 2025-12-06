<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\HotelRequest;
use App\Http\Resources\HotelCollection;
use App\Http\Resources\HotelResource;
use App\Models\Hotel;
use Illuminate\Support\Facades\Storage;

class HotelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return new HotelCollection(Hotel::with('pictures')->paginate(10));
    }

    /**
     * Get all hotels IDs.
     */
    public function getAllIds()
    {
        return response()->json(Hotel::pluck('id')->toArray());
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
        return new HotelResource($hotel->load('pictures'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(HotelRequest $request, Hotel $hotel)
    {
        $data = $request->validated();
        $hotel->update($data);
        return response()->json($hotel, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Hotel $hotel)
    {
        Storage::disk('public')->deleteDirectory('pictures/'.$hotel->id);
        $hotel->delete();
        return response()->json(null, 204);
    }
}
