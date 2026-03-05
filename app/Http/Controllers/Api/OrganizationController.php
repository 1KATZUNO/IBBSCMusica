<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class OrganizationController extends Controller
{
    public function members(Request $request)
    {
        $members = User::where('organization_id', $request->user()->organization_id)
            ->select('id', 'name', 'email', 'role', 'avatar', 'created_at')
            ->orderBy('name')
            ->get();

        return response()->json($members);
    }

    public function updateRole(Request $request, $userId)
    {
        $request->validate([
            'role' => 'required|in:admin,member',
        ]);

        $member = User::where('id', $userId)
            ->where('organization_id', $request->user()->organization_id)
            ->firstOrFail();

        // Prevent removing last admin
        if ($member->isAdmin() && $request->role === 'member') {
            $adminCount = User::where('organization_id', $request->user()->organization_id)
                ->where('role', 'admin')
                ->count();

            if ($adminCount <= 1) {
                return response()->json(['message' => 'Debe haber al menos un admin en la organizacion.'], 422);
            }
        }

        $member->update(['role' => $request->role]);

        return response()->json($member);
    }

    public function removeMember(Request $request, $userId)
    {
        $member = User::where('id', $userId)
            ->where('organization_id', $request->user()->organization_id)
            ->firstOrFail();

        // Can't remove yourself
        if ($member->id === $request->user()->id) {
            return response()->json(['message' => 'No puedes eliminarte a ti mismo.'], 422);
        }

        $member->update(['organization_id' => null, 'role' => 'member']);

        return response()->json(['message' => 'Miembro eliminado de la organizacion.']);
    }
}
