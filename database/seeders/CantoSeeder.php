<?php

namespace Database\Seeders;

use App\Models\Canto;
use Illuminate\Database\Seeder;

class CantoSeeder extends Seeder
{
    public function run(): void
    {
        $cantos = [
            ['nombre' => 'Grande es tu fidelidad', 'youtube_url' => 'https://youtube.com/watch?v=example1'],
            ['nombre' => 'Tu amor no se rinde', 'youtube_url' => 'https://youtube.com/watch?v=example2'],
            ['nombre' => 'Aquí estoy', 'youtube_url' => 'https://youtube.com/watch?v=example3'],
            ['nombre' => 'Renuévame', 'youtube_url' => 'https://youtube.com/watch?v=example4'],
            ['nombre' => 'Al que está sentado en el trono', 'youtube_url' => 'https://youtube.com/watch?v=example5'],
            ['nombre' => 'Santo, Santo, Santo', 'youtube_url' => 'https://youtube.com/watch?v=example6'],
            ['nombre' => 'Dios incomparable', 'youtube_url' => 'https://youtube.com/watch?v=example7'],
            ['nombre' => 'Gracia sublime', 'youtube_url' => 'https://youtube.com/watch?v=example8'],
        ];

        foreach ($cantos as $canto) {
            Canto::create($canto);
        }
    }
}
