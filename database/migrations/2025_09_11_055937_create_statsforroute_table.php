<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('statsforroute', function (Blueprint $table) {
            $table->id();
            $table->foreignId('api_resource_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('total_requests')->default(0);
            $table->unsignedBigInteger('get_requests')->default(0);
            $table->unsignedBigInteger('post_requests')->default(0);
            $table->unsignedBigInteger('put_requests')->default(0);
            $table->unsignedBigInteger('delete_requests')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('statsforroute');
    }
};
