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

            $table->string('route'); // piemēram /users
            $table->enum('visibility', ['public', 'private'])->default('private');
            $table->enum('format', ['json', 'xml', 'yaml'])->default('json');

            $table->boolean('allow_get')->default(true);
            $table->boolean('allow_post')->default(false);
            $table->boolean('allow_put')->default(false);
            $table->boolean('allow_delete')->default(false);

            $table->json('schema')->nullable(); // JSON struktūra

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('api_resources');
    }
};
