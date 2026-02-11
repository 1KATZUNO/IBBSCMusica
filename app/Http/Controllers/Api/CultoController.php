<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Culto;
use App\Models\Director;
use Illuminate\Http\Request;

class CultoController extends Controller
{
    public function index()
    {
        $cultos = Culto::with('director')
            ->orderBy('fecha')
            ->orderBy('hora')
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'tipo' => $c->tipo,
                'fecha' => $c->fecha->toDateString(),
                'hora' => $c->hora,
                'color' => $c->color,
                'programa_count' => $c->programItems()->count(),
            ]);

        return response()->json($cultos);
    }

    public function show($id)
    {
        $culto = Culto::with([
            'director',
            'programItems.type',
            'programItems.canto',
            'musicians.roles',
        ])->findOrFail($id);

        $musiciansPivot = \DB::table('culto_musician')
            ->where('culto_id', $culto->id)
            ->get();

        $musicos = $culto->musicians->map(function ($m) use ($musiciansPivot) {
            $pivot = $musiciansPivot->firstWhere('musician_id', $m->id);
            $roleName = \App\Models\MusicianRole::find($pivot->musician_role_id)?->nombre;

            return [
                'id' => $m->id,
                'nombre' => $m->nombre,
                'role_in_culto' => $roleName,
                'display' => "{$m->nombre} ({$roleName})",
                'pivot_id' => $pivot->id,
            ];
        });

        return response()->json([
            'id' => $culto->id,
            'tipo' => $culto->tipo,
            'fecha' => $culto->fecha->toDateString(),
            'hora' => $culto->hora,
            'color' => $culto->color,
            'director_id' => $culto->director_id,
            'director' => $culto->director?->nombre,
            'musicos' => $musicos,
            'programa' => $culto->programItems->map(fn($item) => [
                'id' => $item->id,
                'tipo' => $item->type->slug,
                'tipo_label' => $item->type->label,
                'emoji' => $item->type->emoji,
                'bg_color' => $item->type->bg_color,
                'orden' => $item->orden,
                'canto' => $item->canto ? [
                    'id' => $item->canto->id,
                    'nombre' => $item->canto->nombre,
                    'youtube_url' => $item->canto->youtube_url,
                ] : null,
                'responsable' => $item->responsable,
                'titulo' => $item->titulo,
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'tipo' => 'required|string|max:50',
            'fecha' => 'required|date',
            'hora' => 'required|string|max:20',
            'color' => 'nullable|string|max:20',
            'director_id' => 'nullable|exists:directors,id',
        ]);

        if (empty($data['color'])) {
            $colors = ['#E8B931', '#6B8F71', '#B56357', '#7B6B9D', '#5C86A3'];
            $data['color'] = $colors[array_rand($colors)];
        }

        // If no director selected, use first active director
        if (empty($data['director_id'])) {
            $defaultDirector = Director::where('activo', true)->first();
            if ($defaultDirector) {
                $data['director_id'] = $defaultDirector->id;
            }
        }

        $culto = Culto::create($data);
        $culto->load('director');

        return response()->json([
            'id' => $culto->id,
            'tipo' => $culto->tipo,
            'fecha' => $culto->fecha->toDateString(),
            'hora' => $culto->hora,
            'color' => $culto->color,
            'director_id' => $culto->director_id,
            'director' => $culto->director?->nombre,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $culto = Culto::findOrFail($id);

        $data = $request->validate([
            'tipo' => 'sometimes|string|max:50',
            'fecha' => 'sometimes|date',
            'hora' => 'sometimes|string|max:20',
            'color' => 'sometimes|string|max:20',
            'director_id' => 'sometimes|nullable|exists:directors,id',
        ]);

        $culto->update($data);
        $culto->load('director');

        return response()->json($culto);
    }

    public function destroy($id)
    {
        Culto::findOrFail($id)->delete();

        return response()->json(['message' => 'Culto eliminado']);
    }
}
