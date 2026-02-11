<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MusicianRole extends Model
{
    protected $fillable = ['nombre'];

    public function musicians()
    {
        return $this->belongsToMany(Musician::class);
    }
}
