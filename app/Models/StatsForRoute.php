<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StatsForRoute extends Model
{
    protected $table = 'statsforroute';

    protected $fillable = [
        'api_resource_id',
        'total_requests',
        'get_requests',
        'post_requests',
        'put_requests',
        'delete_requests',
    ];

    public function apiResource()
    {
        return $this->belongsTo(ApiResource::class);
    }
}
