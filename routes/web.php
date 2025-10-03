<?php
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\ApiResourceController;
use App\Http\Controllers\AuthController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ApiResource;
use Laravel\Socialite\Facades\Socialite;
use App\Http\Controllers\DynamicApiController;
use Illuminate\Support\Facades\Auth;
use App\Http\Middleware\VerifyCsrfToken;
use App\Http\Controllers\ImageResourceController;
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

// Public routes
Route::get('/docs', function () {
    return Inertia::render('Docx');
})->name('docs');

Route::get('/public-apis', [ApiResourceController::class, 'publicApis'])->name('public-apis');

Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegister']);
Route::post('/register', [AuthController::class, 'register']);

Route::prefix('auth')->name('auth.')->group(function () {
    Route::get('/google', [GoogleAuthController::class, 'redirect'])->name('google');
    Route::get('/google/callback', [GoogleAuthController::class, 'callback'])->name('google.callback');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/Create', [ApiResourceController::class, 'index'])->name('Create');
    Route::post('/api-resources', [ApiResourceController::class, 'store'])->name('api-resources.store');
    Route::put('/api-resources/{apiResource}', [ApiResourceController::class, 'update'])->name('api-resources.update');
    Route::delete('/api-resources/{apiResource}', [ApiResourceController::class, 'destroy'])->name('api-resources.destroy');

    Route::get('/maniapi', [ApiResourceController::class, 'userApis'])->name('maniapi');

    Route::get('/api-editor/{apiResource}', [ApiResourceController::class, 'editor'])
        ->name('api-editor')
        ->where('apiResource', '[0-9]+');

    Route::get('/api-statistics/{apiResource}', [ApiResourceController::class, 'statistics'])
        ->name('api-statistics')
        ->where('apiResource', '[0-9]+');

    Route::get('/api-resources/{apiResource}/users', [ApiResourceController::class, 'getApiUsers']);
    Route::post('/api-resources/{apiResource}/add-user', [ApiResourceController::class, 'addUserToApi']);
    Route::delete('/api-resources/{apiResource}/remove-user/{userId}', [ApiResourceController::class, 'removeUserFromApi']);
    Route::put('/api-resources/{apiResource}/update-user-role/{userId}', [ApiResourceController::class, 'updateUserRole']);

});

Route::post('/api-resources/{apiResource}/upload-image', [ApiResourceController::class, 'uploadImage'])
    ->middleware('auth');

Route::post('/images', [ImageResourceController::class, 'store']);
Route::get('/images', [ImageResourceController::class, 'index']);

Route::get('{slug}', [DynamicApiController::class, 'get'])
    ->where('slug', '[a-zA-Z0-9_-]+')
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);

// POST
Route::post('{slug}', [DynamicApiController::class, 'post'])
    ->where('slug', '[a-zA-Z0-9_-]+')
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);


     // PUT
Route::put('{slug}', [DynamicApiController::class, 'put'])
    ->where('slug', '[a-zA-Z0-9_-]+')
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);

// DELETE
Route::delete('{slug}', [DynamicApiController::class, 'delete'])
    ->where('slug', '[a-zA-Z0-9_-]+')
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);

require __DIR__ . '/auth.php';