<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ujier_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('culto_id')->constrained()->cascadeOnDelete();
            $table->string('nombre');
            $table->date('fecha');
            $table->text('notas')->nullable();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::create('ujier_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ujier_service_id')->constrained()->cascadeOnDelete();
            $table->foreignId('servidor_id')->constrained('servidores')->cascadeOnDelete();
            $table->string('zona');
            $table->text('notas')->nullable();
            $table->integer('orden')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ujier_assignments');
        Schema::dropIfExists('ujier_services');
    }
};
