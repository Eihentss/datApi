<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\ApiResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class DynamicApiController extends Controller
{
    public function handle(Request $request, $slug)
    {
        $resource = ApiResource::where('route', '/' . $slug)->first();
        if (!$resource) {
            return response()->json(['message' => 'API not found'], 404);
        }

        // Private API pārbaude
        if ($resource->visibility === 'private') {
            if (!Auth::check() || Auth::id() !== $resource->user_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        $method = $request->method();
        
        // Metodes atļauju pārbaude
        if ($method === 'GET' && !$resource->allow_get) return response()->json(['message' => 'GET not allowed'], 403);
        if ($method === 'POST' && !$resource->allow_post) return response()->json(['message' => 'POST not allowed'], 403);
        if ($method === 'PUT' && !$resource->allow_put) return response()->json(['message' => 'PUT not allowed'], 403);
        if ($method === 'DELETE' && !$resource->allow_delete) return response()->json(['message' => 'DELETE not allowed'], 403);

        // --- manipulācija ar datiem ---
        $schema = $resource->schema ?? [];
        
        switch ($method) {
            case 'GET':
                // tikai atgriež esošo schema
                return $this->formatResponse($resource->format, $schema);
                
            case 'POST':
                // pievieno jaunus laukus schema
                $newData = $request->all();
                $resource->schema = array_merge($schema, $newData);
                $resource->save();
                return $this->formatResponse($resource->format, $resource->schema, 'POST successful. Data added.');
                
            case 'DELETE':
                // izdzēš visu schema
                $resource->schema = [];
                $resource->save();
                return response()->json([
                    'message' => "All data deleted successfully",
                    'data' => $resource->schema
                ]);
                
            case 'PUT':
                // Atjaunina visu schema
                $newData = $request->all();
                $resource->schema = $newData;
                $resource->save();
                return $this->formatResponse($resource->format, $resource->schema, 'PUT successful. Data replaced.');
        }
        
        // fallback GET
        return $this->formatResponse($resource->format, $schema);
    }
    
    private function formatResponse($format, $data, $message = null)
    {
        switch ($format) {
            case 'json':
                return response()->json($message ? ['message' => $message, 'data' => $data] : $data);
            case 'xml':
                $xml = new \SimpleXMLElement('<root/>');
                $this->arrayToXml($data, $xml);
                return response($xml->asXML(), 200)->header('Content-Type', 'application/xml');
            case 'yaml':
                return response(\Symfony\Component\Yaml\Yaml::dump($data), 200)
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