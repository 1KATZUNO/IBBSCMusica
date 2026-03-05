<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invitation;
use App\Models\MusicianRole;
use App\Models\Organization;
use App\Models\ServidorRole;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !$user->password || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $this->userPayload($user),
            'token' => $token,
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'admin',
        ]);

        // Check for pending invitations
        $invitation = Invitation::where('email', $request->email)
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->first();

        if ($invitation) {
            $user->update([
                'organization_id' => $invitation->organization_id,
                'role' => $invitation->role,
            ]);
            $invitation->update(['accepted_at' => now()]);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => $this->userPayload($user->fresh()),
            'token' => $token,
        ], 201);
    }

    public function setupOrganization(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $user = $request->user();

        if ($user->organization_id) {
            return response()->json(['message' => 'Ya tienes una organizacion.'], 422);
        }

        $slug = Str::slug($request->name);
        $baseSlug = $slug;
        $counter = 1;
        while (Organization::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }

        $org = Organization::create([
            'name' => $request->name,
            'slug' => $slug,
        ]);

        $user->update([
            'organization_id' => $org->id,
            'role' => 'admin',
        ]);

        // Seed default musician roles for this org
        $defaultRoles = ['Voz', 'Guitarra', 'Piano', 'Bajo', 'Bateria', 'Ukelele', 'Guitarra Electrica', 'Cajon'];
        foreach ($defaultRoles as $role) {
            MusicianRole::withoutGlobalScopes()->create([
                'organization_id' => $org->id,
                'nombre' => $role,
            ]);
        }

        // Seed default servidor roles for this org
        $defaultServidorRoles = ['Predicador', 'Lector', 'Orador', 'Ujier'];
        foreach ($defaultServidorRoles as $role) {
            ServidorRole::withoutGlobalScopes()->create([
                'organization_id' => $org->id,
                'nombre' => $role,
            ]);
        }

        return response()->json([
            'user' => $this->userPayload($user->fresh()),
            'organization' => $org,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesion cerrada']);
    }

    public function user(Request $request)
    {
        return response()->json($this->userPayload($request->user()));
    }

    private function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'avatar' => $user->avatar,
            'organization_id' => $user->organization_id,
            'organization' => $user->organization,
            'needs_organization' => !$user->organization_id,
        ];
    }
}
