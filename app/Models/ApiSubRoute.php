<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApiSubRoute extends Model
{
    use HasFactory;

    protected $fillable = [
        'api_resource_id',
        'sub_path',
        'method',
        'password',
        'is_main',
    ];

    protected $casts = [
        'is_main' => 'boolean',
    ];

    public function apiResource()
    {
        return $this->belongsTo(ApiResource::class);
    }
    
    // Atgriež pilno route ceļu
    public function getFullRouteAttribute()
    {
        return $this->apiResource->route . '/' . $this->sub_path . '-' . strtolower($this->method);
    }
}