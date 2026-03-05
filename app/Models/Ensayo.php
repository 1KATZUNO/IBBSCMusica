<?php

namespace App\Models;

use App\Models\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;

class Ensayo extends Model
{
    use BelongsToOrganization;

    protected $fillable = ['organization_id', 'fecha', 'hora_inicio', 'hora_fin', 'notas'];

    protected function casts(): array
    {
        return [
            'fecha' => 'date',
        ];
    }

    public function cantos()
    {
        return $this->belongsToMany(Canto::class, 'ensayo_canto')
            ->withPivot('id', 'orden')
            ->orderByPivot('orden');
    }

    public function asistentes()
    {
        return $this->hasMany(EnsayoAsistente::class);
    }
}
