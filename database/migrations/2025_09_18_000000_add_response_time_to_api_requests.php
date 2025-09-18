<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('api_requests', function (Blueprint $table) {
            $table->integer('response_time_ms')->nullable()->after('endpoint');
        });
    }
    
    public function down(): void {
        Schema::table('api_requests', function (Blueprint $table) {
            $table->dropColumn('response_time_ms');
        });
    }
    
};
 