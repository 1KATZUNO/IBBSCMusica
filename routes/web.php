<?php

use App\Http\Controllers\Api\SocialAuthController;
use Illuminate\Support\Facades\Route;

// Google OAuth callback (must be web route for redirect)
Route::get('/auth/google/callback', [SocialAuthController::class, 'callback']);

// SPA catch-all
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');
