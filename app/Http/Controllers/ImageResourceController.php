<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreImageResourceRequest;
use App\Models\ImageResource;
use Illuminate\Support\Facades\Storage;

class ImageResourceController extends Controller
{
    public function store(StoreImageResourceRequest $request)
    {
        $validated = $request->validated();

        $folder = $validated['folder_name'];
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
