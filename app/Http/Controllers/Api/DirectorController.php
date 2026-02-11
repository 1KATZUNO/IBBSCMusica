<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Director;
use Illuminate\Http\Request;

class DirectorController extends Controller
{
    public function index()
    {
        return response()->json(Director::orderBy('nombre')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:100',
        ]);

        $director = Director::create($data);

        return response()->json($director, 201);
    }

    public function update(Request $request, $id)
    {
        $director = Director::findOrFail($id);

        $data = $request->validate([
            'nombre' => 'sometimes|string|max:100',
            'activo' => 'sometimes|boolean',
        ]);

        $director->update($data);

        return response()->json($director);
    }

    public function destroy($id)
    {
        $director = Director::findOrFail($id);

        // Set cultos with this director to null
        $director->cultos()->update(['director_id' => null]);
        $director->delete();

        return response()->json(['message' => 'Director eliminado']);
    }
}
