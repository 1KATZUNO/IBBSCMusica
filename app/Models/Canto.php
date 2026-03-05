<?php

namespace App\Models;

use App\Models\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Model;

class Canto extends Model
{
    use BelongsToOrganization;

    protected $fillable = ['organization_id', 'nombre', 'youtube_url'];
}
