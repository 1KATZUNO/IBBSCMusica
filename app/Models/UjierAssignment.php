<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UjierAssignment extends Model
{
    protected $fillable = ['ujier_service_id', 'nombre', 'responsabilidades', 'observaciones', 'detalles', 'orden'];

    public function ujierService()
    {
        return $this->belongsTo(UjierService::class);
    }
}
