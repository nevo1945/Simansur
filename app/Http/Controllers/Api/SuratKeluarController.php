<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SuratKeluar;
use App\Models\TindakLanjutKeluar;
use App\Models\Notifikasi;
use App\Models\LogAktivitas;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class SuratKeluarController extends Controller
{
    /**
     * Display a listing of surat keluar.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = SuratKeluar::with([
            'creator:id,nama_lengkap,role',
            'verifier:id,nama_lengkap,role',
            'approver:id,nama_lengkap,role',
        ]);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('sifat')) {
            $query->where('sifat', $request->sifat);
        }

        if ($request->filled('jenis_dokumen')) {
            $query->where('jenis_dokumen', $request->jenis_dokumen);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('no_agenda', 'like', "%{$search}%")
                  ->orWhere('no_surat', 'like', "%{$search}%")
                  ->orWhere('opd_tujuan', 'like', "%{$search}%")
                  ->orWhere('perihal', 'like', "%{$search}%");
            });
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('tanggal_surat', [$request->start_date, $request->end_date]);
        }

        // Quick tabs
        if ($request->tab === 'perlu_tindakan') {
            if ($user->isAdmin()) {
                $query->whereIn('status', ['disetujui_kabid', 'dikembalikan']);
            } elseif ($user->isKabid()) {
                $query->whereIn('status', ['diverifikasi_admin', 'diinput']);
            }
        } elseif ($request->tab === 'selesai') {
            $query->where('status', 'diarsipkan');
        }

        $suratKeluar = $query->orderBy('id', 'desc')->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $suratKeluar,
        ]);
    }

    /**
     * Store newly created surat keluar (Admin only) and forward immediately to Kabid for approval.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Hanya Admin yang dapat menginput surat keluar.'], 403);
        }

        $request->validate([
            'no_surat' => 'required|string|max:255',
            'tanggal_surat' => 'required|date',
            'opd_tujuan' => 'required|string|max:255',
            'perihal' => 'required|string',
            'sifat' => ['required', Rule::in(['biasa', 'penting', 'segera', 'rahasia'])],
            'jenis_dokumen' => ['required', Rule::in(['surat', 'berita_acara', 'bast'])],
            'keterangan' => 'nullable|string',
            'file_scan' => 'required|file|mimes:pdf,jpg,jpeg,png|max:20480',
        ], [
            'file_scan.required' => 'File scan dokumen lengkap wajib diunggah.',
            'file_scan.max' => 'Ukuran file scan maksimal 20 MB.',
            'file_scan.mimes' => 'Format file scan harus PDF, JPG, JPEG, atau PNG.',
        ]);

        return DB::transaction(function () use ($request, $user) {
            $path = $request->file('file_scan')->store('surat-keluar', 'public');
            $noAgenda = SuratKeluar::generateNoAgenda();

            $surat = SuratKeluar::create([
                'no_agenda' => $noAgenda,
                'no_surat' => $request->no_surat,
                'tanggal_surat' => $request->tanggal_surat,
                'opd_tujuan' => $request->opd_tujuan,
                'perihal' => $request->perihal,
                'sifat' => $request->sifat,
                'jenis_dokumen' => $request->jenis_dokumen,
                'file_scan' => $path,
                'status' => 'diverifikasi_admin', // Langsung diteruskan ke Kabid untuk approval
                'created_by' => $user->id,
                'verified_by' => $user->id,
                'keterangan' => $request->keterangan,
            ]);

            TindakLanjutKeluar::create([
                'surat_keluar_id' => $surat->id,
                'user_id' => $user->id,
                'jenis' => 'verifikasi',
                'catatan' => 'Surat keluar diinput oleh Admin dan langsung diteruskan ke Kepala Bidang untuk persetujuan (approval) arsip.',
                'created_at' => now(),
            ]);

            // Notifikasi ke Kabid
            $kabidList = User::where('role', 'kabid')->where('is_active', true)->get();
            foreach ($kabidList as $kabid) {
                Notifikasi::kirim(
                    $kabid->id,
                    'Surat Keluar Baru Menunggu Approval',
                    "Admin menginput surat keluar no. {$surat->no_agenda} ({$surat->opd_tujuan}). Menunggu persetujuan (approval) Anda.",
                    "/surat-keluar/{$surat->id}"
                );
            }

            LogAktivitas::catat(
                $user->id,
                'Input & Teruskan Surat Keluar',
                'Surat Keluar',
                $surat->id,
                "Admin menginput surat keluar no agenda {$surat->no_agenda} ({$surat->no_surat}) dan meneruskan ke Kabid",
                $request->ip()
            );

            return response()->json([
                'success' => true,
                'message' => 'Surat keluar berhasil disimpan dengan no agenda ' . $noAgenda . ' dan diteruskan ke Kepala Bidang untuk persetujuan.',
                'data' => $surat,
            ], 201);
        });
    }

    /**
     * Display the specified surat keluar (All authenticated users can view).
     */
    public function show($id, Request $request)
    {
        $surat = SuratKeluar::with([
            'creator:id,nama_lengkap,role,nip',
            'verifier:id,nama_lengkap,role,nip',
            'approver:id,nama_lengkap,role,nip',
            'tindakLanjutKeluar.user:id,nama_lengkap,role,bidang',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $surat,
        ]);
    }

    /**
     * Admin verifies surat keluar and sends to Kabid for approval.
     */
    public function verifikasiAdmin($id, Request $request)
    {
        $user = $request->user();
        if (!$user->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Hanya Admin yang dapat memverifikasi surat keluar.'], 403);
        }

        $request->validate([
            'catatan' => 'nullable|string',
        ]);

        $surat = SuratKeluar::findOrFail($id);

        return DB::transaction(function () use ($surat, $user, $request) {
            $surat->status = 'diverifikasi_admin';
            $surat->verified_by = $user->id;
            $surat->save();

            TindakLanjutKeluar::create([
                'surat_keluar_id' => $surat->id,
                'user_id' => $user->id,
                'jenis' => 'verifikasi',
                'catatan' => 'Data dan berkas scan telah diverifikasi oleh Admin. Diteruskan ke Kabid untuk persetujuan arsip: ' . ($request->catatan ?? 'Lengkap & Valid.'),
                'created_at' => now(),
            ]);

            // Notifikasi ke Kabid
            $kabidList = User::where('role', 'kabid')->where('is_active', true)->get();
            foreach ($kabidList as $kabid) {
                Notifikasi::kirim(
                    $kabid->id,
                    'Surat Keluar Siap Approval Arsip',
                    "Admin telah memverifikasi surat keluar no. {$surat->no_agenda} ({$surat->opd_tujuan}). Menunggu persetujuan Anda.",
                    "/surat-keluar/{$surat->id}"
                );
            }

            LogAktivitas::catat(
                $user->id,
                'Verifikasi Surat Keluar',
                'Surat Keluar',
                $surat->id,
                "Admin memverifikasi surat keluar {$surat->no_agenda} dan meneruskannya ke Kabid",
                $request->ip()
            );

            return response()->json([
                'success' => true,
                'message' => 'Surat keluar berhasil diverifikasi dan dikirimkan ke Kepala Bidang.',
                'data' => $surat,
            ]);
        });
    }

    /**
     * Kabid approves surat keluar for archiving (WAJIB).
     */
    public function approveKabid($id, Request $request)
    {
        $user = $request->user();
        if (!$user->isKabid()) {
            return response()->json(['success' => false, 'message' => 'Hanya Kepala Bidang yang berwenang memberikan persetujuan arsip.'], 403);
        }

        $request->validate([
            'catatan' => 'nullable|string',
        ]);

        $surat = SuratKeluar::findOrFail($id);

        return DB::transaction(function () use ($surat, $user, $request) {
            $surat->status = 'disetujui_kabid';
            $surat->approved_by = $user->id;
            $surat->approved_at = now();
            $surat->save();

            TindakLanjutKeluar::create([
                'surat_keluar_id' => $surat->id,
                'user_id' => $user->id,
                'jenis' => 'approval',
                'catatan' => 'Disetujui oleh Kepala Bidang Aset: ' . ($request->catatan ?? 'Sesuai prosedur. Silakan diarsipkan.'),
                'created_at' => now(),
            ]);

            // Notifikasi ke Admin
            $admins = User::where('role', 'admin')->where('is_active', true)->get();
            foreach ($admins as $admin) {
                Notifikasi::kirim(
                    $admin->id,
                    'Surat Keluar Disetujui Kabid',
                    "Kabid menyetujui arsip surat keluar no. {$surat->no_agenda}. Siap diarsipkan.",
                    "/surat-keluar/{$surat->id}"
                );
            }

            LogAktivitas::catat(
                $user->id,
                'Approval Surat Keluar',
                'Surat Keluar',
                $surat->id,
                "Kabid menyetujui surat keluar {$surat->no_agenda}",
                $request->ip()
            );

            return response()->json([
                'success' => true,
                'message' => 'Surat keluar berhasil disetujui Kabid. Siap diarsipkan oleh Admin.',
                'data' => $surat,
            ]);
        });
    }

    /**
     * Kabid returns surat keluar if there are corrections needed.
     */
    public function kembalikanKabid($id, Request $request)
    {
        $user = $request->user();
        if (!$user->isKabid()) {
            return response()->json(['success' => false, 'message' => 'Hanya Kepala Bidang yang dapat mengembalikan surat keluar.'], 403);
        }

        $request->validate([
            'catatan' => 'required|string',
        ]);

        $surat = SuratKeluar::findOrFail($id);

        return DB::transaction(function () use ($surat, $user, $request) {
            $surat->status = 'dikembalikan';
            $surat->save();

            TindakLanjutKeluar::create([
                'surat_keluar_id' => $surat->id,
                'user_id' => $user->id,
                'jenis' => 'pengembalian',
                'catatan' => "Dikembalikan oleh Kabid ke Admin: {$request->catatan}",
                'created_at' => now(),
            ]);

            // Notifikasi ke Admin
            $admins = User::where('role', 'admin')->where('is_active', true)->get();
            foreach ($admins as $admin) {
                Notifikasi::kirim(
                    $admin->id,
                    'Surat Keluar Dikembalikan Kabid',
                    "Kabid mengembalikan surat keluar no. {$surat->no_agenda}: {$request->catatan}",
                    "/surat-keluar/{$surat->id}"
                );
            }

            LogAktivitas::catat(
                $user->id,
                'Kembalikan Surat Keluar',
                'Surat Keluar',
                $surat->id,
                "Kabid mengembalikan surat keluar {$surat->no_agenda} ke Admin: {$request->catatan}",
                $request->ip()
            );

            return response()->json([
                'success' => true,
                'message' => 'Surat keluar berhasil dikembalikan ke Admin.',
                'data' => $surat,
            ]);
        });
    }

    /**
     * Admin archives surat keluar after Kabid approval.
     */
    public function arsipkan($id, Request $request)
    {
        $user = $request->user();
        if (!$user->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Hanya Admin yang berwenang mengarsipkan surat keluar.'], 403);
        }

        $surat = SuratKeluar::findOrFail($id);

        if ($surat->status !== 'disetujui_kabid') {
            return response()->json([
                'success' => false,
                'message' => 'Surat keluar BELUM dapat diarsipkan karena belum disetujui (approval) oleh Kepala Bidang.',
            ], 422);
        }

        return DB::transaction(function () use ($surat, $user, $request) {
            $surat->status = 'diarsipkan';
            $surat->save();

            TindakLanjutKeluar::create([
                'surat_keluar_id' => $surat->id,
                'user_id' => $user->id,
                'jenis' => 'arsip',
                'catatan' => 'Surat keluar resmi diarsipkan.',
                'created_at' => now(),
            ]);

            LogAktivitas::catat(
                $user->id,
                'Arsipkan Surat Keluar',
                'Surat Keluar',
                $surat->id,
                "Admin mengarsipkan surat keluar no {$surat->no_agenda}",
                $request->ip()
            );

            return response()->json([
                'success' => true,
                'message' => 'Surat keluar berhasil diarsipkan.',
                'data' => $surat,
            ]);
        });
    }

    /**
     * Soft delete surat keluar (Admin only).
     */
    public function destroy($id, Request $request)
    {
        $user = $request->user();
        if (!$user->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Hanya Admin yang dapat menghapus surat keluar.'], 403);
        }

        $surat = SuratKeluar::findOrFail($id);
        $noAgenda = $surat->no_agenda;
        $surat->delete();

        LogAktivitas::catat(
            $user->id,
            'Hapus Surat Keluar',
            'Surat Keluar',
            $id,
            "Admin menghapus (soft delete) surat keluar no agenda {$noAgenda}",
            $request->ip()
        );

        return response()->json([
            'success' => true,
            'message' => "Surat keluar no agenda {$noAgenda} berhasil dihapus.",
        ]);
    }
}
