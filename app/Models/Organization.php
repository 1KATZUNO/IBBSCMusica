<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    protected $fillable = ['name', 'slug'];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function cultos()
    {
        return $this->hasMany(Culto::class);
    }

    public function cantos()
    {
        return $this->hasMany(Canto::class);
    }

    public function musicians()
    {
        return $this->hasMany(Musician::class);
    }

    public function musicianRoles()
    {
        return $this->hasMany(MusicianRole::class);
    }

    public function directors()
    {
        return $this->hasMany(Director::class);
    }

    public function settings()
    {
        return $this->hasMany(Setting::class);
    }

    public function invitations()
    {
        return $this->hasMany(Invitation::class);
    }
}
