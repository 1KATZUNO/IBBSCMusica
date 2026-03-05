<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UjierReunion;
use App\Models\UjierService;
use Illuminate\Http\Request;

class UjierReunionController extends Controller
{
    /**
     * List all reuniones for the org, grouped by culto.
     */
    public function index(Request $request)
    {
        $orgId = $request->user()->organization_id;

        $reuniones = UjierReunion::whereHas('ujierService', function ($q) use ($orgId) {
            $q->whereHas('culto', function ($q2) use ($orgId) {
                $q2->where('organization_id', $orgId);
            });
        })
        ->with(['ujierService.culto:id,tipo,fecha,hora'])
        ->orderByDesc('id')
        ->get()
        ->map(function ($r) {
            return [
                'id' => $r->id,
                'descripcion' => $r->descripcion,
                'hora' => $r->hora,
                'lugar' => $r->lugar,
                'asistentes' => $r->asistentes,
                'orden' => $r->orden,
                'culto_id' => $r->ujierService->culto_id ?? null,
                'culto_tipo' => $r->ujierService->culto->tipo ?? null,
                'culto_fecha' => $r->ujierService->culto->fecha ?? null,
            ];
        });

        return response()->json($reuniones);
    }

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
