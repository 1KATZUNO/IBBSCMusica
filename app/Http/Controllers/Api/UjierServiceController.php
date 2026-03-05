<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Culto;
use App\Models\UjierService;
use Illuminate\Http\Request;

class UjierServiceController extends Controller
{
    public function show($cultoId)
    {
        $culto = Culto::findOrFail($cultoId);

        $service = UjierService::firstOrCreate(
            ['culto_id' => $cultoId],
            [
                'nombre' => $culto->tipo,
                'fecha' => $culto->fecha,
            ]
        );

        return $service->load(['assignments', 'reuniones']);
    }

    public function update(Request $request, $cultoId)
    {
        $request->validate([
            'hora_llegada' => 'nullable|string|max:255',
            'vestimenta' => 'nullable|string|max:255',
            'notas' => 'nullable|string',
        ]);

        $service = UjierService::where('culto_id', $cultoId)->firstOrFail();
        $service->update($request->only(['hora_llegada', 'vestimenta', 'notas']));

        return $service->load(['assignments', 'reuniones']);
    }
}
