<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CantoController;
use App\Http\Controllers\Api\CultoController;
use App\Http\Controllers\Api\CultoMusicianController;
use App\Http\Controllers\Api\DirectorController;
use App\Http\Controllers\Api\EnsayoController;
use App\Http\Controllers\Api\InvitationController;
use App\Http\Controllers\Api\MusicianController;
use App\Http\Controllers\Api\MusicianRoleController;
use App\Http\Controllers\Api\OrganizationController;
use App\Http\Controllers\Api\ProgramItemController;
use App\Http\Controllers\Api\ProgramItemTypeController;
use App\Http\Controllers\Api\ServidorController;
use App\Http\Controllers\Api\ServidorRoleController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\SocialAuthController;
use App\Http\Controllers\Api\UjierAssignmentController;
use App\Http\Controllers\Api\UjierReunionController;
use App\Http\Controllers\Api\UjierServiceController;
use Illuminate\Support\Facades\Route;

// Public auth
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::get('/auth/google/redirect', [SocialAuthController::class, 'redirect']);
Route::post('/auth/google-mobile', [SocialAuthController::class, 'mobileCallback']);

// Invitation (public - accept by token)
Route::get('/invitations/{token}', [InvitationController::class, 'show']);
Route::post('/invitations/{token}/accept', [InvitationController::class, 'accept']);

// Auth without org requirement
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::post('/auth/setup-organization', [AuthController::class, 'setupOrganization']);
    Route::post('/auth/leave-organization', [AuthController::class, 'leaveOrganization']);
});

// Auth + org required (read access)
Route::middleware(['auth:sanctum', 'org'])->group(function () {
    Route::get('/cultos', [CultoController::class, 'index']);
    Route::get('/cultos/{id}', [CultoController::class, 'show']);
    Route::get('/cantos', [CantoController::class, 'index']);
    Route::get('/program-item-types', [ProgramItemTypeController::class, 'index']);
    Route::get('/musician-roles', [MusicianRoleController::class, 'index']);
    Route::get('/directors', [DirectorController::class, 'index']);
    Route::get('/musicians', [MusicianController::class, 'index']);
    Route::get('/settings/director-name', [SettingController::class, 'directorName']);
    Route::get('/servidores', [ServidorController::class, 'index']);
    Route::get('/servidor-roles', [ServidorRoleController::class, 'index']);

    // Ensayos (read)
    Route::get('/ensayos', [EnsayoController::class, 'index']);
    Route::get('/ensayos/{id}', [EnsayoController::class, 'show']);

    // Ujieres (read - auto creates service if needed)
    Route::get('/cultos/{culto}/ujieres', [UjierServiceController::class, 'show']);

    // Reuniones (all across cultos)
    Route::get('/reuniones', [UjierReunionController::class, 'index']);

    // Admin routes
    Route::middleware('admin')->group(function () {
        // Cultos
        Route::post('/cultos', [CultoController::class, 'store']);
        Route::put('/cultos/{id}', [CultoController::class, 'update']);
        Route::delete('/cultos/{id}', [CultoController::class, 'destroy']);

        // Live mode
        Route::post('/cultos/{id}/start', [CultoController::class, 'start']);
        Route::post('/cultos/{id}/stop', [CultoController::class, 'stop']);

        // Program items
        Route::post('/cultos/{cultoId}/program-items', [ProgramItemController::class, 'store']);
        Route::put('/cultos/{cultoId}/program-items/{itemId}', [ProgramItemController::class, 'update']);
        Route::delete('/cultos/{cultoId}/program-items/{itemId}', [ProgramItemController::class, 'destroy']);
        Route::put('/cultos/{cultoId}/program-items-reorder', [ProgramItemController::class, 'reorder']);
        Route::post('/cultos/{cultoId}/program-items/{itemId}/complete', [ProgramItemController::class, 'complete']);
        Route::post('/cultos/{cultoId}/program-items/{itemId}/uncomplete', [ProgramItemController::class, 'uncomplete']);

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

        // Ujieres (admin)
        Route::put('/cultos/{culto}/ujieres', [UjierServiceController::class, 'update']);
        Route::post('/cultos/{culto}/ujieres/assignments', [UjierAssignmentController::class, 'store']);
        Route::put('/ujier-assignments/{id}', [UjierAssignmentController::class, 'update']);
        Route::delete('/ujier-assignments/{id}', [UjierAssignmentController::class, 'destroy']);
        Route::post('/cultos/{culto}/ujieres/reuniones', [UjierReunionController::class, 'store']);
        Route::put('/ujier-reuniones/{id}', [UjierReunionController::class, 'update']);
        Route::delete('/ujier-reuniones/{id}', [UjierReunionController::class, 'destroy']);

        // Ensayos CRUD
        Route::post('/ensayos', [EnsayoController::class, 'store']);
        Route::put('/ensayos/{id}', [EnsayoController::class, 'update']);
        Route::delete('/ensayos/{id}', [EnsayoController::class, 'destroy']);
        Route::post('/ensayos/{id}/cantos', [EnsayoController::class, 'addCanto']);
        Route::delete('/ensayos/{id}/cantos/{cantoId}', [EnsayoController::class, 'removeCanto']);
        Route::post('/ensayos/{id}/asistentes', [EnsayoController::class, 'addAsistente']);
        Route::delete('/ensayo-asistentes/{id}', [EnsayoController::class, 'removeAsistente']);

        // Servidores CRUD
        Route::post('/servidores', [ServidorController::class, 'store']);
        Route::put('/servidores/{id}', [ServidorController::class, 'update']);
        Route::delete('/servidores/{id}', [ServidorController::class, 'destroy']);

        // Invitations management
        Route::get('/invitations', [InvitationController::class, 'index']);
        Route::post('/invitations', [InvitationController::class, 'store']);
        Route::delete('/invitations/{id}', [InvitationController::class, 'destroy']);

        // Organization members management
        Route::get('/organization/members', [OrganizationController::class, 'members']);
        Route::put('/organization/members/{userId}/role', [OrganizationController::class, 'updateRole']);
        Route::delete('/organization/members/{userId}', [OrganizationController::class, 'removeMember']);
    });
});
