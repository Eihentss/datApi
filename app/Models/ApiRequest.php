<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApiRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'api_resource_id',
        'method',
        'endpoint',
        'response_time_ms',
    ];

    // Relācija uz API resursu
    public function apiResource()
    {
        return $this->belongsTo(ApiResource::class);
    }
}
