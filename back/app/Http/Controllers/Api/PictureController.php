<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePictureRequest;
use App\Models\Picture;
use Illuminate\Http\Request;

class PictureController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePictureRequest $request)
    {
        $data = $request->validated();

        $file_path = asset('storage/'.$data['picture']->store('pictures/'.$request->hotel_id, 'public'));
        $file_size = $data['picture']->getSize();

        $picture = new Picture();
        $picture->fill([
            'file_path' => $file_path,
            'file_size' => $file_size,
            'index' => $data['index'],
        ]);
        $picture->hotel()->associate($data['hotel_id']);
        $picture->save();

        return response()->json($picture, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Picture $picture)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Picture $picture)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Picture $picture)
    {
        //
    }
}
