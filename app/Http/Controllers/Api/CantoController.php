<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Canto;
use Illuminate\Http\Request;

class CantoController extends Controller
{
    public function index()
    {
        return response()->json(Canto::orderBy('nombre')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:200',
            'youtube_url' => 'nullable|string|max:500',
        ]);

        $canto = Canto::create($data);

        return response()->json($canto, 201);
    }

    public function update(Request $request, $id)
    {
        $canto = Canto::findOrFail($id);

        $data = $request->validate([
            'nombre' => 'sometimes|string|max:200',
            'youtube_url' => 'nullable|string|max:500',
        ]);

        $canto->update($data);

        return response()->json($canto);
    }

    public function destroy($id)
    {
        Canto::findOrFail($id)->delete();

        return response()->json(['message' => 'Canto eliminado']);
    }
}
