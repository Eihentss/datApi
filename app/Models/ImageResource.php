<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImageResource extends Model
{
    protected $fillable = [
        'folder_name',
        'image_name',
        'path',
    ];

    protected $appends = ['url'];

    public function getUrlAttribute()
    {
        return asset('storage/' . $this->path);
    }
}
