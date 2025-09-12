<?php
namespace App\Http\Controllers;

use App\Models\ApiResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Models\StatsForRoute;
use App\Models\ApiError;

class ApiResourceController extends Controller
{
    public function index()
    {
        $resources = ApiResource::where('user_id', auth()->id())->get();
        return Inertia::render('Create', [
            'resources' => $resources,
        ]);
    }

    public function statistics(Request $request, ApiResource $apiResource)
    {
        if ($apiResource->user_id !== $request->user()->id) {
            return redirect()->route('maniapi')->with('error', 'Nav atļaujas skatīt šā API statistiku!');
        }
    
        $stats = StatsForRoute::where('api_resource_id', $apiResource->id)->first();
    
        $errors = ApiError::where('api_resource_id', $apiResource->id)
            ->latest()
            ->take(50) // pēdējās 50 kļūdas
            ->get()
            ->map(fn($err) => [
                'date' => $err->created_at->format('Y-m-d H:i:s'),
                'message' => $err->message,
                'method' => $err->method,
                'endpoint' => $err->endpoint,
                'status_code' => $err->status_code,
            ]);
    
        return Inertia::render('ApiStatistics', [
            'statistics' => [
                'requests' => [], // ja nākotnē gribi grafikus pa dienām
                'errors' => $errors,
                'total_requests' => $stats->total_requests ?? 0,
                'get_requests' => $stats->get_requests ?? 0,
                'post_requests' => $stats->post_requests ?? 0,
                'put_requests' => $stats->put_requests ?? 0,
                'delete_requests' => $stats->delete_requests ?? 0,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'route' => 'required|string|max:255',
            'format' => 'required|in:json,xml,yaml',
            'visibility' => 'required|in:public,private',
            'password' => 'nullable|string|min:4',
        ]);

        $route = $request->input('route');

        if (str_starts_with($route, '/api')) {
            return response()->json([
                'message' => "Route nevar sākties ar '/api'!"
            ], 422);
        }

        $existingRoutes = collect(\Route::getRoutes())->map->uri->toArray();
        if (in_array(ltrim($route, '/'), $existingRoutes)) {
            return response()->json([
                'message' => 'Šāds route jau eksistē sistēmā!'
            ], 422);
        }

        if (ApiResource::where('route', $route)->exists()) {
            return response()->json([
                'message' => 'Šāds route jau eksistē datubāzē!'
            ], 422);
        }

        $schema = $request->input('schema');
        if (is_string($schema)) {
            $schema = json_decode($schema, true);
        }

        $resource = new ApiResource();
        $resource->user_id = $request->user()->id;
        $resource->route = $route;
        $resource->format = $request->input('format');
        $resource->visibility = $request->input('visibility');
        $resource->allow_get = $request->boolean('allow_get');
        $resource->allow_post = $request->boolean('allow_post');
        $resource->allow_put = $request->boolean('allow_put');
        $resource->allow_delete = $request->boolean('allow_delete');
        $resource->schema = $schema;

        if ($resource->visibility === 'private') {
            if (!$request->filled('password')) {
                return response()->json([
                    'message' => 'Privātam API nepieciešama parole!'
                ], 422);
            }
            $resource->password = Hash::make($request->input('password'));
        }

        $resource->save();

        return response()->json([
            'message' => 'API veiksmīgi izveidots!',
            'resource' => $resource
        ]);
    }

    public function update(Request $request, ApiResource $apiResource)
{
    if ($apiResource->user_id !== $request->user()->id) {
        return response()->json([
            'message' => 'Nav atļaujas editēt šo API!'
        ], 403);
    }

    $request->validate([
        'route' => 'required|string|max:255',
        'format' => 'required|in:json,xml,yaml',
        'visibility' => 'required|in:public,private',
        'password' => 'nullable|string|min:4',
    ]);

    $route = $request->input('route');

    if (str_starts_with($route, '/api')) {
        return response()->json([
            'message' => "Route nevar sākties ar '/api'!"
        ], 422);
    }

    $existingRoutes = collect(\Route::getRoutes())->map->uri->toArray();
    if (in_array(ltrim($route, '/'), $existingRoutes) && $route !== $apiResource->route) {
        return response()->json([
            'message' => 'Šāds route jau eksistē sistēmā!'
        ], 422);
    }

    if (
        ApiResource::where('route', $route)
            ->where('id', '!=', $apiResource->id)
            ->exists()
    ) {
        return response()->json([
            'message' => 'Šāds route jau eksistē datubāzē!'
        ], 422);
    }

    $schema = $request->input('schema');
    if (is_string($schema)) {
        $schema = json_decode($schema, true);
    }

    $apiResource->route = $route;
    $apiResource->format = $request->input('format');
    $apiResource->visibility = $request->input('visibility');
    $apiResource->allow_get = $request->boolean('allow_get');
    $apiResource->allow_post = $request->boolean('allow_post');
    $apiResource->allow_put = $request->boolean('allow_put');
    $apiResource->allow_delete = $request->boolean('allow_delete');
    $apiResource->schema = $schema;

    if ($apiResource->visibility === 'private') {
        // Ja parole vēl nav iestatīta vai lietotājs ievadīja jaunu
        if (!$apiResource->password && !$request->filled('password')) {
            return response()->json([
                'message' => 'Privātam API nepieciešama parole!'
            ], 422);
        }

        if ($request->filled('password')) {
            $apiResource->password = Hash::make($request->input('password'));
        }
    } else {
        // Ja mainīts uz public, dzēšam paroli
        $apiResource->password = null;
    }

    $apiResource->save();

    return response()->json([
        'message' => 'API veiksmīgi atjaunots!',
        'resource' => $apiResource,
    ]);
}



    public function destroy(Request $request, ApiResource $apiResource)
    {
        if ($apiResource->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Nav atļaujas dzēst šo API!'
            ], 403);
        }

        try {
            $apiResource->delete();

            return response()->json([
                'message' => 'API veiksmīgi dzēsts!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Kļūda dzēšot API: ' . $e->getMessage()
            ], 500);
        }
    }

    public function publicApis()
    {
        $resources = ApiResource::where('visibility', 'public')->get();
        return Inertia::render('PublicApis', [
            'resources' => $resources,
        ]);
    }

    public function userApis(Request $request)
    {
        $userId = $request->user()->id;
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
                'schema',
            ]);

        return Inertia::render('ManiApi', [
            'resources' => $resources,
        ]);
    }

    public function editor(Request $request, ApiResource $apiResource)
    {
        if ($apiResource->user_id !== $request->user()->id) {
            return redirect()->route('maniapi')->with('error', 'Nav atļaujas editēt šo API!');
        }

        return Inertia::render('ApiEditor', [
            'resource' => $apiResource,
        ]);
    }


}
