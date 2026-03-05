<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServidorRole;

class ServidorRoleController extends Controller
{
    public function index()
    {
        return response()->json(ServidorRole::orderBy('nombre')->get());
    }
}
