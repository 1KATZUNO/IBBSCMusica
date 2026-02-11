<?php

namespace Database\Seeders;

use App\Models\Canto;
use App\Models\Culto;
use App\Models\Director;
use App\Models\Musician;
use App\Models\MusicianRole;
use App\Models\ProgramItemType;
use Illuminate\Database\Seeder;

class CultoSeeder extends Seeder
{
    public function run(): void
    {
        $types = ProgramItemType::all()->keyBy('slug');
        $cantos = Canto::all();
        $musicians = Musician::all()->keyBy('nombre');
        $roles = MusicianRole::all()->keyBy('nombre');
        $defaultDirector = Director::where('activo', true)->first();

        // Culto 1: Domingo AM
        $c1 = Culto::create([
            'tipo' => 'Domingo AM', 'fecha' => '2026-02-15', 'hora' => '9:00 AM',
            'color' => '#E8B931', 'director_id' => $defaultDirector?->id,
        ]);
        $this->addProgram($c1, $types, $cantos, [
            ['tipo' => 'canto', 'canto_idx' => 0],
            ['tipo' => 'canto', 'canto_idx' => 1],
            ['tipo' => 'bienvenida', 'responsable' => 'Hno. Carlos'],
            ['tipo' => 'oracion', 'responsable' => 'Hna. María'],
            ['tipo' => 'canto', 'canto_idx' => 2],
            ['tipo' => 'canto', 'canto_idx' => 3],
            ['tipo' => 'canto', 'canto_idx' => 4],
            ['tipo' => 'anuncios', 'responsable' => 'Hno. Pedro'],
            ['tipo' => 'leccion', 'responsable' => 'Pastor Juan', 'titulo' => 'La fe que transforma'],
            ['tipo' => 'ofrendas', 'responsable' => 'Hno. Luis'],
            ['tipo' => 'canto', 'canto_idx' => 5],
        ]);
        $this->addMusicians($c1, $musicians, $roles, [
            'David' => 'Guitarra', 'Ana' => 'Teclado', 'Carlos' => 'Bajo', 'María' => 'Voz Principal',
        ]);

        // Culto 2: Miércoles
        $c2 = Culto::create([
            'tipo' => 'Miércoles', 'fecha' => '2026-02-18', 'hora' => '7:00 PM',
            'color' => '#6B8F71', 'director_id' => $defaultDirector?->id,
        ]);
        $this->addProgram($c2, $types, $cantos, [
            ['tipo' => 'canto', 'canto_idx' => 6],
            ['tipo' => 'canto', 'canto_idx' => 7],
            ['tipo' => 'oracion', 'responsable' => 'Hno. Roberto'],
            ['tipo' => 'canto', 'canto_idx' => 3],
            ['tipo' => 'leccion', 'responsable' => 'Pastor Juan', 'titulo' => 'Estudio bíblico: Romanos 8'],
            ['tipo' => 'ofrendas', 'responsable' => 'Hna. Elena'],
            ['tipo' => 'canto', 'canto_idx' => 0],
        ]);
        $this->addMusicians($c2, $musicians, $roles, [
            'David' => 'Guitarra', 'Elena' => 'Teclado',
        ]);

        // Culto 3: Viernes
        $c3 = Culto::create([
            'tipo' => 'Viernes', 'fecha' => '2026-02-20', 'hora' => '7:30 PM',
            'color' => '#B56357', 'director_id' => $defaultDirector?->id,
        ]);
        $this->addProgram($c3, $types, $cantos, [
            ['tipo' => 'canto', 'canto_idx' => 1],
            ['tipo' => 'canto', 'canto_idx' => 4],
            ['tipo' => 'canto', 'canto_idx' => 5],
            ['tipo' => 'bienvenida', 'responsable' => 'Hna. Sofía'],
            ['tipo' => 'oracion', 'responsable' => 'Hno. Marcos'],
            ['tipo' => 'canto', 'canto_idx' => 2],
            ['tipo' => 'canto', 'canto_idx' => 6],
            ['tipo' => 'anuncios', 'responsable' => 'Hno. Pedro'],
            ['tipo' => 'leccion', 'responsable' => 'Hna. Laura', 'titulo' => 'Jóvenes con propósito'],
            ['tipo' => 'ofrendas', 'responsable' => 'Hno. Carlos'],
            ['tipo' => 'canto', 'canto_idx' => 7],
        ]);
        $this->addMusicians($c3, $musicians, $roles, [
            'Ana' => 'Guitarra', 'Roberto' => 'Bajo', 'Sofía' => 'Voz Principal', 'David' => 'Teclado',
        ]);

        // Culto 4: Domingo PM
        $c4 = Culto::create([
            'tipo' => 'Domingo PM', 'fecha' => '2026-02-15', 'hora' => '5:00 PM',
            'color' => '#7B6B9D', 'director_id' => $defaultDirector?->id,
        ]);
        $this->addProgram($c4, $types, $cantos, [
            ['tipo' => 'canto', 'canto_idx' => 3],
            ['tipo' => 'canto', 'canto_idx' => 7],
            ['tipo' => 'oracion', 'responsable' => 'Hno. Felipe'],
            ['tipo' => 'canto', 'canto_idx' => 0],
            ['tipo' => 'leccion', 'responsable' => 'Pastor Juan', 'titulo' => 'Adoración verdadera'],
            ['tipo' => 'ofrendas', 'responsable' => 'Hna. María'],
            ['tipo' => 'canto', 'canto_idx' => 5],
        ]);
        $this->addMusicians($c4, $musicians, $roles, [
            'Carlos' => 'Guitarra', 'María' => 'Voz Principal', 'Luis' => 'Batería',
        ]);
    }

    private function addProgram($culto, $types, $cantos, $items): void
    {
        foreach ($items as $i => $item) {
            $culto->programItems()->create([
                'program_item_type_id' => $types[$item['tipo']]->id,
                'orden' => $i + 1,
                'canto_id' => isset($item['canto_idx']) ? $cantos[$item['canto_idx']]->id : null,
                'responsable' => $item['responsable'] ?? null,
                'titulo' => $item['titulo'] ?? null,
            ]);
        }
    }

    private function addMusicians($culto, $musicians, $roles, $assignments): void
    {
        foreach ($assignments as $musicianName => $roleName) {
            $culto->musicians()->attach($musicians[$musicianName]->id, [
                'musician_role_id' => $roles[$roleName]->id,
            ]);
        }
    }
}
