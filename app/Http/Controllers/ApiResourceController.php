<?php

namespace App\Http\Controllers;

use App\Models\ApiResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ApiResourceController extends Controller
{
    public function index()
    {
        $resources = ApiResource::where('user_id', auth()->id())->get();

        return Inertia::render('Create', [
            'resources' => $resources,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'route' => 'required|string|max:255',
            'format' => 'required|in:json,xml,yaml',
            'visibility' => 'required|in:public,private',
            'password' => 'nullable|string|min:4', // tikai ja private
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

        $resource = new ApiResource();
        $resource->user_id = $request->user()->id;
        $resource->route = $route;
        $resource->format = $request->input('format');
        $resource->visibility = $request->input('visibility');
        $resource->allow_get = $request->boolean('allow_get');
        $resource->allow_post = $request->boolean('allow_post');
        $resource->allow_put = $request->boolean('allow_put');
        $resource->allow_delete = $request->boolean('allow_delete');
        $resource->schema = $request->input('schema');

        // Parole tikai privātam API
        if ($resource->visibility === 'private') {
            if (!$request->filled('password')) {
                return response()->json([
                    'message' => 'Privātam API nepieciešama parole!'
                ], 422);
            }
            $resource->password = Hash::make($request->input('password'));
        }

        $resource->save();

        return response()->json(['message' => 'API saglabāts!']);
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
            ]);

        return Inertia::render('ManiApi', [
            'resources' => $resources,
        ]);
    }

    public function update(Request $request, ApiResource $apiResource)
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

        $apiResource->route = $route;
        $apiResource->format = $request->input('format');
        $apiResource->visibility = $request->input('visibility');
        $apiResource->allow_get = $request->boolean('allow_get');
        $apiResource->allow_post = $request->boolean('allow_post');
        $apiResource->allow_put = $request->boolean('allow_put');
        $apiResource->allow_delete = $request->boolean('allow_delete');
        $apiResource->schema = $request->input('schema');

        if ($apiResource->visibility === 'private' && $request->filled('password')) {
            $apiResource->password = Hash::make($request->input('password'));
        }

        $apiResource->save();

        return response()->json([
            'message' => 'API atjaunots!',
            'resource' => $apiResource,
        ]);
    }
}
