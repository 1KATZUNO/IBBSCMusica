<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UjierReunion extends Model
{
    protected $table = 'ujier_reuniones';

    protected $fillable = ['ujier_service_id', 'descripcion', 'hora', 'lugar', 'asistentes', 'orden'];

    public function ujierService()
    {
        return $this->belongsTo(UjierService::class);
    }
}
