<?php

namespace Database\Seeders;

use App\Models\ProgramItemType;
use Illuminate\Database\Seeder;

class ProgramItemTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['slug' => 'canto', 'label' => 'Canto', 'emoji' => '🎵', 'bg_color' => 'rgba(232,185,49,0.1)', 'is_system' => true, 'requires_canto' => true],
            ['slug' => 'bienvenida', 'label' => 'Bienvenida', 'emoji' => '👋', 'bg_color' => 'rgba(107,143,113,0.1)', 'is_system' => true, 'requires_canto' => false],
            ['slug' => 'oracion', 'label' => 'Oración', 'emoji' => '🙏', 'bg_color' => 'rgba(181,99,87,0.1)', 'is_system' => true, 'requires_canto' => false],
            ['slug' => 'anuncios', 'label' => 'Anuncios', 'emoji' => '📢', 'bg_color' => 'rgba(123,107,157,0.1)', 'is_system' => true, 'requires_canto' => false],
            ['slug' => 'leccion', 'label' => 'Lección / Prédica', 'emoji' => '📖', 'bg_color' => 'rgba(92,134,163,0.1)', 'is_system' => true, 'requires_canto' => false],
            ['slug' => 'ofrendas', 'label' => 'Ofrendas', 'emoji' => '💛', 'bg_color' => 'rgba(232,185,49,0.1)', 'is_system' => true, 'requires_canto' => false],
        ];

        foreach ($types as $type) {
            ProgramItemType::create($type);
        }
    }
}
