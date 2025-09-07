<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        // Izslēgt visus API maršrutus no CSRF pārbaudes
        'tests',
        'tests/*',
        // Vai arī visus slug maršrutus (uzmanīgi ar šo!)
        '*',
        // Specifiski jebkurš vienreizīgs slug
        '[a-zA-Z0-9_-]+',
    ];
}