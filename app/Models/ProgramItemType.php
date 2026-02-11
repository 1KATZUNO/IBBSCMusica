<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgramItemType extends Model
{
    protected $fillable = ['slug', 'label', 'emoji', 'bg_color', 'is_system', 'requires_canto'];

    protected function casts(): array
    {
        return [
            'is_system' => 'boolean',
            'requires_canto' => 'boolean',
        ];
    }
}
