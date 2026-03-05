<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ujier_assignments', function (Blueprint $table) {
            $table->dropForeign(['servidor_id']);
            $table->dropColumn(['servidor_id', 'zona', 'notas']);
            $table->string('nombre')->after('ujier_service_id');
            $table->text('responsabilidades')->after('nombre');
            $table->text('observaciones')->nullable()->after('responsabilidades');
            $table->text('detalles')->nullable()->after('observaciones');
        });
    }

    public function down(): void
    {
        Schema::table('ujier_assignments', function (Blueprint $table) {
            $table->dropColumn(['nombre', 'responsabilidades', 'observaciones', 'detalles']);
            $table->foreignId('servidor_id')->constrained('servidores')->cascadeOnDelete();
            $table->string('zona');
            $table->text('notas')->nullable();
        });
    }
};
