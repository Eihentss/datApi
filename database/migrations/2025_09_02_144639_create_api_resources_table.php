<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('api_resources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('route');
            $table->enum('visibility', ['public', 'private'])->default('private');
            $table->enum('format', ['json', 'xml', 'yaml'])->default('json');
            $table->json('schema')->nullable(); // JSON struktūra

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('api_resources');
    }
};
