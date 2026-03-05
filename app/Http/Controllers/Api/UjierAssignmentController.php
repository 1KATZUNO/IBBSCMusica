<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UjierAssignment;
use Illuminate\Http\Request;

class UjierAssignmentController extends Controller
{
    public function store(Request $request, $cultoId)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'responsabilidades' => 'required|string',
            'observaciones' => 'nullable|string',
            'detalles' => 'nullable|string',
        ]);

        $service = \App\Models\UjierService::where('culto_id', $cultoId)->firstOrFail();
        $maxOrden = UjierAssignment::where('ujier_service_id', $service->id)->max('orden') ?? -1;

        return UjierAssignment::create([
            'ujier_service_id' => $service->id,
            'nombre' => $request->nombre,
            'responsabilidades' => $request->responsabilidades,
            'observaciones' => $request->observaciones,
            'detalles' => $request->detalles,
            'orden' => $maxOrden + 1,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'sometimes|required|string|max:255',
            'responsabilidades' => 'sometimes|required|string',
            'observaciones' => 'nullable|string',
            'detalles' => 'nullable|string',
        ]);

        $assignment = UjierAssignment::findOrFail($id);
        $assignment->update($request->only(['nombre', 'responsabilidades', 'observaciones', 'detalles']));

        return $assignment;
    }

    public function destroy($id)
    {
        UjierAssignment::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
