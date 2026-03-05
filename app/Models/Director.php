<?php

namespace App\Models;

use App\Models\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;

class Director extends Model
{
    use BelongsToOrganization;

    protected $fillable = ['organization_id', 'nombre', 'activo'];

    protected function casts(): array
    {
        return ['activo' => 'boolean'];
    }

    public function cultos()
    {
        return $this->hasMany(Culto::class);
    }
}
