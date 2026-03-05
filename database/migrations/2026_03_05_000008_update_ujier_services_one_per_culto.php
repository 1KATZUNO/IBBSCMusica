<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ujier_services', function (Blueprint $table) {
            $table->unique('culto_id');
            $table->string('hora_llegada')->nullable()->after('notas');
            $table->string('vestimenta')->nullable()->after('hora_llegada');
            $table->string('reunion_descripcion')->nullable()->after('vestimenta');
            $table->string('reunion_lugar')->nullable()->after('reunion_descripcion');
            $table->string('reunion_hora')->nullable()->after('reunion_lugar');
            $table->text('reunion_asistentes')->nullable()->after('reunion_hora');
        });
    }

    public function down(): void
    {
        Schema::table('ujier_services', function (Blueprint $table) {
            $table->dropUnique(['culto_id']);
            $table->dropColumn(['hora_llegada', 'vestimenta', 'reunion_descripcion', 'reunion_lugar', 'reunion_hora', 'reunion_asistentes']);
        });
    }
};
