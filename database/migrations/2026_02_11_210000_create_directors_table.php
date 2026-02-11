<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('directors', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        // Add director_id and drop director_name from cultos
        Schema::table('cultos', function (Blueprint $table) {
            $table->foreignId('director_id')->nullable()->after('color');
            $table->dropColumn('director_name');
        });
    }

    public function down(): void
    {
        Schema::table('cultos', function (Blueprint $table) {
            $table->dropColumn('director_id');
            $table->string('director_name')->nullable();
        });
        Schema::dropIfExists('directors');
    }
};
