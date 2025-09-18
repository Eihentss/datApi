<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ApiResource;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use App\Models\StatsForRoute;
use App\Models\ApiError;
use App\Models\ApiRequest;

class DynamicApiController extends Controller
{
    public function handle(Request $request, $slug)
    {
        // START laiks milisekundēs - sākam mērīt tūlīt pēc funkcijas izsaukuma
        $startTime = $this->getMilliseconds();

        $resource = ApiResource::where('route', '/' . $slug)->first();
        if (!$resource) {
            // Aprēķinām response time pirms kļūdas apstrādes
            $endTime = $this->getMilliseconds();
            $durationMs = $endTime - $startTime;

            ApiError::create([
                'api_resource_id' => 0,
                'message' => "API '$slug' nav atrasts",
                'method' => $request->method(),
                'endpoint' => '/' . $slug,
                'status_code' => 404,
                'response_time_ms' => $durationMs,
            ]);

            if ($request->expectsJson()) {
                return response()->json(['message' => 'API not found'], 404);
            }

            return redirect('/')->with('error', 'API nav atrasts');
        }

        $method = $request->method();
        $stats = StatsForRoute::firstOrCreate(['api_resource_id' => $resource->id]);
        $stats->increment('total_requests');

        // Private API access
        if ($resource->visibility === 'private' && !(auth()->check() && auth()->id() === $resource->user_id)) {
            $password = $request->input('password') ?? $request->header('X-API-PASSWORD');
            if (!$password || !Hash::check($password, $resource->password)) {
                $endTime = $this->getMilliseconds();
                $durationMs = $endTime - $startTime;

                ApiError::create([
                    'api_resource_id' => $resource->id,
                    'message' => "Unauthorized access attempt to {$resource->route}",
                    'method' => $method,
                    'endpoint' => $resource->route,
                    'status_code' => 403,
                    'response_time_ms' => $durationMs,
                ]);

                if ($request->expectsJson()) {
                    return response()->json(['message' => 'Unauthorized: incorrect password'], 403);
                }

                return redirect('/')->with('error', 'Nav autorizācijas šim API');
            }
        }

        // Rate limiting
        $cacheKey = "api_rate_limit:{$resource->id}:{$method}:" . $request->ip();
        if (!Cache::add($cacheKey, true, 3)) {
            $endTime = $this->getMilliseconds();
            $durationMs = $endTime - $startTime;

            ApiError::create([
                'api_resource_id' => $resource->id,
                'message' => "Too many requests",
                'method' => $method,
                'endpoint' => $resource->route,
                'status_code' => 429,
                'response_time_ms' => $durationMs,
            ]);

            if ($request->expectsJson()) {
                return response()->json(['message' => 'Too Many Requests'], 429);
            }
        }

        // HTTP metode validācija
        $methodErrors = [
            'GET' => !$resource->allow_get,
            'POST' => !$resource->allow_post,
            'PUT' => !$resource->allow_put,
            'DELETE' => !$resource->allow_delete
        ];
        if (!empty($methodErrors[$method])) {
            $endTime = $this->getMilliseconds();
            $durationMs = $endTime - $startTime;

            ApiError::create([
                'api_resource_id' => $resource->id,
                'message' => "$method metode nav atļauta",
                'method' => $method,
                'endpoint' => $resource->route,
                'status_code' => 403,
                'response_time_ms' => $durationMs,
            ]);
            return $request->expectsJson()
                ? response()->json(['message' => "$method not allowed"], 403)
                : redirect('/')->with('error', "HTTP $method metode nav atļauta šim API");
        }

        $schema = $resource->schema ?? [];
        $responseData = null;
        $responseMsg = null;

        switch ($method) {
            case 'GET':
                $stats->increment('get_requests');
                $responseData = $schema;
                break;

            case 'POST':
                $newData = $request->except('password');
                $resource->schema = array_merge((array)$schema, $newData);
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

            default:
                $responseData = $schema;
        }

        $stats->save();

        // END laiks - aprēķinām response time tikai pirms response nosūtīšanas
        $endTime = $this->getMilliseconds();
        $durationMs = $endTime - $startTime;

        // Ierakstām request ar faktisko response laiku
        ApiRequest::create([
            'api_resource_id' => $resource->id,
            'method' => $method,
            'endpoint' => $resource->route,
            'response_time_ms' => $durationMs,
        ]);

        return $this->formatResponse($resource->format, $responseData, $responseMsg);
    }

    /**
     * Atgriež pašreizējo laiku milisekundēs ar augstu precizitāti
     */
    private function getMilliseconds(): float
    {
        return microtime(true) * 1000; // microtime(true) atgriež sekundes ar decimālām daļām
    }

    private function formatResponse($format, $data, $message = null)
    {
        switch ($format) {
            case 'json':
                return response()->json($message ? ['message' => $message, 'data' => $data] : $data);
            case 'xml':
                $xml = new \SimpleXMLElement('<root/>');
                $this->arrayToXml((array)$data, $xml);
                return response($xml->asXML(), 200)->header('Content-Type', 'application/xml');
            case 'yaml':
                return response(\Symfony\Component\Yaml\Yaml::dump((array)$data), 200)
                    ->header('Content-Type', 'text/yaml');
            default:
                return response()->json($data);
        }
    }

    private function arrayToXml(array $data, \SimpleXMLElement &$xml)
    {
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
    }
}