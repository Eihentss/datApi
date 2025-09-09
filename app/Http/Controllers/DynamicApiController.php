<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ApiResource;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;

class DynamicApiController extends Controller
{
    public function handle(Request $request, $slug)
    {
        $resource = ApiResource::where('route', '/' . $slug)->first();
        if (!$resource) {
            return response()->json(['message' => 'API not found'], 404);
        }

        if ($resource->visibility === 'private') {
            // Ja lietotājs ir autentificēts un šis API ir viņa, ļauj
            if (auth()->check() && auth()->id() === $resource->user_id) {
                // Do nothing, piekļuve atļauta
            } else {
                // citādi pārbauda password
                $password = $request->input('password') ?? $request->header('X-API-PASSWORD');
                if (!$password || !Hash::check($password, $resource->password)) {
                    return response()->json(['message' => 'Unauthorized: incorrect password'], 403);
                }
            }
        }

        $method = $request->method();

        $cacheKey = "api_rate_limit:{$resource->id}:{$method}:" . $request->ip();
        if (!Cache::add($cacheKey, true, 3)) {
            return response()->json([
                'message' => 'Too Many Requests: wait before trying again'
            ], 429);
        }

        if ($method === 'GET' && !$resource->allow_get) return response()->json(['message' => 'GET not allowed'], 403);
        if ($method === 'POST' && !$resource->allow_post) return response()->json(['message' => 'POST not allowed'], 403);
        if ($method === 'PUT' && !$resource->allow_put) return response()->json(['message' => 'PUT not allowed'], 403);
        if ($method === 'DELETE' && !$resource->allow_delete) return response()->json(['message' => 'DELETE not allowed'], 403);

        $schema = $resource->schema ?? [];

        switch ($method) {
            case 'GET':
                return $this->formatResponse($resource->format, $schema);

            case 'POST':
                $newData = $request->all();
                unset($newData['password']);
                $resource->schema = array_merge((array) $schema, $newData);
                $resource->save();
                return $this->formatResponse($resource->format, $resource->schema, 'POST successful. Data added.');

            case 'DELETE':
                $resource->schema = [];
                $resource->save();
                return response()->json([
                    'message' => "All data deleted successfully",
                    'data' => $resource->schema
                ]);

            case 'PUT':
                $newData = $request->all();
                unset($newData['password']);
                $resource->schema = $newData;
                $resource->save();
                return $this->formatResponse($resource->format, $resource->schema, 'PUT successful. Data replaced.');
        }

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
                $xml->addChild($key, htmlspecialchars($value));
            }
        }
    }
}
