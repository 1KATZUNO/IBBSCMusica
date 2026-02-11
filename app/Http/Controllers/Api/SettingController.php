<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function directorName()
    {
        return response()->json([
            'director_name' => Setting::getValue('director_name', 'David'),
        ]);
    }

    public function updateDirectorName(Request $request)
    {
        $data = $request->validate([
            'director_name' => 'required|string|max:100',
        ]);

        Setting::setValue('director_name', $data['director_name']);

        return response()->json([
            'director_name' => $data['director_name'],
        ]);
    }
}
