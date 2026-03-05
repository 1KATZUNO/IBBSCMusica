<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Servidor;
use Illuminate\Http\Request;

class ServidorController extends Controller
{
    public function index()
    {
        return response()->json(
            Servidor::with('roles')->orderBy('nombre')->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'role_ids' => 'array|max:4',
            'role_ids.*' => 'exists:servidor_roles,id',
        ]);

        $servidor = Servidor::create(['nombre' => $request->nombre]);

        if ($request->role_ids) {
            $servidor->roles()->sync($request->role_ids);
        }

        return response()->json($servidor->load('roles'), 201);
    }

    public function update(Request $request, $id)
    {
        $servidor = Servidor::findOrFail($id);

        $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'activo' => 'sometimes|boolean',
            'role_ids' => 'sometimes|array|max:4',
            'role_ids.*' => 'exists:servidor_roles,id',
        ]);

        $servidor->update($request->only(['nombre', 'activo']));

        if ($request->has('role_ids')) {
            $servidor->roles()->sync($request->role_ids);
        }

        return response()->json($servidor->load('roles'));
    }

    public function destroy($id)
    {
        Servidor::findOrFail($id)->delete();
        return response()->json(['message' => 'Servidor eliminado']);
    }
}
