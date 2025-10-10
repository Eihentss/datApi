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
        'schema',
    ];

    protected $casts = [
        'schema' => 'array',
    ];
    public function users()
    {
        return $this->belongsToMany(User::class, 'api_user_permissions')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function subRoutes()
    {
        return $this->hasMany(ApiSubRoute::class);
    }

    public function hasUserAccess($userId, $requiredRole = null)
    {
        if ($this->user_id === $userId) {
            return true; 
        }

        $userPermission = $this->users()->where('user_id', $userId)->first();

        if (!$userPermission) {
            return false;
        }

        if ($requiredRole === null) {
            return true; 
        }

        $role = $userPermission->pivot->role;

        if ($requiredRole === 'co-owner') {
            return $role === 'co-owner';
        }

        return true; 
    }


}
