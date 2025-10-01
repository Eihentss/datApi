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

    protected function arrayToXml(array $data, \SimpleXMLElement &$xml)
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
