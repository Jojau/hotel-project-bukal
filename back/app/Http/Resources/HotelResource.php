<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HotelResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'address' => $this->address,
            'address2' => $this->address2,
            'zipcode' => $this->zipcode,
            'city' => $this->city,
            'country' => $this->country,
            'longitude' => $this->longitude,
            'latitude' => $this->latitude,
            'description' => $this->description,
            'max_capacity' => $this->max_capacity,
            'price_per_night' => $this->price_per_night,
            'pictures' => PictureResource::collection($this->pictures),
        ];
    }
}
