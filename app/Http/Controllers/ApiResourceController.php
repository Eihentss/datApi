<?php
namespace App\Http\Controllers;

use App\Models\ApiResource;
use App\Http\Requests\StoreApiResourceRequest;
use App\Http\Requests\UpdateApiResourceRequest;
use App\Http\Requests\UploadApiImageRequest;
use App\Http\Requests\AddUserToApiRequest;
use App\Http\Requests\UpdateUserRoleRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\StatsForRoute;
use App\Models\ApiError;
use App\Models\ApiRequest;
use App\Models\User;
use Illuminate\Support\Str;
use App\Models\ApiUserPermission;

class ApiResourceController extends Controller
{
    public function index()
    {
        $resources = ApiResource::where('user_id', auth()->id())
            ->get();
            
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

    public function store(StoreApiResourceRequest $request)
    {
        $validated = $request->validated();

        $route = $validated['route'];

        // Pārliecināmies, ka schema ir JSON formātā
        $schema = $validated['schema'] ?? null;
        if (is_string($schema)) {
            $schema = json_decode($schema, true);
        }

        // Izveido galveno API resursu
        $resource = new ApiResource();
        $resource->user_id = $request->user()->id;
        $resource->route = $route;
        $resource->format = $validated['format'];
        $resource->visibility = $validated['visibility'];
        $resource->schema = $schema;
        $resource->allow_get = $request->boolean('allow_get', true);
        $resource->allow_post = $request->boolean('allow_post', false);
        $resource->allow_put = $request->boolean('allow_put', false);
        $resource->allow_delete = $request->boolean('allow_delete', false);
        $resource->save();

        // Ja API ir privāts un ir parole, saglabā to
        if ($resource->visibility === 'private' && !empty($validated['password'])) {
            $resource->password = Hash::make($validated['password']);
            $resource->save();
        }

        // 🔥 Saglabā īpašnieka tiesības api_user_permissions tabulā
        ApiUserPermission::create([
            'api_resource_id' => $resource->id,
            'user_id' => $request->user()->id,
            'role' => 'owner',
        ]);


        return response()->json([
            'message' => 'API veiksmīgi izveidots!',
            'resource' => $resource,
        ]);
    }

    public function update(UpdateApiResourceRequest $request, ApiResource $apiResource)
    {
        $userId = $request->user()->id;
        $userRole = null;

        // Pārbauda piekļuves tiesības
        if ($apiResource->user_id === $userId) {
            // Lietotājs ir īpašnieks
        } elseif ($apiResource->hasUserAccess($userId)) {
            $userPermission = $apiResource->users()->where('user_id', $userId)->first();
            $userRole = $userPermission->pivot->role;

            if ($userRole === 'admin') {
                // Admin var rediģēt tikai schema
                $allowedFields = ['schema'];
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

        $validated = $request->validated();

        // Ja admin, atjauno tikai schema
        if ($userRole === 'admin') {
            $schema = $validated['schema'] ?? null;
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

        $route = $validated['route'];

        DB::beginTransaction();
        try {
            // Atjauno API resursu
            $apiResource->route = $route;
            $apiResource->format = $validated['format'];
            $apiResource->visibility = $validated['visibility'];
            $apiResource->allow_get = $request->boolean('allow_get');
            $apiResource->allow_post = $request->boolean('allow_post');
            $apiResource->allow_put = $request->boolean('allow_put');
            $apiResource->allow_delete = $request->boolean('allow_delete');
            
            if (!empty($validated['password'])) {
                $apiResource->password = Hash::make($validated['password']);
            }
            
            $apiResource->save();

            DB::commit();

            return response()->json([
                'message' => 'API veiksmīgi atjaunots!',
                'resource' => $apiResource,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Kļūda atjaunojot API: ' . $e->getMessage()
            ], 500);
        }
    }

    public function uploadImage(UploadApiImageRequest $request, ApiResource $apiResource)
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
    
        // Lietotāja paša API
        $ownApis = ApiResource::where('user_id', $user->id)
            ->get()
            ->map(function ($api) {
                return [
                    'id' => $api->id,
                    'route' => $api->route,
                    'format' => $api->format,
                    'visibility' => $api->visibility,
                    'allow_get' => $api->allow_get,
                    'allow_post' => $api->allow_post,
                    'allow_put' => $api->allow_put,
                    'allow_delete' => $api->allow_delete,
                    'user_role' => 'owner',
                    'created_at' => $api->created_at,
                ];
            });
    
        // Koplietoti API
        $sharedApis = $user->sharedApiResources()
            ->get()
            ->map(function ($api) {
                return [
                    'id' => $api->id,
                    'route' => $api->route,
                    'format' => $api->format,
                    'visibility' => $api->visibility,
                    'allow_get' => $api->allow_get,
                    'allow_post' => $api->allow_post,
                    'allow_put' => $api->allow_put,
                    'allow_delete' => $api->allow_delete,
                    'user_role' => $api->pivot->role ?? null,
                    'created_at' => $api->created_at,
                ];
            });
    
        // Apvieno abus kopā
        $allApis = $ownApis->merge($sharedApis)->unique('id')->values();
    
        return Inertia::render('ManiApi', [
            'sharedResources' => $allApis,
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

    public function addUserToApi(AddUserToApiRequest $request, ApiResource $apiResource)
    {
        if ($apiResource->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Tikai īpašnieks var pievienot lietotājus!'], 403);
        }

        $validated = $request->validated();

        $user = User::where('email', $validated['email'])->first();

        if (!$user) {
            return response()->json(['message' => 'Lietotājs ar šādu e-pastu netika atrasts!'], 404);
        }

        if ($user->id === $apiResource->user_id) {
            return response()->json(['message' => 'Nevar pievienot API īpašnieku kā lietotāju!'], 422);
        }

        if ($apiResource->users()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'Lietotājs jau ir pievienots šim API!'], 422);
        }

        $apiResource->users()->attach($user->id, ['role' => $validated['role']]);

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

    public function updateUserRole(UpdateUserRoleRequest $request, ApiResource $apiResource, $userId)
    {
        if ($apiResource->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Tikai īpašnieks var mainīt lomas!'], 403);
        }

        $validated = $request->validated();

        $apiResource->users()->updateExistingPivot($userId, ['role' => $validated['role']]);

        return response()->json(['message' => 'Loma veiksmīgi atjaunota!']);
    }
}
