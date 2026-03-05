<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Mobile Google Sign-In: verify idToken and return user + API token.
     */
    public function mobileCallback(Request $request)
    {
        $request->validate(['idToken' => 'required|string']);

        $client = new \Google\Client(['client_id' => config('services.google.client_id')]);
        $payload = $client->verifyIdToken($request->idToken);

        if (!$payload) {
            return response()->json(['message' => 'Token inválido'], 401);
        }

        $googleId = $payload['sub'];
        $email = $payload['email'];
        $name = $payload['name'] ?? $email;
        $avatar = $payload['picture'] ?? null;

        $user = User::where('google_id', $googleId)->first();

        if (!$user) {
            $user = User::where('email', $email)->first();

            if ($user) {
                $user->update([
                    'google_id' => $googleId,
                    'avatar' => $avatar,
                ]);
            } else {
                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'google_id' => $googleId,
                    'avatar' => $avatar,
                    'role' => 'admin',
                ]);
            }
        } else {
            $user->update(['avatar' => $avatar]);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $user->load('organization'),
            'token' => $token,
        ]);
    }

    public function redirect()
    {
        $url = Socialite::driver('google')
            ->stateless()
            ->redirect()
            ->getTargetUrl();

        return response()->json(['url' => $url]);
    }

    public function callback()
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        $user = User::where('google_id', $googleUser->getId())->first();

        if (!$user) {
            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                // Link Google to existing account
                $user->update([
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                ]);
            } else {
                // Create new user
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'role' => 'admin',
                ]);
            }
        } else {
            $user->update(['avatar' => $googleUser->getAvatar()]);
        }

        $token = $user->createToken('api-token')->plainTextToken;
        $isNew = !$user->organization_id ? '1' : '0';

        // Redirect to frontend with token
        return redirect("/?token={$token}&new={$isNew}");
    }
}
