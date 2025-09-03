<?php

namespace App\Http\Controllers;

use App\Models\ApiResource;
use Illuminate\Http\Request;
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
            'format' => 'required|in:json,xml,csv',
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
    
        if (\App\Models\ApiResource::where('route', $route)->exists()) {
            return response()->json([
                'message' => 'Šāds route jau eksistē datubāzē!'
            ], 422);
        }
    
        $resource = new \App\Models\ApiResource();
        $resource->user_id = $request->user()->id;
        $resource->route = $route;
        $resource->format = $request->input('format');
        $resource->visibility = $request->input('visibility');
        $resource->allow_get = $request->boolean('allow_get');
        $resource->allow_post = $request->boolean('allow_post');
        $resource->allow_put = $request->boolean('allow_put');
        $resource->allow_delete = $request->boolean('allow_delete');
        $resource->schema = $request->input('schema');
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




}
