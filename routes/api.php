<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CantoController;
use App\Http\Controllers\Api\CultoController;
use App\Http\Controllers\Api\CultoMusicianController;
use App\Http\Controllers\Api\DirectorController;
use App\Http\Controllers\Api\MusicianController;
use App\Http\Controllers\Api\MusicianRoleController;
use App\Http\Controllers\Api\ProgramItemController;
use App\Http\Controllers\Api\ProgramItemTypeController;
use App\Http\Controllers\Api\SettingController;
use Illuminate\Support\Facades\Route;

// Public endpoints
Route::get('/cultos', [CultoController::class, 'index']);
Route::get('/cultos/{id}', [CultoController::class, 'show']);
Route::get('/cantos', [CantoController::class, 'index']);
Route::get('/program-item-types', [ProgramItemTypeController::class, 'index']);
Route::get('/musician-roles', [MusicianRoleController::class, 'index']);
Route::get('/directors', [DirectorController::class, 'index']);
Route::get('/musicians', [MusicianController::class, 'index']);
Route::get('/settings/director-name', [SettingController::class, 'directorName']);

// Auth
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);

    // Admin routes
    Route::middleware('admin')->group(function () {
        // Cultos
        Route::post('/cultos', [CultoController::class, 'store']);
        Route::put('/cultos/{id}', [CultoController::class, 'update']);
        Route::delete('/cultos/{id}', [CultoController::class, 'destroy']);

        // Program items
        Route::post('/cultos/{cultoId}/program-items', [ProgramItemController::class, 'store']);
        Route::put('/cultos/{cultoId}/program-items/{itemId}', [ProgramItemController::class, 'update']);
        Route::delete('/cultos/{cultoId}/program-items/{itemId}', [ProgramItemController::class, 'destroy']);
        Route::put('/cultos/{cultoId}/program-items-reorder', [ProgramItemController::class, 'reorder']);

        // Culto musicians
        Route::post('/cultos/{cultoId}/musicians', [CultoMusicianController::class, 'store']);
        Route::delete('/cultos/{cultoId}/musicians/{pivotId}', [CultoMusicianController::class, 'destroy']);

        // Cantos CRUD
        Route::post('/cantos', [CantoController::class, 'store']);
        Route::put('/cantos/{id}', [CantoController::class, 'update']);
        Route::delete('/cantos/{id}', [CantoController::class, 'destroy']);

        // Musicians CRUD
        Route::post('/musicians', [MusicianController::class, 'store']);
        Route::put('/musicians/{id}', [MusicianController::class, 'update']);
        Route::delete('/musicians/{id}', [MusicianController::class, 'destroy']);

        // Directors CRUD
        Route::post('/directors', [DirectorController::class, 'store']);
        Route::put('/directors/{id}', [DirectorController::class, 'update']);
        Route::delete('/directors/{id}', [DirectorController::class, 'destroy']);

        // Program item types
        Route::post('/program-item-types', [ProgramItemTypeController::class, 'store']);
        Route::put('/program-item-types/{id}', [ProgramItemTypeController::class, 'update']);
        Route::delete('/program-item-types/{id}', [ProgramItemTypeController::class, 'destroy']);

        // Settings
        Route::put('/settings/director-name', [SettingController::class, 'updateDirectorName']);
    });
});
