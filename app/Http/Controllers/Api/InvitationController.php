<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\OrganizationInvitation;
use App\Models\Invitation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class InvitationController extends Controller
{
    public function index(Request $request)
    {
        $invitations = Invitation::where('organization_id', $request->user()->organization_id)
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->with('inviter:id,name')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($invitations);
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'role' => 'required|in:admin,member',
        ]);

        $user = $request->user();

        // Check if already a member
        $existing = User::where('email', $request->email)
            ->where('organization_id', $user->organization_id)
            ->exists();

        if ($existing) {
            return response()->json(['message' => 'Este usuario ya es miembro de la organizacion.'], 422);
        }

        // Check for pending invitation
        $pendingInvite = Invitation::where('email', $request->email)
            ->where('organization_id', $user->organization_id)
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->exists();

        if ($pendingInvite) {
            return response()->json(['message' => 'Ya existe una invitacion pendiente para este email.'], 422);
        }

        $invitation = Invitation::create([
            'organization_id' => $user->organization_id,
            'invited_by' => $user->id,
            'email' => $request->email,
            'role' => $request->role,
            'token' => Str::random(64),
            'expires_at' => now()->addDays(7),
        ]);

        $invitation->load('organization', 'inviter');

        Mail::to($request->email)->send(new OrganizationInvitation($invitation));

        return response()->json($invitation, 201);
    }

    public function destroy(Request $request, $id)
    {
        $invitation = Invitation::where('id', $id)
            ->where('organization_id', $request->user()->organization_id)
            ->firstOrFail();

        $invitation->delete();

        return response()->json(['message' => 'Invitacion revocada.']);
    }

    public function show($token)
    {
        $invitation = Invitation::where('token', $token)
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->with('organization:id,name')
            ->first();

        if (!$invitation) {
            return response()->json(['message' => 'Invitacion invalida o expirada.'], 404);
        }

        return response()->json([
            'email' => $invitation->email,
            'role' => $invitation->role,
            'organization' => $invitation->organization,
        ]);
    }

    public function accept(Request $request, $token)
    {
        $invitation = Invitation::where('token', $token)
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->firstOrFail();

        $user = User::where('email', $invitation->email)->first();

        if ($user) {
            // Existing user - assign to org
            $user->update([
                'organization_id' => $invitation->organization_id,
                'role' => $invitation->role,
            ]);
        } else {
            // New user - needs to register
            $request->validate([
                'name' => 'required|string|max:255',
                'password' => 'required|string|min:6',
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $invitation->email,
                'password' => Hash::make($request->password),
                'role' => $invitation->role,
                'organization_id' => $invitation->organization_id,
            ]);
        }

        $invitation->update(['accepted_at' => now()]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'organization_id' => $user->organization_id,
                'organization' => $user->organization,
            ],
            'token' => $token,
        ]);
    }
}
