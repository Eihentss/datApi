<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('api_user_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('api_resource_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('role', ['admin', 'co-owner', 'owner'])->default('admin');
            $table->timestamps();
            
            $table->unique(['api_resource_id', 'user_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('api_user_permissions');
    }
};