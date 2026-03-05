<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ensayos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->date('fecha');
            $table->string('hora_inicio');
            $table->string('hora_fin');
            $table->text('notas')->nullable();
            $table->timestamps();
        });

        Schema::create('ensayo_canto', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ensayo_id')->constrained()->cascadeOnDelete();
            $table->foreignId('canto_id')->constrained()->cascadeOnDelete();
            $table->integer('orden')->default(0);
        });

        Schema::create('ensayo_asistentes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ensayo_id')->constrained()->cascadeOnDelete();
            $table->string('nombre');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ensayo_asistentes');
        Schema::dropIfExists('ensayo_canto');
        Schema::dropIfExists('ensayos');
    }
};
