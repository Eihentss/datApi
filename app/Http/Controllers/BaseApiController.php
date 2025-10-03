<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

abstract class BaseApiController extends Controller
{
    protected function getMilliseconds(): float
    {
        return microtime(true) * 1000;
    }
    protected function formatResponse($format, $data, $message = null)
    {
        return match ($format) {
            'json' => response()->json($message ? ['message' => $message, 'data' => $data] : $data),
            'xml' => response($this->arrayToXml((array)$data)->asXML(), 200)
                ->header('Content-Type', 'application/xml'),
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
