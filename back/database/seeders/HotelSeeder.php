<?php

namespace Database\Seeders;

use App\Models\Hotel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Picture;
use Illuminate\Database\Eloquent\Factories\Sequence;

class HotelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Hotel::factory()->count(10)->create()->each(function (Hotel $hotel) {
            Picture::factory()
                ->count(3)
                ->sequence(
                    ['index' => 0],
                    ['index' => 1],
                    ['index' => 2]
                )
                ->for($hotel)
                ->create();
        });
    }
}
