<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('program_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('culto_id')->constrained()->cascadeOnDelete();
            $table->foreignId('program_item_type_id')->constrained()->cascadeOnDelete();
            $table->integer('orden');
            $table->foreignId('canto_id')->nullable()->constrained()->nullOnDelete();
            $table->string('responsable')->nullable();
            $table->string('titulo')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('program_items');
    }
};
