<?php

namespace App\Http\Controllers;

use App\Models\ApiResource;
use App\Http\Requests\UploadApiImageRequest;
use Illuminate\Http\Request;

class ApiResourceImageController extends Controller
{
    /**
     * Augšupielādēt bildi API resursam.
     */
    public function store(UploadApiImageRequest $request, ApiResource $apiResource)
    {
        if ($apiResource->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Nav atļaujas pievienot bildes šim API!'
            ], 403);
        }

        $validated = $request->validated();

        $folder = $validated['folder'] ?? 'default';
        $file = $request->file('image');

        $path = $file->store("images/{$folder}", 'public');
        $url = asset('storage/' . $path);

        $schema = $apiResource->schema ?? [];
        if (!isset($schema['images'])) {
            $schema['images'] = [];
        }
        $schema['images'][] = $url;

        $apiResource->schema = $schema;
        $apiResource->save();

        return response()->json([
            'message' => 'Bilde pievienota!',
            'url' => $url,
        ]);
    }
}
