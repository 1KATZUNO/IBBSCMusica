<?php

namespace App\Models;

use App\Models\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;

class Culto extends Model
{
    use BelongsToOrganization;

    protected $fillable = ['organization_id', 'tipo', 'fecha', 'hora', 'color', 'director_id', 'started_at', 'completed_all_at'];

    protected function casts(): array
    {
        return [
            'fecha' => 'date',
            'started_at' => 'datetime',
            'completed_all_at' => 'datetime',
        ];
    }

    public function director()
    {
        return $this->belongsTo(Director::class);
    }

    public function programItems()
    {
        return $this->hasMany(ProgramItem::class)->orderBy('orden');
    }

    public function musicians()
    {
        return $this->belongsToMany(Musician::class, 'culto_musician')
            ->withPivot('musician_role_id')
            ->withTimestamps();
    }
}
