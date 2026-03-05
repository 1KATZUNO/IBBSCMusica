<?php

namespace App\Models;

use App\Models\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;

class UjierService extends Model
{
    use BelongsToOrganization;

    protected $fillable = [
        'organization_id', 'culto_id', 'nombre', 'fecha', 'notas',
        'hora_llegada', 'vestimenta',
    ];

    protected function casts(): array
    {
        return ['fecha' => 'date'];
    }

    public function culto()
    {
        return $this->belongsTo(Culto::class);
    }

    public function assignments()
    {
        return $this->hasMany(UjierAssignment::class)->orderBy('orden');
    }

    public function reuniones()
    {
        return $this->hasMany(UjierReunion::class)->orderBy('orden');
    }
}
