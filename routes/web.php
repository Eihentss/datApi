<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\ApiResourceController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ApiResource;
use Laravel\Socialite\Facades\Socialite;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::post('/logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect('/');
})->name('logout');

Route::get('/Create', function () {
    return Inertia::render('Create');
})->middleware(['auth', 'verified'])->name('Create');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::prefix('auth')->name('auth.')->group(function () {
    Route::get('/google', [GoogleAuthController::class, 'redirect'])->name('google');
    Route::get('/google/callback', [GoogleAuthController::class, 'callback'])->name('google.callback');
});


Route::get('/docs', function () {
    return Inertia::render('Docx');
})->name('docs');


Route::middleware(['auth'])->group(function () {
    Route::get('/Create', [ApiResourceController::class, 'index'])->name('Create');
    Route::post('/api-resources', [ApiResourceController::class, 'store'])->name('api-resources.store');
});



Route::get('/public-apis', [ApiResourceController::class, 'publicApis'])->name('public-apis');

Route::middleware(['auth'])->group(function () {
    // Rāda React komponenti ManiApi un nodod tajā lietotāja API datus
    Route::get('/maniapi', function () {
        $userId = auth()->id();

        $resources = ApiResource::where('user_id', $userId)
            ->get([
                'id',
                'route',
                'format',
                'allow_get',
                'allow_post',
                'allow_put',
                'allow_delete',
                'visibility',
                'created_at',
            ]);

        return Inertia::render('ManiApi', [
            'resources' => $resources,
        ]);
    })->name('maniapi');
});

Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegister']);
Route::post('/register', [AuthController::class, 'register']);

// Catch-all route priekš dinamiskajiem API
Route::any('/{slug}', function($slug, Request $request) {
    $resource = ApiResource::where('route', '/' . $slug)->first();

    if (!$resource) {
        abort(404, 'API not found');    
    }

        if ($resource->visibility === 'private') {
        // Ja lietotājs nav autentificēts vai nav īpašnieks
        if (!Auth::check() || Auth::id() !== $resource->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    }

    // Pārbauda vai GET ir atļauts
    if ($request->method() === 'GET' && !$resource->allow_get) {
        return response()->json(['message' => 'GET not allowed'], 403);
    }

    // Formāti
    $schema = $resource->schema ?? [];

    switch ($resource->format) {
        case 'json':
            return response()->json($schema);
        case 'xml':
            $xml = new \SimpleXMLElement('<root/>');
            array_to_xml($schema, $xml);
            return response($xml->asXML(), 200)->header('Content-Type', 'application/xml');
        case 'yaml':
            return response(\Symfony\Component\Yaml\Yaml::dump($schema), 200)
                ->header('Content-Type', 'text/yaml');
        default:
            return response()->json($schema);
    }
})->where('slug', '^(?!login|register|api|Create|docs).*$');

if (!function_exists('array_to_xml')) {
    function array_to_xml(array $data, \SimpleXMLElement &$xml) {
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                if (is_numeric($key)) $key = "item$key";
                $subnode = $xml->addChild($key);
                array_to_xml($value, $subnode);
            } else {
                if (is_numeric($key)) $key = "item$key";
                $xml->addChild($key, htmlspecialchars($value));
            }
        }
    }
}




require __DIR__.'/auth.php';
