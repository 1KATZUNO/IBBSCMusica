<?php

namespace App\Models;

use App\Models\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;

class Servidor extends Model
{
    use BelongsToOrganization;

    protected $table = 'servidores';

    protected $fillable = ['organization_id', 'nombre', 'activo'];

    protected function casts(): array
    {
        return ['activo' => 'boolean'];
    }

    public function roles()
    {
        return $this->belongsToMany(ServidorRole::class, 'servidor_servidor_role');
    }
}
