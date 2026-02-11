<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Culto;
use App\Models\ProgramItem;
use Illuminate\Http\Request;

class ProgramItemController extends Controller
{
    public function store(Request $request, $cultoId)
    {
        $culto = Culto::findOrFail($cultoId);

        $data = $request->validate([
            'program_item_type_id' => 'required|exists:program_item_types,id',
            'canto_id' => 'nullable|exists:cantos,id',
            'responsable' => 'nullable|string|max:100',
            'titulo' => 'nullable|string|max:200',
        ]);

        $maxOrder = $culto->programItems()->max('orden') ?? 0;
        $data['orden'] = $maxOrder + 1;
        $data['culto_id'] = $culto->id;

        $item = ProgramItem::create($data);
        $item->load('type', 'canto');

        return response()->json([
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
        ], 201);
    }

    public function update(Request $request, $cultoId, $itemId)
    {
        $item = ProgramItem::where('culto_id', $cultoId)->findOrFail($itemId);

        $data = $request->validate([
            'program_item_type_id' => 'sometimes|exists:program_item_types,id',
            'canto_id' => 'nullable|exists:cantos,id',
            'responsable' => 'nullable|string|max:100',
            'titulo' => 'nullable|string|max:200',
        ]);

        $item->update($data);
        $item->load('type', 'canto');

        return response()->json([
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
        ]);
    }

    public function destroy($cultoId, $itemId)
    {
        $item = ProgramItem::where('culto_id', $cultoId)->findOrFail($itemId);
        $item->delete();

        return response()->json(['message' => 'Item eliminado']);
    }

    public function reorder(Request $request, $cultoId)
    {
        $data = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:program_items,id',
            'items.*.orden' => 'required|integer|min:1',
        ]);

        foreach ($data['items'] as $item) {
            ProgramItem::where('id', $item['id'])
                ->where('culto_id', $cultoId)
                ->update(['orden' => $item['orden']]);
        }

        return response()->json(['message' => 'Orden actualizado']);
    }
}
