<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApiError extends Model
{
    protected $fillable = [
        'api_resource_id',
        'message',
        'method',
        'endpoint',
        'status_code',
    ];

    public function apiResource()
    {
        return $this->belongsTo(ApiResource::class);
    }
}
