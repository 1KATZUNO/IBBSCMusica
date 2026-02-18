<?php

use App\Models\MusicianRole;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $newRoles = ['Ukelele', 'Guitarra Eléctrica', 'Cajón'];

        foreach ($newRoles as $role) {
            MusicianRole::firstOrCreate(['nombre' => $role]);
        }
    }

    public function down(): void
    {
        MusicianRole::whereIn('nombre', ['Ukelele', 'Guitarra Eléctrica', 'Cajón'])->delete();
    }
};
