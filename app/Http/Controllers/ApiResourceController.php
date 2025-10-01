<?php
namespace App\Http\Controllers;

use App\Models\ApiResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Models\StatsForRoute;
use App\Models\ApiError;
use App\Models\ApiRequest;
use App\Models\User;
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
        $userId = $request->user()->id;

        if (!$apiResource->hasUserAccess($userId)) {
            return redirect()->route('maniapi')->with('error', 'Nav atļaujas skatīt šā API statistiku!');
        }

        $stats = StatsForRoute::where('api_resource_id', $apiResource->id)->first();

        $startDate = now()->subDays(6)->startOfDay();

        $requests = ApiRequest::where('api_resource_id', $apiResource->id)
            ->where('created_at', '>=', $startDate)
            ->get()
            ->map(fn($req) => [
                'date' => $req->created_at->format('Y-m-d'),
                'method' => $req->method,
                'response_time_ms' => (int) $req->response_time_ms,
            ]);

        $errors = ApiError::where('api_resource_id', $apiResource->id)
            ->latest()
            ->take(50)
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
                'requests' => $requests,
                'errors' => $errors,
                'total_requests' => $stats->total_requests ?? 0,
                'get_requests' => $stats->get_requests ?? 0,
                'post_requests' => $stats->post_requests ?? 0,
                'put_requests' => $stats->put_requests ?? 0,
                'delete_requests' => $stats->delete_requests ?? 0,
                'avg_response_time' => ApiRequest::where('api_resource_id', $apiResource->id)->avg('response_time_ms'),
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
        $resource->users()->attach($request->user()->id, ['role' => 'owner']);

        return response()->json([
            'message' => 'API veiksmīgi izveidots!',
            'resource' => $resource
        ]);
    }

    public function update(Request $request, ApiResource $apiResource)
    {
        $userId = $request->user()->id;
        $userRole = null;

        if ($apiResource->user_id === $userId) {
        } elseif ($apiResource->hasUserAccess($userId)) {
            $userPermission = $apiResource->users()->where('user_id', $userId)->first();
            $userRole = $userPermission->pivot->role;

            if ($userRole === 'admin') {
                $allowedFields = ['schema'];
                $requestData = $request->only($allowedFields);
                if (count(array_diff(array_keys($request->all()), ['schema', '_token', '_method'])) > 0) {
                    return response()->json([
                        'message' => 'Admin var rediģēt tikai datu struktūru (schema)!'
                    ], 403);
                }
            }
        } else {
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

        if ($userRole === 'admin') {
            $schema = $request->input('schema');
            if (is_string($schema)) {
                $schema = json_decode($schema, true);
            }
            $apiResource->schema = $schema;
            $apiResource->save();

            return response()->json([
                'message' => 'Datu struktūra veiksmīgi atjaunota!',
                'resource' => $apiResource,
            ]);
        }

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
            if (!$apiResource->password && !$request->filled('password')) {
                return response()->json([
                    'message' => 'Privātam API nepieciešama parole!'
                ], 422);
            }
            if ($request->filled('password')) {
                $apiResource->password = Hash::make($request->input('password'));
            }
        } else {
            $apiResource->password = null;
        }

        $apiResource->save();

        return response()->json([
            'message' => 'API veiksmīgi atjaunots!',
            'resource' => $apiResource,
        ]);
    }

    public function uploadImage(Request $request, ApiResource $apiResource)
    {
        if ($apiResource->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Nav atļaujas pievienot bildes šim API!'
            ], 403);
        }

        $request->validate([
            'image' => 'required|image|max:4096',
            'folder' => 'nullable|string'
        ]);

        $folder = $request->input('folder', 'default');
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



    public function destroy(Request $request, ApiResource $apiResource)
    {
        if ($apiResource->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Tikai īpašnieks var dzēst API!'
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
        $user = $request->user();

        $sharedApis = $user->sharedApiResources()
            ->with([
                'owner:id,name,email',
                'users:id,name,email'
            ])
            ->get([
                'api_resources.id',
                'api_resources.route',
                'api_resources.format',
                'api_resources.allow_get',
                'api_resources.allow_post',
                'api_resources.allow_put',
                'api_resources.allow_delete',
                'api_resources.visibility',
                'api_resources.created_at',
                'api_resources.schema',
                'api_resources.user_id',
            ])
            ->map(function ($api) {
                $api->user_role = $api->pivot->role ?? null;
                $api->owner_name = $api->owner->name ?? 'Nezināms';

                $api->users->each(function ($u) {
                    $u->role = $u->pivot->role;
                });

                if ($api->owner) {
                    $api->users->push((object) [
                        'id' => $api->owner->id,
                        'name' => $api->owner->name,
                        'email' => $api->owner->email,
                        'role' => 'owner',
                    ]);
                }

                unset($api->owner);
                return $api;
            });

        return Inertia::render('ManiApi', [
            'sharedResources' => $sharedApis,
        ]);
    }


    public function editor(Request $request, ApiResource $apiResource)
    {
        $userId = $request->user()->id;

        if (!$apiResource->hasUserAccess($userId)) {
            return redirect()->route('maniapi')->with('error', 'Nav atļaujas editēt šo API!');
        }

        return Inertia::render('ApiEditor', [
            'resource' => $apiResource,
        ]);
    }


    public function getApiUsers(Request $request, ApiResource $apiResource)
    {
        if (!$apiResource->hasUserAccess($request->user()->id)) {
            return response()->json(['message' => 'Nav atļaujas skatīt šā API lietotājus!'], 403);
        }

        $users = $apiResource->users()->get();

        return response()->json([
            'users' => $users
        ]);
    }

    public function addUserToApi(Request $request, ApiResource $apiResource)
    {
        if ($apiResource->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Tikai īpašnieks var pievienot lietotājus!'], 403);
        }

        $request->validate([
            'email' => 'required|email',
            'role' => 'required|in:admin,co-owner',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Lietotājs ar šādu e-pastu netika atrasts!'], 404);
        }

        if ($user->id === $apiResource->user_id) {
            return response()->json(['message' => 'Nevar pievienot API īpašnieku kā lietotāju!'], 422);
        }

        if ($apiResource->users()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'Lietotājs jau ir pievienots šim API!'], 422);
        }

        $apiResource->users()->attach($user->id, ['role' => $request->role]);

        return response()->json([
            'message' => 'Lietotājs veiksmīgi pievienots!',
            'user' => $user
        ]);
    }

    public function removeUserFromApi(Request $request, ApiResource $apiResource, $userId)
    {
        if ($apiResource->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Tikai īpašnieks var noņemt lietotājus!'], 403);
        }

        $apiResource->users()->detach($userId);

        return response()->json(['message' => 'Lietotājs veiksmīgi noņemts!']);
    }
    public function updateUserRole(Request $request, ApiResource $apiResource, $userId)
    {
        if ($apiResource->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Tikai īpašnieks var mainīt lomas!'], 403);
        }

        $request->validate([
            'role' => 'required|in:admin,co-owner',
        ]);

        $apiResource->users()->updateExistingPivot($userId, ['role' => $request->role]);

        return response()->json(['message' => 'Loma veiksmīgi atjaunota!']);
    }


}
