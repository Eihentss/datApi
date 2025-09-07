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

Route::put('/api-resources/{apiResource}', [ApiResourceController::class, 'update']);
Route::get('/public-apis', [ApiResourceController::class, 'publicApis'])->name('public-apis');

Route::middleware(['auth'])->group(function () {
    Route::get('/maniapi', [\App\Http\Controllers\ApiResourceController::class, 'userApis'])
        ->name('maniapi');
});

Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', [AuthController::class, 'showRegister']);
Route::post('/register', [AuthController::class, 'register']);


Route::any('{slug}', [DynamicApiController::class, 'handle'])
    ->where('slug', '[a-zA-Z0-9_-]+')
    ->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);

require __DIR__.'/auth.php';