<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Culto extends Model
{
    protected $fillable = ['tipo', 'fecha', 'hora', 'color', 'director_id'];

    protected function casts(): array
    {
        return ['fecha' => 'date'];
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
