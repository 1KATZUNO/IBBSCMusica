<?php

namespace App\Models;

use App\Models\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;

class MusicianRole extends Model
{
    use BelongsToOrganization;

    protected $fillable = ['organization_id', 'nombre'];

    public function musicians()
    {
        return $this->belongsToMany(Musician::class);
    }
}
