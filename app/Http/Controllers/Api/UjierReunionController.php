<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UjierReunion;
use App\Models\UjierService;
use Illuminate\Http\Request;

class UjierReunionController extends Controller
{
    public function store(Request $request, $cultoId)
    {
        $request->validate([
            'descripcion' => 'required|string|max:255',
            'hora' => 'nullable|string|max:255',
            'lugar' => 'nullable|string|max:255',
            'asistentes' => 'nullable|string',
        ]);

        $service = UjierService::where('culto_id', $cultoId)->firstOrFail();
        $maxOrden = UjierReunion::where('ujier_service_id', $service->id)->max('orden') ?? -1;

        return UjierReunion::create([
            'ujier_service_id' => $service->id,
            'descripcion' => $request->descripcion,
            'hora' => $request->hora,
            'lugar' => $request->lugar,
            'asistentes' => $request->asistentes,
            'orden' => $maxOrden + 1,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'descripcion' => 'sometimes|required|string|max:255',
            'hora' => 'nullable|string|max:255',
            'lugar' => 'nullable|string|max:255',
            'asistentes' => 'nullable|string',
        ]);

        $reunion = UjierReunion::findOrFail($id);
        $reunion->update($request->only(['descripcion', 'hora', 'lugar', 'asistentes']));

        return $reunion;
    }

    public function destroy($id)
    {
        UjierReunion::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
