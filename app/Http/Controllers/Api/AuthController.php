<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'username' => ['Kombinasi nama pengguna (username) dan kata sandi salah.'],
            ]);
        }

        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Akun Anda dinonaktifkan oleh administrator. Silakan hubungi admin BPKAD.',
            ], 403);
        }

        // Token lifetime: 8 hours (480 minutes) as specified in rules
        $token = $user->createToken('simansur_auth_token', ['*'], now()->addHours(8))->plainTextToken;

        LogAktivitas::catat(
            $user->id,
            'Login',
            'Autentikasi',
            $user->id,
            "Pengguna {$user->nama_lengkap} ({$user->role}) berhasil masuk ke sistem.",
            $request->ip()
        );

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil. Selamat datang di SIMANSUR BPKAD Kota Pekanbaru.',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'nama_lengkap' => $user->nama_lengkap,
                    'nip' => $user->nip,
                    'email' => $user->email,
                    'role' => $user->role,
                    'bidang' => $user->bidang,
                ],
            ],
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'nama_lengkap' => $user->nama_lengkap,
                    'nip' => $user->nip,
                    'email' => $user->email,
                    'role' => $user->role,
                    'bidang' => $user->bidang,
                    'is_active' => $user->is_active,
                ],
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        if ($user) {
            LogAktivitas::catat(
                $user->id,
                'Logout',
                'Autentikasi',
                $user->id,
                "Pengguna {$user->nama_lengkap} keluar dari sistem.",
                $request->ip()
            );
            $user->currentAccessToken()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Berhasil keluar dari sistem.',
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Kata sandi saat ini tidak cocok.'],
            ]);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        LogAktivitas::catat(
            $user->id,
            'Ubah Password',
            'Akun Pengguna',
            $user->id,
            "Pengguna {$user->nama_lengkap} memperbarui kata sandi akun.",
            $request->ip()
        );

        return response()->json([
            'success' => true,
            'message' => 'Kata sandi berhasil diperbarui.',
        ]);
    }
}
