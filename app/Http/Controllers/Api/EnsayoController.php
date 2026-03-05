<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ensayo;
use App\Models\EnsayoAsistente;
use Illuminate\Http\Request;

class EnsayoController extends Controller
{
    public function index()
    {
        return response()->json(
            Ensayo::withCount(['cantos', 'asistentes'])
                ->orderByDesc('fecha')
                ->orderByDesc('hora_inicio')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'fecha' => 'required|date',
            'hora_inicio' => 'required|string|max:10',
            'hora_fin' => 'required|string|max:10',
            'notas' => 'nullable|string|max:1000',
        ]);

        $ensayo = Ensayo::create($request->only(['fecha', 'hora_inicio', 'hora_fin', 'notas']));

        return response()->json($ensayo->loadCount(['cantos', 'asistentes']), 201);
    }

    public function show($id)
    {
        $ensayo = Ensayo::with(['cantos', 'asistentes'])->findOrFail($id);
        return response()->json($ensayo);
    }

    public function update(Request $request, $id)
    {
        $ensayo = Ensayo::findOrFail($id);

        $request->validate([
            'fecha' => 'sometimes|date',
            'hora_inicio' => 'sometimes|string|max:10',
            'hora_fin' => 'sometimes|string|max:10',
            'notas' => 'nullable|string|max:1000',
        ]);

        $ensayo->update($request->only(['fecha', 'hora_inicio', 'hora_fin', 'notas']));

        return response()->json($ensayo->load(['cantos', 'asistentes']));
    }

    public function destroy($id)
    {
        Ensayo::findOrFail($id)->delete();
        return response()->json(['message' => 'Ensayo eliminado']);
    }

    public function addCanto(Request $request, $id)
    {
        $ensayo = Ensayo::findOrFail($id);

        $request->validate([
            'canto_id' => 'required|exists:cantos,id',
        ]);

        $maxOrden = $ensayo->cantos()->max('ensayo_canto.orden') ?? -1;

        $ensayo->cantos()->attach($request->canto_id, ['orden' => $maxOrden + 1]);

        return response()->json($ensayo->load(['cantos', 'asistentes']));
    }

    public function removeCanto($id, $cantoId)
    {
        $ensayo = Ensayo::findOrFail($id);
        $ensayo->cantos()->detach($cantoId);

        return response()->json($ensayo->load(['cantos', 'asistentes']));
    }

    public function addAsistente(Request $request, $id)
    {
        $ensayo = Ensayo::findOrFail($id);

        $request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        $ensayo->asistentes()->create(['nombre' => $request->nombre]);

        return response()->json($ensayo->load(['cantos', 'asistentes']));
    }

    public function removeAsistente($id)
    {
        EnsayoAsistente::findOrFail($id)->delete();
        return response()->json(['message' => 'Asistente eliminado']);
    }
}
