<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ApiResource;
use App\Models\StatsForRoute;
use App\Models\ApiError;
use App\Models\ApiRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;

class DynamicApiController extends Controller
{
    public function get(Request $request, $slug)
    {
        return $this->handleMethod($request, $slug, 'GET');
    }

    public function post(Request $request, $slug)
    {
        return $this->handleMethod($request, $slug, 'POST');
    }

    public function put(Request $request, $slug)
    {
        return $this->handleMethod($request, $slug, 'PUT');
    }

    public function delete(Request $request, $slug)
    {
        return $this->handleMethod($request, $slug, 'DELETE');
    }

    private function handleMethod(Request $request, $slug, string $method)
    {
        $startTime = microtime(true) * 1000;
        $resource = ApiResource::where('route', '/' . $slug)->first();

        if (!$resource) {
            $this->logError(0, $method, '/' . $slug, 404, "API '$slug' nav atrasts", $startTime);
            abort(404, 'API not found');
        }

        // Autorizācija privātajiem API
        if ($resource->visibility === 'private' && !(auth()->check() && auth()->id() === $resource->user_id)) {
            $password = $request->input('password') ?? $request->header('X-API-PASSWORD');
            if (!$password || !Hash::check($password, $resource->password)) {
                $this->logError($resource->id, $method, $resource->route, 403, "Unauthorized access", $startTime);
                abort(403, 'Unauthorized: incorrect password');
            }
        }

        // Rate limit
        $cacheKey = "api_rate_limit:{$resource->id}:{$method}:" . $request->ip();
        if (!Cache::add($cacheKey, true, 3)) {
            $this->logError($resource->id, $method, $resource->route, 429, "Too many requests", $startTime);
            abort(429, 'Too Many Requests');
        }

        // Pārbauda, vai metode atļauta
        if (!$this->isMethodAllowed($resource, $method)) {
            $this->logError($resource->id, $method, $resource->route, 403, "$method not allowed", $startTime);
            abort(403, "$method not allowed");
        }

        $stats = StatsForRoute::firstOrCreate(['api_resource_id' => $resource->id]);
        $stats->increment('total_requests');

        $responseData = [];
        $responseMsg = null;

        switch ($method) {
            case 'GET':
                $stats->increment('get_requests');
                $responseData = $resource->schema ?? [];
                break;

            case 'POST':
                $newData = $request->except('password');
                $resource->schema = array_merge((array)($resource->schema ?? []), $newData);
                $resource->save();
                $stats->increment('post_requests');
                $responseData = $resource->schema;
                $responseMsg = 'POST successful. Data added.';
                break;

            case 'PUT':
                $newData = $request->except('password');
                $resource->schema = $newData;
                $resource->save();
                $stats->increment('put_requests');
                $responseData = $resource->schema;
                $responseMsg = 'PUT successful. Data replaced.';
                break;

            case 'DELETE':
                $resource->schema = [];
                $resource->save();
                $stats->increment('delete_requests');
                $responseData = ['message' => 'All data deleted successfully', 'data' => []];
                break;
        }

        $stats->save();

        $durationMs = microtime(true) * 1000 - $startTime;
        ApiRequest::create([
            'api_resource_id' => $resource->id,
            'method' => $method,
            'endpoint' => $resource->route,
            'response_time_ms' => $durationMs,
        ]);

        return $this->formatResponse($resource->format, $responseData, $responseMsg);
    }

    private function isMethodAllowed(ApiResource $resource, $method)
    {
        return match ($method) {
            'GET' => $resource->allow_get,
            'POST' => $resource->allow_post,
            'PUT' => $resource->allow_put,
            'DELETE' => $resource->allow_delete,
            default => false,
        };
    }

    private function logError($resourceId, $method, $endpoint, $statusCode, $message, $startTime)
    {
        $durationMs = microtime(true) * 1000 - $startTime;
        ApiError::create([
            'api_resource_id' => $resourceId,
            'method' => $method,
            'endpoint' => $endpoint,
            'status_code' => $statusCode,
            'message' => $message,
            'response_time_ms' => $durationMs,
        ]);
    }

    private function formatResponse($format, $data, $message = null)
    {
        return match ($format) {
            'json' => response()->json($message ? ['message' => $message, 'data' => $data] : $data),
            'xml' => response($this->arrayToXml((array)$data)->asXML(), 200)->header('Content-Type', 'application/xml'),
            'yaml' => response(\Symfony\Component\Yaml\Yaml::dump((array)$data), 200)
                        ->header('Content-Type', 'text/yaml'),
            default => response()->json($data),
        };
    }

    private function arrayToXml(array $data, \SimpleXMLElement $xml = null)
    {
        $xml = $xml ?: new \SimpleXMLElement('<root/>');

        foreach ($data as $key => $value) {
            if (is_array($value)) {
                if (is_numeric($key)) $key = "item$key";
                $subnode = $xml->addChild($key);
                $this->arrayToXml($value, $subnode);
            } else {
                if (is_numeric($key)) $key = "item$key";
                $xml->addChild($key, htmlspecialchars((string)$value));
            }
        }

        return $xml;
    }
}
