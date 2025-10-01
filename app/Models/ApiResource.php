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
