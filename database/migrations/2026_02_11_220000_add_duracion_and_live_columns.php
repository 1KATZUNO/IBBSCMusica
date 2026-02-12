<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('program_items', function (Blueprint $table) {
            $table->unsignedSmallInteger('duracion')->nullable()->after('orden');
            $table->timestamp('completed_at')->nullable()->after('titulo');
        });

        Schema::table('cultos', function (Blueprint $table) {
            $table->timestamp('started_at')->nullable()->after('director_id');
            $table->timestamp('completed_all_at')->nullable()->after('started_at');
        });
    }

    public function down(): void
    {
        Schema::table('program_items', function (Blueprint $table) {
            $table->dropColumn(['duracion', 'completed_at']);
        });

        Schema::table('cultos', function (Blueprint $table) {
            $table->dropColumn(['started_at', 'completed_all_at']);
        });
    }
};
