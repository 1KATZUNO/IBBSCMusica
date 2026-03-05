<?php

namespace App\Models;

use App\Models\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;

class ServidorRole extends Model
{
    use BelongsToOrganization;

    protected $fillable = ['organization_id', 'nombre'];

    public function servidores()
    {
        return $this->belongsToMany(Servidor::class, 'servidor_servidor_role');
    }
}
