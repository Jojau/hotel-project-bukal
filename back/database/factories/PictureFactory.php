<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Picture>
 */
class PictureFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $collection = [
            'https://images.unsplash.com/photo-1618773928121-c32242e63f39',
            'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa',
            'https://images.unsplash.com/photo-1549294413-26f195200c16',
            'https://images.unsplash.com/photo-1445019980597-93fa8acb246c',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945',
            'https://images.unsplash.com/photo-1611892440504-42a792e24d32',
            'https://images.unsplash.com/photo-1455587734955-081b22074882',
            'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a',
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
            'https://images.unsplash.com/photo-1495365200479-c4ed1d35e1aa',
            'https://images.unsplash.com/photo-1445991842772-097fea258e7b',
            'https://images.unsplash.com/photo-1584132967334-10e028bd69f7',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd',
            'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4',
            'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0',
            'https://images.unsplash.com/photo-1564501049412-61c2a3083791',
            'https://images.unsplash.com/photo-1506059612708-99d6c258160e',
            'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8'
        ];

        return [
            'file_path' => $collection[array_rand($collection)],
            'file_size' => 0,
            'index' => 0
        ];
    }
}
