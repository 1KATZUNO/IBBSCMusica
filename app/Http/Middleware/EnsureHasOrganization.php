<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureHasOrganization
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->organization_id) {
            return response()->json([
                'message' => 'Organization required',
                'needs_organization' => true,
            ], 403);
        }

        return $next($request);
    }
}
