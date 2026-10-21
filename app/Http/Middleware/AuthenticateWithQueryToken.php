<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateWithQueryToken
{
    /**
     * Handle an incoming request.
     * Allows passing Sanctum Bearer token via query parameter ?token=xxx
     * for direct browser navigation (window.open, download links, PDF print, etc.)
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->bearerToken()) {
            $token = $request->query('token') ?? $request->query('api_token');
            if ($token) {
                $request->headers->set('Authorization', 'Bearer ' . $token);
            }
        }

        return $next($request);
    }
}
