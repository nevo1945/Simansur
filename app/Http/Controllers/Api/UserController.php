<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request)
    {
        $currentUser = $request->user();

        $query = User::with('creator:id,nama_lengkap,role');

        if ($currentUser->isKasubid()) {
            // Kasubid can only see staff in their bidang
            $query->where('role', 'staff')->where('bidang', $currentUser->bidang);
        } elseif (!$currentUser->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Akses ditolak.'], 403);
        }

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('bidang')) {
            $query->where('bidang', $request->bidang);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%")
                  ->orWhere('nip', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('role')->orderBy('nama_lengkap')->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    /**
     * Store newly created user.
     */
    public function store(Request $request)
    {
        $currentUser = $request->user();

        // Admin can create any role; Kasubid can only register Staff in their bidang
        if ($currentUser->isKasubid()) {
            $allowedRole = ['staff'];
            $targetBidang = $currentUser->bidang;
        } elseif ($currentUser->isAdmin()) {
            $allowedRole = ['admin', 'kabid', 'kasubid', 'staff'];
            $targetBidang = $request->bidang;
        } else {
            return response()->json(['success' => false, 'message' => 'Akses ditolak.'], 403);
        }

        $request->validate([
            'username' => 'required|string|min:4|max:50|unique:users,username',
            'password' => 'required|string|min:8',
            'nama_lengkap' => 'required|string|max:255',
            'nip' => 'required|string|max:50|unique:users,nip',
            'email' => 'nullable|email|max:255',
            'role' => ['required', Rule::in($allowedRole)],
            'bidang' => ['nullable', Rule::in(['ipa', 'p3a'])],
        ]);

        $role = $currentUser->isKasubid() ? 'staff' : $request->role;
        $bidang = in_array($role, ['kasubid', 'staff']) ? ($currentUser->isKasubid() ? $currentUser->bidang : $request->bidang) : null;

        $user = User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'nama_lengkap' => $request->nama_lengkap,
            'nip' => $request->nip,
            'email' => $request->email,
            'role' => $role,
            'bidang' => $bidang,
            'is_active' => true,
            'created_by' => $currentUser->id,
        ]);

        LogAktivitas::catat(
            $currentUser->id,
            'Tambah User',
            'Manajemen User',
            $user->id,
            "{$currentUser->nama_lengkap} menambahkan pengguna baru {$user->nama_lengkap} ({$user->role})",
            $request->ip()
        );

        return response()->json([
            'success' => true,
            'message' => 'Pengguna baru berhasil didaftarkan.',
            'data' => $user,
        ], 201);
    }

    /**
     * Update user details.
     */
    public function update($id, Request $request)
    {
        $currentUser = $request->user();
        $user = User::findOrFail($id);

        if ($currentUser->isKasubid()) {
            if ($user->role !== 'staff' || $user->bidang !== $currentUser->bidang) {
                return response()->json(['success' => false, 'message' => 'Akses ditolak.'], 403);
            }
        } elseif (!$currentUser->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Akses ditolak.'], 403);
        }

        $request->validate([
            'username' => ['required', 'string', 'min:4', 'max:50', Rule::unique('users')->ignore($user->id)],
            'nama_lengkap' => 'required|string|max:255',
            'nip' => ['required', 'string', 'max:50', Rule::unique('users')->ignore($user->id)],
            'email' => 'nullable|email|max:255',
            'password' => 'nullable|string|min:8',
            'role' => ['nullable', Rule::in(['admin', 'kabid', 'kasubid', 'staff'])],
            'bidang' => ['nullable', Rule::in(['ipa', 'p3a'])],
        ]);

        $user->username = $request->username;
        $user->nama_lengkap = $request->nama_lengkap;
        $user->nip = $request->nip;
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        if ($currentUser->isAdmin() && $request->filled('role')) {
            $user->role = $request->role;
            $user->bidang = in_array($request->role, ['kasubid', 'staff']) ? $request->bidang : null;
        }

        $user->save();

        LogAktivitas::catat(
            $currentUser->id,
            'Update User',
            'Manajemen User',
            $user->id,
            "{$currentUser->nama_lengkap} memperbarui data pengguna {$user->nama_lengkap}",
            $request->ip()
        );

        return response()->json([
            'success' => true,
            'message' => 'Data pengguna berhasil diperbarui.',
            'data' => $user,
        ]);
    }

    /**
     * Toggle active status.
     */
    public function toggleActive($id, Request $request)
    {
        $currentUser = $request->user();
        if (!$currentUser->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Hanya Admin yang dapat mengubah status aktif akun.'], 403);
        }

        $user = User::findOrFail($id);
        if ($user->id === $currentUser->id) {
            return response()->json(['success' => false, 'message' => 'Anda tidak dapat menonaktifkan akun sendiri.'], 422);
        }

        $user->is_active = !$user->is_active;
        $user->save();

        $statusStr = $user->is_active ? 'diaktifkan' : 'dinonaktifkan';

        LogAktivitas::catat(
            $currentUser->id,
            'Ubah Status User',
            'Manajemen User',
            $user->id,
            "Admin mengubah status akun {$user->nama_lengkap} menjadi {$statusStr}",
            $request->ip()
        );

        return response()->json([
            'success' => true,
            'message' => "Akun {$user->nama_lengkap} berhasil {$statusStr}.",
            'data' => $user,
        ]);
    }

    /**
     * Get staff list by bidang for forwarding surat.
     */
    public function getStaffByBidang($bidang, Request $request)
    {
        $staff = User::where('role', 'staff')
            ->where('bidang', $bidang)
            ->where('is_active', true)
            ->select('id', 'nama_lengkap', 'nip', 'bidang')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $staff,
        ]);
    }
}
