<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('api_sub_routes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('api_resource_id')->constrained('api_resources')->cascadeOnDelete();
            $table->string('sub_path'); // piemēram "main", "users", "products"
            $table->enum('method', ['GET', 'POST', 'PUT', 'DELETE'])->default('GET');
            $table->string('password')->nullable(); // parole konkrētam sub-route
            $table->boolean('is_main')->default(false); // vai šis ir galvenais /main-get route
            $table->timestamps();
            
            $table->unique(['api_resource_id', 'sub_path', 'method']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('api_sub_routes');
    }
};