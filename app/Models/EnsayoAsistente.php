<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EnsayoAsistente extends Model
{
    public $timestamps = false;

    protected $fillable = ['ensayo_id', 'nombre'];

    public function ensayo()
    {
        return $this->belongsTo(Ensayo::class);
    }
}
