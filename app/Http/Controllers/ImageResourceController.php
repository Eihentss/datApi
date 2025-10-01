<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ImageResource;

use Illuminate\Support\Facades\Storage;

class ImageResourceController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:2048', // tikai bildes, max 2MB
            'folder_name' => 'required|string'
        ]);

        $folder = $request->input('folder_name');
        $file = $request->file('image');

        $path = $file->store("images/{$folder}", 'public');

        $image = ImageResource::create([
            'folder_name' => $folder,
            'image_name' => $file->getClientOriginalName(),
            'path' => $path,
        ]);

        return response()->json([
            'message' => 'Bilde veiksmīgi saglabāta!',
            'image' => $image,
        ]);
    }

    public function index()
    {
        return ImageResource::all();
    }
}
