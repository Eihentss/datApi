<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApiUserPermission extends Model
{
    use HasFactory;

    protected $fillable = [
        'api_resource_id',
        'user_id',
        'role',
    ];

    public function apiResource()
    {
        return $this->belongsTo(ApiResource::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
