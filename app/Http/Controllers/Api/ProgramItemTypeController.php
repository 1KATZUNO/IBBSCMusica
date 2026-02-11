<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProgramItemType;
use Illuminate\Http\Request;

class ProgramItemTypeController extends Controller
{
    public function index()
    {
        return response()->json(ProgramItemType::orderBy('id')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'slug' => 'required|string|max:50|unique:program_item_types',
            'label' => 'required|string|max:100',
            'emoji' => 'required|string|max:10',
            'bg_color' => 'required|string|max:50',
            'requires_canto' => 'boolean',
        ]);

        $data['is_system'] = false;

        $type = ProgramItemType::create($data);

        return response()->json($type, 201);
    }

    public function update(Request $request, $id)
    {
        $type = ProgramItemType::findOrFail($id);

        if ($type->is_system) {
            return response()->json(['message' => 'No se puede modificar un tipo del sistema'], 403);
        }

        $data = $request->validate([
            'slug' => 'sometimes|string|max:50|unique:program_item_types,slug,' . $id,
            'label' => 'sometimes|string|max:100',
            'emoji' => 'sometimes|string|max:10',
            'bg_color' => 'sometimes|string|max:50',
            'requires_canto' => 'sometimes|boolean',
        ]);

        $type->update($data);

        return response()->json($type);
    }

    public function destroy($id)
    {
        $type = ProgramItemType::findOrFail($id);

        if ($type->is_system) {
            return response()->json(['message' => 'No se puede eliminar un tipo del sistema'], 403);
        }

        $type->delete();

        return response()->json(['message' => 'Tipo eliminado']);
    }
}
