<?php

namespace App\Http\Controllers;

use App\Models\ApiResource;
use App\Models\User;
use App\Http\Requests\AddUserToApiRequest;
use App\Http\Requests\UpdateUserRoleRequest;
use Illuminate\Http\Request;

class ApiResourceUserController extends Controller
{
    /**
     * Iegūt API lietotājus.
     */
    public function index(Request $request, ApiResource $apiResource)
    {
        if (!$apiResource->hasUserAccess($request->user()->id)) {
            return response()->json(['message' => 'Nav atļaujas skatīt šā API lietotājus!'], 403);
        }

        $users = $apiResource->users()->get();

        return response()->json([
            'users' => $users
        ]);
    }

    /**
     * Pievienot lietotāju API.
     */
    public function store(AddUserToApiRequest $request, ApiResource $apiResource)
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

    /**
     * Noņemt lietotāju no API.
     */
    public function destroy(Request $request, ApiResource $apiResource, $userId)
    {
        if ($apiResource->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Tikai īpašnieks var noņemt lietotājus!'], 403);
        }

        $apiResource->users()->detach($userId);

        return response()->json(['message' => 'Lietotājs veiksmīgi noņemts!']);
    }

    /**
     * Atjaunot lietotāja lomu.
     */
    public function update(UpdateUserRoleRequest $request, ApiResource $apiResource, $userId)
    {
        if ($apiResource->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Tikai īpašnieks var mainīt lomas!'], 403);
        }

        $validated = $request->validated();

        $apiResource->users()->updateExistingPivot($userId, ['role' => $validated['role']]);

        return response()->json(['message' => 'Loma veiksmīgi atjaunota!']);
    }
}
