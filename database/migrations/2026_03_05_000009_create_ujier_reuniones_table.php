<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ujier_reuniones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ujier_service_id')->constrained()->cascadeOnDelete();
            $table->string('descripcion');
            $table->string('hora')->nullable();
            $table->string('lugar')->nullable();
            $table->text('asistentes')->nullable();
            $table->integer('orden')->default(0);
            $table->timestamps();
        });

        // Remove old reunion columns from ujier_services
        Schema::table('ujier_services', function (Blueprint $table) {
            $table->dropColumn(['reunion_descripcion', 'reunion_lugar', 'reunion_hora', 'reunion_asistentes']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ujier_reuniones');

        Schema::table('ujier_services', function (Blueprint $table) {
            $table->string('reunion_descripcion')->nullable();
            $table->string('reunion_lugar')->nullable();
            $table->string('reunion_hora')->nullable();
            $table->text('reunion_asistentes')->nullable();
        });
    }
};
