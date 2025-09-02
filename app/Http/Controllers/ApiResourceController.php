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
        $data = $request->validate([
            'route' => [
                'required',
                'string',
                'max:255',
                'regex:/^\/[a-zA-Z0-9_-]+$/',
                'unique:api_resources,route',
            ],
            'visibility' => 'required|in:public,private',
            'format' => 'required|in:json,xml,csv',
            'allow_get' => 'boolean',
            'allow_post' => 'boolean',
            'allow_put' => 'boolean',
            'allow_delete' => 'boolean',
            'schema' => 'required|array',
        ]);

        if (!($data['allow_get'] || $data['allow_post'] || $data['allow_put'] || $data['allow_delete'])) {
            return back()
                ->withErrors(['methods' => 'Jāatzīmē vismaz viena metode.'])
                ->withInput();
        }

        $data['user_id'] = auth()->id();

        $resource = ApiResource::create($data);

        return redirect()->route('Create')->with('success', 'API saglabāts veiksmīgi!');
    }

     public function publicApis()
    {
        $resources = ApiResource::where('visibility', 'public')->get();

        return Inertia::render('PublicApis', [
            'resources' => $resources,
        ]);
    }




}
