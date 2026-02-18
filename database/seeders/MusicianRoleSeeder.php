<?php

namespace Database\Seeders;

use App\Models\MusicianRole;
use Illuminate\Database\Seeder;

class MusicianRoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = ['Batería', 'Guitarra', 'Bajo', 'Teclado', 'Corista', 'Voz Principal', 'Ukelele', 'Guitarra Eléctrica', 'Cajón'];

        foreach ($roles as $role) {
            MusicianRole::create(['nombre' => $role]);
        }
    }
}
