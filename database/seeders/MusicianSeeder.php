<?php

namespace Database\Seeders;

use App\Models\Musician;
use App\Models\MusicianRole;
use Illuminate\Database\Seeder;

class MusicianSeeder extends Seeder
{
    public function run(): void
    {
        $roles = MusicianRole::all()->keyBy('nombre');

        $musicians = [
            'David' => ['Guitarra', 'Teclado'],
            'Ana' => ['Teclado', 'Guitarra'],
            'Carlos' => ['Bajo', 'Guitarra'],
            'María' => ['Voz Principal', 'Corista'],
            'Roberto' => ['Bajo'],
            'Sofía' => ['Voz Principal'],
            'Elena' => ['Teclado'],
            'Luis' => ['Batería'],
        ];

        foreach ($musicians as $name => $roleNames) {
            $musician = Musician::create(['nombre' => $name, 'activo' => true]);
            $roleIds = collect($roleNames)->map(fn($r) => $roles[$r]->id);
            $musician->roles()->attach($roleIds);
        }
    }
}
