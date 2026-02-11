<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Culto;
use Illuminate\Http\Request;

class CultoMusicianController extends Controller
{
    public function store(Request $request, $cultoId)
    {
        $culto = Culto::findOrFail($cultoId);

        $data = $request->validate([
            'musician_id' => 'required|exists:musicians,id',
            'musician_role_id' => 'required|exists:musician_roles,id',
        ]);

        $culto->musicians()->attach($data['musician_id'], [
            'musician_role_id' => $data['musician_role_id'],
        ]);

        return response()->json(['message' => 'Músico asignado'], 201);
    }

    public function destroy($cultoId, $pivotId)
    {
        $deleted = \DB::table('culto_musician')
            ->where('id', $pivotId)
            ->where('culto_id', $cultoId)
            ->delete();

        if (!$deleted) {
            return response()->json(['message' => 'No encontrado'], 404);
        }

        return response()->json(['message' => 'Músico removido']);
    }
}
