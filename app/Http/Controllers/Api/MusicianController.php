<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Musician;
use Illuminate\Http\Request;

class MusicianController extends Controller
{
    public function index()
    {
        $musicians = Musician::with('roles')
            ->orderBy('nombre')
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'nombre' => $m->nombre,
                'activo' => $m->activo,
                'roles' => $m->roles->map(fn($r) => [
                    'id' => $r->id,
                    'nombre' => $r->nombre,
                ]),
            ]);

        return response()->json($musicians);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:100',
            'activo' => 'boolean',
            'role_ids' => 'required|array|min:1|max:3',
            'role_ids.*' => 'exists:musician_roles,id',
        ]);

        $musician = Musician::create([
            'nombre' => $data['nombre'],
            'activo' => $data['activo'] ?? true,
        ]);

        $musician->roles()->attach($data['role_ids']);
        $musician->load('roles');

        return response()->json([
            'id' => $musician->id,
            'nombre' => $musician->nombre,
            'activo' => $musician->activo,
            'roles' => $musician->roles->map(fn($r) => [
                'id' => $r->id,
                'nombre' => $r->nombre,
            ]),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $musician = Musician::findOrFail($id);

        $data = $request->validate([
            'nombre' => 'sometimes|string|max:100',
            'activo' => 'sometimes|boolean',
            'role_ids' => 'sometimes|array|min:1|max:3',
            'role_ids.*' => 'exists:musician_roles,id',
        ]);

        $musician->update(collect($data)->only(['nombre', 'activo'])->toArray());

        if (isset($data['role_ids'])) {
            $musician->roles()->sync($data['role_ids']);
        }

        $musician->load('roles');

        return response()->json([
            'id' => $musician->id,
            'nombre' => $musician->nombre,
            'activo' => $musician->activo,
            'roles' => $musician->roles->map(fn($r) => [
                'id' => $r->id,
                'nombre' => $r->nombre,
            ]),
        ]);
    }

    public function destroy($id)
    {
        Musician::findOrFail($id)->delete();

        return response()->json(['message' => 'Músico eliminado']);
    }
}
