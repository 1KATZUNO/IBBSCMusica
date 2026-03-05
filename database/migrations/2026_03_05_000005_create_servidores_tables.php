<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Servidores (volunteers)
        Schema::create('servidores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $table->string('nombre');
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        // Servidor roles
        Schema::create('servidor_roles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $table->string('nombre');
            $table->timestamps();
        });

        // Pivot: servidor <-> servidor_role (max 4 enforced in app)
        Schema::create('servidor_servidor_role', function (Blueprint $table) {
            $table->id();
            $table->foreignId('servidor_id')->constrained('servidores')->cascadeOnDelete();
            $table->foreignId('servidor_role_id')->constrained('servidor_roles')->cascadeOnDelete();
        });

        // Seed default servidor roles for existing organizations
        $orgs = \Illuminate\Support\Facades\DB::table('organizations')->pluck('id');
        $defaultRoles = ['Predicador', 'Lector', 'Orador', 'Ujier'];
        foreach ($orgs as $orgId) {
            foreach ($defaultRoles as $role) {
                \Illuminate\Support\Facades\DB::table('servidor_roles')->insert([
                    'organization_id' => $orgId,
                    'nombre' => $role,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('servidor_servidor_role');
        Schema::dropIfExists('servidor_roles');
        Schema::dropIfExists('servidores');
    }
};
