<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('api_errors', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('api_resource_id');
            $table->string('message');
            $table->string('method')->nullable(); // GET, POST, utt.
            $table->string('endpoint')->nullable(); // /api/users utt.
            $table->integer('status_code')->nullable(); // piem. 500, 404
            $table->timestamps();

            $table->foreign('api_resource_id')->references('id')->on('api_resources')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('api_errors');
    }
};
