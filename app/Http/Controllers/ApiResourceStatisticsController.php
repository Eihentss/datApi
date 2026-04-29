<?php

namespace App\Http\Controllers;

use App\Models\ApiResource;
use App\Models\StatsForRoute;
use App\Models\ApiError;
use App\Models\ApiRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApiResourceStatisticsController extends Controller
{
    /**
     * Skatīt API statistiku.
     */
    public function show(Request $request, ApiResource $apiResource)
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
}
