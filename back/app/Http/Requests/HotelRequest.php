<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HotelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'address2' => 'nullable|string',
            'zipcode' => 'required|string|max:20',
            'city' => 'required|string',
            'country' => 'required|string',
            'longitude' => 'required|numeric|min:-180|max:180',
            'latitude' => 'required|numeric|min:-90|max:90',
            'description' => 'nullable|string|max:5000',
            'max_capacity' => 'required|integer|min:1|max:200',
            'price_per_night' => 'required|numeric|min:0',
        ];
    }
}
