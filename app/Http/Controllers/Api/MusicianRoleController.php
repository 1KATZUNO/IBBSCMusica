<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MusicianRole;

class MusicianRoleController extends Controller
{
    public function index()
    {
        return response()->json(MusicianRole::orderBy('nombre')->get());
    }
}
