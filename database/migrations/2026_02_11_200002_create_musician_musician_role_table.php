<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('musician_musician_role', function (Blueprint $table) {
            $table->id();
            $table->foreignId('musician_id')->constrained()->cascadeOnDelete();
            $table->foreignId('musician_role_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('musician_musician_role');
    }
};
