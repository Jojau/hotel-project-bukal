<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Hotel>
 */
class HotelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Hotel '.fake()->company(),
            'address' => fake()->streetAddress(),
            'address2' => null,
            'zipcode' => fake()->postcode(),
            'city' => fake()->city(),
            'country' => fake()->country(),
            'longitude' => fake()->longitude(),
            'latitude' => fake()->latitude(),
            'description' => fake()->paragraph(),
            'max_capacity' => rand(2, 200),
            'price_per_night' => rand(20, 200),
        ];
    }
}
