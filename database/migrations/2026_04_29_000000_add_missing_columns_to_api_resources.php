<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('api_resources', function (Blueprint $table) {
            $table->boolean('allow_get')->default(true)->after('format');
            $table->boolean('allow_post')->default(false)->after('allow_get');
            $table->boolean('allow_put')->default(false)->after('allow_post');
            $table->boolean('allow_delete')->default(false)->after('allow_put');
            $table->string('password')->nullable()->after('allow_delete');
        });
    }

    public function down(): void
    {
        Schema::table('api_resources', function (Blueprint $table) {
            $table->dropColumn(['allow_get', 'allow_post', 'allow_put', 'allow_delete', 'password']);
        });
    }
};
