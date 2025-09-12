<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ApiResource;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use App\Models\StatsForRoute;
use App\Models\ApiError ;


class DynamicApiController extends Controller
{
    public function handle(Request $request, $slug)
    {
        $resource = ApiResource::where('route', '/' . $slug)->first();
        
        if (!$resource) {
            // Saglabā kļūdu DB
            ApiError::create([
                'api_resource_id' => 0, // nav resursa, var atstāt 0 vai null
                'message' => "API '$slug' nav atrasts",
                'method' => $request->method(),
                'endpoint' => '/' . $slug,
                'status_code' => 404,
            ]);
        
            if ($request->ajax() || $request->wantsJson() || $request->expectsJson()) {
                return response()->json(['message' => 'API not found'], 404);
            }
            
            return redirect('/')->with('error', 'API nav atrasts');
        }

        $method = $request->method();
        $stats = StatsForRoute::firstOrCreate(
            ['api_resource_id' => $resource->id],
            []
        );

        
        $stats->increment('total_requests');

        if ($resource->visibility === 'private') {
            // Ja lietotājs ir autentificēts un šis API ir viņa, ļauj
            if (auth()->check() && auth()->id() === $resource->user_id) {
                // Do nothing, piekļuve atļauta
            } else {
                // citādi pārbauda password
                $password = $request->input('password') ?? $request->header('X-API-PASSWORD');
                if (!$password || !Hash::check($password, $resource->password)) {
                    ApiError::create([
                        'api_resource_id' => $resource->id,
                        'message' => "Unauthorized access attempt to {$resource->route}",
                        'method' => $method,
                        'endpoint' => $resource->route,
                        'status_code' => 403,
                    ]);
                
                    if ($request->ajax() || $request->wantsJson() || $request->expectsJson()) {
                        return response()->json(['message' => 'Unauthorized: incorrect password'], 403);
                    }
                
                    return redirect('/')->with('error', 'Nav autorizācijas šim API');
                }
            }
        }

        $method = $request->method();

        $cacheKey = "api_rate_limit:{$resource->id}:{$method}:" . $request->ip();
        if (!Cache::add($cacheKey, true, 3)) {
            ApiError::create([
                'api_resource_id' => $resource->id,
                'message' => "Too many requests",
                'method' => $method,
                'endpoint' => $resource->route,
                'status_code' => 429,
            ]);
        
            if ($request->ajax() || $request->wantsJson() || $request->expectsJson()) {
                return response()->json(['message' => 'Too Many Requests'], 429);
            }
            
            // return redirect('/')->with('error', 'Pārāk daudz pieprasījumu. Lūdzu uzgaidiet.');
        }

        // Pārbauda HTTP metodes
        $methodErrors = [
            'GET' => !$resource->allow_get,
            'POST' => !$resource->allow_post,
            'PUT' => !$resource->allow_put,
            'DELETE' => !$resource->allow_delete
        ];

        if (isset($methodErrors[$method]) && $methodErrors[$method]) {
            ApiError::create([
                'api_resource_id' => $resource->id,
                'message' => "$method metode nav atļauta",
                'method' => $method,
                'endpoint' => $resource->route,
                'status_code' => 403,
            ]);
        
            if ($request->ajax() || $request->wantsJson() || $request->expectsJson()) {
                return response()->json(['message' => "$method not allowed"], 403);
            }
        
            return redirect('/')->with('error', "HTTP $method metode nav atļauta šim API");
        }

        $schema = $resource->schema ?? [];

        switch ($method) {
            case 'GET':
                $stats->increment('get_requests');
                return $this->formatResponse($resource->format, $schema);
                
            case 'POST':
                $newData = $request->all();
                unset($newData['password']);
                $resource->schema = array_merge((array) $schema, $newData);
                $resource->save();
                $stats->increment('post_requests');

                return $this->formatResponse($resource->format, $resource->schema, 'POST successful. Data added.');

            case 'DELETE':
                $resource->schema = [];
                $resource->save();
                $stats->increment('delete_requests');

                return $this->formatResponse($resource->format, ['message' => 'All data deleted successfully', 'data' => $resource->schema]);

            case 'PUT':
                $newData = $request->all();
                unset($newData['password']);
                $resource->schema = $newData;
                $resource->save();
                $stats->increment('put_requests');

                return $this->formatResponse($resource->format, $resource->schema, 'PUT successful. Data replaced.');
        }
        $stats->save();

        return $this->formatResponse($resource->format, $schema);
    }

    private function formatResponse($format, $data, $message = null)
    {
        switch ($format) {
            case 'json':
                return response()->json($message ? ['message' => $message, 'data' => $data] : $data);
            case 'xml':
                $xml = new \SimpleXMLElement('<root/>');
                $this->arrayToXml((array) $data, $xml);
                return response($xml->asXML(), 200)->header('Content-Type', 'application/xml');
            case 'yaml':
                return response(\Symfony\Component\Yaml\Yaml::dump((array) $data), 200)
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
                $xml->addChild($key, htmlspecialchars((string) $value));
            }
        }
    }
}