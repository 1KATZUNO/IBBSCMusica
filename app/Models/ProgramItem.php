<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgramItem extends Model
{
    protected $fillable = ['culto_id', 'program_item_type_id', 'orden', 'canto_id', 'responsable', 'titulo'];

    public function culto()
    {
        return $this->belongsTo(Culto::class);
    }

    public function type()
    {
        return $this->belongsTo(ProgramItemType::class, 'program_item_type_id');
    }

    public function canto()
    {
        return $this->belongsTo(Canto::class);
    }
}
