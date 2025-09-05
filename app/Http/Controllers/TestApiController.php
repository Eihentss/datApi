<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestApiController extends Controller
{
    // GET
    public function index()
    {
        return response()->json([
            'message' => 'GET strādā!',
            'data' => ['example' => 'value']
        ]);
    }

    // POST
    public function store(Request $request)
    {
        return response()->json([
            'message' => 'POST strādā!',
            'received' => $request->all()
        ]);
    }

    // PUT
    public function update(Request $request, $id)
    {
        return response()->json([
            'message' => "PUT strādā priekš ID = $id",
            'received' => $request->all()
        ]);
    }

    // DELETE
    public function destroy($id)
    {
        return response()->json([
            'message' => "DELETE strādā priekš ID = $id"
        ]);
    }
}
