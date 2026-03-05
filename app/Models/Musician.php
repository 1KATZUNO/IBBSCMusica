<?php

namespace App\Models;

use App\Models\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;

class Musician extends Model
{
    use BelongsToOrganization;

    protected $fillable = ['organization_id', 'nombre', 'activo'];

    protected function casts(): array
    {
        return ['activo' => 'boolean'];
    }

    public function roles()
    {
        return $this->belongsToMany(MusicianRole::class);
    }

    public function cultos()
    {
        return $this->belongsToMany(Culto::class, 'culto_musician')
            ->withPivot('musician_role_id')
            ->withTimestamps();
    }
}
