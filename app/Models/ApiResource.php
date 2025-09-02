<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApiResource extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'route',
        'visibility',
        'format',
        'allow_get',
        'allow_post',
        'allow_put',
        'allow_delete',
        'schema',
    ];

    protected $casts = [
        'schema' => 'array',
        'allow_get' => 'boolean',
        'allow_post' => 'boolean',
        'allow_put' => 'boolean',
        'allow_delete' => 'boolean',
    ];

    
}
