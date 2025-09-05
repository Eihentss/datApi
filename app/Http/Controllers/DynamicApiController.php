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
                $resource->schema = array_merge($schema, $request->all());
                $resource->save();
                return $this->formatResponse($resource->format, $resource->schema, 'POST veiksmīgs');
                
            case 'DELETE':
                // Iegūstam DELETE datus
                $payload = $request->all();
                
                // Ja payload ir tukšs, mēģinām iegūt raw input
                if (empty($payload)) {
                    $rawInput = $request->getContent();
                    if (!empty($rawInput)) {
                        $payload = json_decode($rawInput, true);
                        if (json_last_error() !== JSON_ERROR_NONE) {
                            return response()->json(['message' => 'Invalid JSON in request body'], 400);
                        }
                    }
                }
                
                Log::info('DELETE payload received:', $payload);
                
                // Ja ir norādīts konkrēts array un field
                if (!empty($payload['array']) && !empty($payload['field']) && isset($payload['value'])) {
                    $arrayName = $payload['array'];
                    $field = $payload['field'];
                    $value = $payload['value'];
                    
                    // Pārbaudam vai array eksistē schema
                    if (!isset($schema[$arrayName]) || !is_array($schema[$arrayName])) {
                        return response()->json(['message' => "Array '{$arrayName}' not found in schema"], 404);
                    }
                    
                    $originalCount = count($schema[$arrayName]);
                    
                    // filtrējam ārā ierakstu, kur field = value
                    $schema[$arrayName] = array_values(array_filter($schema[$arrayName], function($item) use ($field, $value) {
                        // Pārbaudam vai item ir array un vai tam ir vajadzīgais lauks
                        if (!is_array($item) || !isset($item[$field])) {
                            return true; // paturēt, ja nav field
                        }
                        // dzēst, ja field vērtība sakrīt
                        return $item[$field] != $value;
                    }));
                    
                    $newCount = count($schema[$arrayName]);
                    $deletedCount = $originalCount - $newCount;
                    
                    // saglabā izmaiņas DB
                    $resource->schema = $schema;
                    $resource->save();
                    
                    if ($deletedCount > 0) {
                        return response()->json([
                            'message' => "Deleted {$deletedCount} item(s) from '{$arrayName}' where {$field} = {$value}",
                            'data' => $resource->schema,
                            'deleted_count' => $deletedCount
                        ]);
                    } else {
                        return response()->json([
                            'message' => "No items found in '{$arrayName}' where {$field} = {$value}",
                            'data' => $resource->schema,
                            'deleted_count' => 0
                        ]);
                    }
                }
                
                // ja payload nav dots vai nav array → dzēš visu
                $resource->schema = [];
                $resource->save();
                return response()->json(['message' => "All data deleted"]);
                
            case 'PUT':
                // Atjaunina visu schema
                $resource->schema = $request->all();
                $resource->save();
                return $this->formatResponse($resource->format, $resource->schema, 'PUT veiksmīgs');
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