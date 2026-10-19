<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SuratMasuk;
use App\Models\TindakLanjut;
use App\Models\Notifikasi;
use App\Models\LogAktivitas;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class SuratMasukController extends Controller
{
    /**
     * Display a listing of surat masuk with role-based scoping and filtering.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = SuratMasuk::with(['creator:id,nama_lengkap,role', 'approver:id,nama_lengkap,role']);

        // Scope by role:
        // Staff and Kabid and Admin can see all surat masuk
        // Kasubid views their own bidang by default unless searching/filtering
        if ($user->isKasubid() && !$request->filled('bidang_tujuan') && $request->tab !== 'selesai') {
            if ($user->bidang) {
                $query->where('bidang_tujuan', $user->bidang);
            }
        }

        // Filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('sifat')) {
            $query->where('sifat', $request->sifat);
        }

        if ($request->filled('bidang_tujuan')) {
            $query->where('bidang_tujuan', $request->bidang_tujuan);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('no_agenda', 'like', "%{$search}%")
                  ->orWhere('no_surat', 'like', "%{$search}%")
                  ->orWhere('opd_asal', 'like', "%{$search}%")
                  ->orWhere('perihal', 'like', "%{$search}%");
            });
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('tanggal_terima', [$request->start_date, $request->end_date]);
        }

        // Quick tabs
        if ($request->tab === 'perlu_tindakan') {
            if ($user->isAdmin()) {
                // Admin: siap diarsipkan atau ada perlu koreksi
                $query->whereIn('status', ['terverifikasi_kasubid', 'disetujui_kabid', 'perlu_koreksi']);
            } elseif ($user->isKabid()) {
                // Kabid: surat baru menunggu telaah & approval disposisi ke Kasubid, atau perlu koreksi
                $query->whereIn('status', ['baru', 'perlu_koreksi']);
            } elseif ($user->isKasubid()) {
                // Kasubid: surat masuk disposisi kabid menunggu teruskan ke staf, atau verifikasi laporan staf
                $query->whereIn('status', ['diteruskan_kasubid', 'selesai_staff'])
                      ->where('bidang_tujuan', $user->bidang);
            } elseif ($user->isStaff()) {
                // Staff: surat masuk ditugaskan ke staf untuk tindak lanjut
                $query->where('status', 'diteruskan_staff')
                      ->where('bidang_tujuan', $user->bidang);
            }
        } elseif ($request->tab === 'selesai') {
            $query->where('status', 'diarsipkan');
        }

        $suratMasuk = $query->orderBy('id', 'desc')->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $suratMasuk,
        ]);
    }

    /**
     * Store a newly created surat masuk (Admin only).
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Hanya Admin yang dapat menginput surat masuk.'], 403);
        }

        $request->validate([
            'no_surat' => 'required|string|max:255',
            'tanggal_surat' => 'required|date',
            'tanggal_terima' => 'required|date',
            'opd_asal' => 'required|string|max:255',
            'perihal' => 'required|string',
            'sifat' => ['required', Rule::in(['biasa', 'penting', 'segera', 'rahasia'])],
            'bidang_tujuan' => ['required', Rule::in(['ipa', 'p3a'])],
            'isi_disposisi' => 'nullable|string',
            'file_scan' => 'required|file|mimes:pdf,jpg,jpeg,png|max:20480', // 20 MB max
        ], [
            'file_scan.required' => 'File scan berkas lengkap (surat, disposisi, BAST, BA) wajib diunggah.',
            'file_scan.max' => 'Ukuran file scan maksimal 20 MB.',
            'file_scan.mimes' => 'Format file scan harus PDF, JPG, JPEG, atau PNG.',
        ]);

        return DB::transaction(function () use ($request, $user) {
            $path = $request->file('file_scan')->store('surat-masuk', 'public');
            $noAgenda = SuratMasuk::generateNoAgenda();

            $surat = SuratMasuk::create([
                'no_agenda' => $noAgenda,
                'no_surat' => $request->no_surat,
                'tanggal_surat' => $request->tanggal_surat,
                'tanggal_terima' => $request->tanggal_terima,
                'opd_asal' => $request->opd_asal,
                'perihal' => $request->perihal,
                'sifat' => $request->sifat,
                'bidang_tujuan' => $request->bidang_tujuan,
                'isi_disposisi' => $request->isi_disposisi,
                'file_scan' => $path,
                'status' => 'baru',
                'created_by' => $user->id,
            ]);

            // Catat tindak lanjut awal: Diteruskan ke Kabid
            TindakLanjut::create([
                'surat_masuk_id' => $surat->id,
                'user_id' => $user->id,
                'jenis' => 'teruskan',
                'catatan' => 'Surat masuk diinput oleh Admin dan diteruskan ke Kepala Bidang untuk persetujuan (approval) & arahan disposisi.',
                'created_at' => now(),
            ]);

            // Kirim notifikasi ke Kepala Bidang (Kabid)
            $kabidList = User::where('role', 'kabid')->where('is_active', true)->get();
            foreach ($kabidList as $kabid) {
                Notifikasi::kirim(
                    $kabid->id,
                    'Surat Masuk Baru Menunggu Telaah & Disposisi',
                    "Surat masuk no agenda {$surat->no_agenda} dari {$surat->opd_asal} memerlukan telaah, persetujuan, dan disposisi Kepala Bidang.",
                    "/surat-masuk/{$surat->id}"
                );
            }

            LogAktivitas::catat(
                $user->id,
                'Input Surat Masuk',
                'Surat Masuk',
                $surat->id,
                "Admin menginput surat masuk no agenda {$surat->no_agenda} ({$surat->no_surat}) dan meneruskan ke Kabid",
                $request->ip()
            );

            return response()->json([
                'success' => true,
                'message' => 'Surat masuk berhasil disimpan dengan no agenda ' . $noAgenda . ' dan diteruskan ke Kepala Bidang.',
                'data' => $surat,
            ], 201);
        });
    }

    /**
     * Display the specified surat masuk with timeline and documents.
     */
    public function show($id, Request $request)
    {
        $surat = SuratMasuk::with([
            'creator:id,nama_lengkap,role,nip',
            'approver:id,nama_lengkap,role,nip',
            'tindakLanjut.user:id,nama_lengkap,role,bidang',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $surat,
        ]);
    }

    /**
     * Kasubid forwards surat masuk to Staff.
     */
    public function teruskanKeStaff($id, Request $request)
    {
        $user = $request->user();
        if (!$user->isKasubid()) {
            return response()->json(['success' => false, 'message' => 'Hanya Kasubid yang dapat meneruskan ke Staff.'], 403);
        }

        $request->validate([
            'staff_id' => 'required|exists:users,id',
            'catatan' => 'required|string',
        ]);

        $surat = SuratMasuk::findOrFail($id);
        if ($surat->bidang_tujuan !== $user->bidang) {
            return response()->json(['success' => false, 'message' => 'Surat ini bukan untuk bidang Anda.'], 403);
        }

        $staff = User::where('id', $request->staff_id)->where('role', 'staff')->where('bidang', $user->bidang)->firstOrFail();

        return DB::transaction(function () use ($surat, $user, $staff, $request) {
            $surat->status = 'diteruskan_staff';
            $surat->save();

            TindakLanjut::create([
                'surat_masuk_id' => $surat->id,
                'user_id' => $user->id,
                'jenis' => 'teruskan',
                'catatan' => "Diteruskan ke staf {$staff->nama_lengkap}: {$request->catatan}",
                'created_at' => now(),
            ]);

            Notifikasi::kirim(
                $staff->id,
                'Tugas Tindak Lanjut Surat Masuk',
                "Kasubid {$user->nama_lengkap} menugaskan tindak lanjut surat no. {$surat->no_agenda} ({$surat->opd_asal}) kepada Anda.",
                "/surat-masuk/{$surat->id}"
            );

            LogAktivitas::catat(
                $user->id,
                'Teruskan ke Staff',
                'Surat Masuk',
                $surat->id,
                "Kasubid meneruskan surat no {$surat->no_agenda} ke staf {$staff->nama_lengkap}",
                $request->ip()
            );

            return response()->json([
                'success' => true,
                'message' => 'Surat berhasil diteruskan ke Staf ' . $staff->nama_lengkap,
                'data' => $surat,
            ]);
        });
    }

    /**
     * Kasubid marks mail as "perlu_koreksi" and returns to Admin if disposisi was misdirected.
     */
    public function perluKoreksi($id, Request $request)
    {
        $user = $request->user();
        if (!$user->isKasubid()) {
            return response()->json(['success' => false, 'message' => 'Hanya Kasubid yang dapat menandai perlu koreksi.'], 403);
        }

        $request->validate([
            'catatan' => 'required|string',
        ]);

        $surat = SuratMasuk::findOrFail($id);

        return DB::transaction(function () use ($surat, $user, $request) {
            $surat->status = 'perlu_koreksi';
            $surat->save();

            TindakLanjut::create([
                'surat_masuk_id' => $surat->id,
                'user_id' => $user->id,
                'jenis' => 'pengembalian',
                'catatan' => "Dikembalikan ke Admin untuk koreksi bidang tujuan: {$request->catatan}",
                'created_at' => now(),
            ]);

            // Notifikasi ke Kabid dan Admin
            $recipients = User::whereIn('role', ['kabid', 'admin'])->where('is_active', true)->get();
            foreach ($recipients as $recipient) {
                Notifikasi::kirim(
                    $recipient->id,
                    'Surat Masuk Memerlukan Koreksi Disposisi',
                    "Kasubid {$user->nama_lengkap} mengembalikan surat no. {$surat->no_agenda}: {$request->catatan}",
                    "/surat-masuk/{$surat->id}"
                );
            }

            LogAktivitas::catat(
                $user->id,
                'Koreksi Disposisi',
                'Surat Masuk',
                $surat->id,
                "Kasubid mengembalikan surat {$surat->no_agenda} ke Admin: {$request->catatan}",
                $request->ip()
            );

            return response()->json([
                'success' => true,
                'message' => 'Surat berhasil dikembalikan ke Admin untuk perbaikan bidang tujuan.',
                'data' => $surat,
            ]);
        });
    }

    /**
     * Admin fixes bidang_tujuan for a surat marked as "perlu_koreksi" and re-forwards it.
     */
    public function perbaikiBidang($id, Request $request)
    {
        $user = $request->user();
        if (!$user->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Hanya Admin yang dapat memperbaiki bidang tujuan.'], 403);
        }

        $request->validate([
            'bidang_tujuan' => ['required', Rule::in(['ipa', 'p3a'])],
            'catatan' => 'nullable|string',
        ]);

        $surat = SuratMasuk::findOrFail($id);

        return DB::transaction(function () use ($surat, $user, $request) {
            $oldBidang = $surat->bidang_tujuan;
            $surat->bidang_tujuan = $request->bidang_tujuan;
            $surat->status = 'diteruskan_kasubid';
            $surat->save();

            TindakLanjut::create([
                'surat_masuk_id' => $surat->id,
                'user_id' => $user->id,
                'jenis' => 'teruskan',
                'catatan' => "Admin memperbaiki bidang tujuan dari {$oldBidang} menjadi {$request->bidang_tujuan}. Catatan: " . ($request->catatan ?? 'Telah dikoreksi.'),
                'created_at' => now(),
            ]);

            // Notifikasi ke Kasubid tujuan baru
            $kasubidList = User::where('role', 'kasubid')->where('bidang', $surat->bidang_tujuan)->where('is_active', true)->get();
            foreach ($kasubidList as $kasubid) {
                Notifikasi::kirim(
                    $kasubid->id,
                    'Surat Masuk Hasil Koreksi',
                    "Admin mengalihkan surat no. {$surat->no_agenda} ke Sub Bidang " . ucfirst($surat->bidang_tujuan),
                    "/surat-masuk/{$surat->id}"
                );
            }

            LogAktivitas::catat(
                $user->id,
                'Perbaiki Bidang Surat',
                'Surat Masuk',
                $surat->id,
                "Admin mengoreksi bidang surat {$surat->no_agenda} ke {$surat->bidang_tujuan}",
                $request->ip()
            );

            return response()->json([
                'success' => true,
                'message' => 'Bidang tujuan berhasil diperbarui dan diteruskan ulang.',
                'data' => $surat,
            ]);
        });
    }

    /**
     * Staff reports result + optional proof file.
     */
    public function laporStaff($id, Request $request)
    {
        $user = $request->user();
        if (!$user->isStaff()) {
            return response()->json(['success' => false, 'message' => 'Hanya Staff yang dapat membuat laporan tindak lanjut.'], 403);
        }

        $request->validate([
            'catatan' => 'required|string',
            'file_bukti' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',
        ]);

        $surat = SuratMasuk::findOrFail($id);

        return DB::transaction(function () use ($surat, $user, $request) {
            $buktiPath = null;
            if ($request->hasFile('file_bukti')) {
                $buktiPath = $request->file('file_bukti')->store('bukti', 'public');
            }

            $surat->status = 'selesai_staff';
            $surat->save();

            TindakLanjut::create([
                'surat_masuk_id' => $surat->id,
                'user_id' => $user->id,
                'jenis' => 'laporan',
                'catatan' => $request->catatan,
                'file_bukti' => $buktiPath,
                'created_at' => now(),
            ]);

            // Notifikasi ke Kasubid bidang tersebut
            $kasubidList = User::where('role', 'kasubid')->where('bidang', $user->bidang)->where('is_active', true)->get();
            foreach ($kasubidList as $kasubid) {
                Notifikasi::kirim(
                    $kasubid->id,
                    'Laporan Tindak Lanjut Staff Selesai',
                    "Staf {$user->nama_lengkap} telah menyelesaikan tindak lanjut untuk surat no. {$surat->no_agenda}. Menunggu verifikasi Anda.",
                    "/surat-masuk/{$surat->id}"
                );
            }

            LogAktivitas::catat(
                $user->id,
                'Lapor Hasil Tindak Lanjut',
                'Surat Masuk',
                $surat->id,
                "Staf {$user->nama_lengkap} menyampaikan laporan penyelesaian surat {$surat->no_agenda}",
                $request->ip()
            );

            return response()->json([
                'success' => true,
                'message' => 'Laporan tindak lanjut berhasil dikirimkan ke Kasubid.',
                'data' => $surat,
            ]);
        });
    }

    /**
     * Kasubid verifies Staff result.
     */
    public function verifikasiKasubid($id, Request $request)
    {
        $user = $request->user();
        if (!$user->isKasubid()) {
            return response()->json(['success' => false, 'message' => 'Hanya Kasubid yang dapat memverifikasi laporan.'], 403);
        }

        $request->validate([
            'catatan' => 'nullable|string',
        ]);

        $surat = SuratMasuk::findOrFail($id);

        return DB::transaction(function () use ($surat, $user, $request) {
            $surat->status = 'terverifikasi_kasubid';
            $surat->save();

            TindakLanjut::create([
                'surat_masuk_id' => $surat->id,
                'user_id' => $user->id,
                'jenis' => 'verifikasi',
                'catatan' => 'Laporan staf telah diverifikasi oleh Kasubid: ' . ($request->catatan ?? 'Sesuai dengan arahan & ketentuan.'),
                'created_at' => now(),
            ]);

            // Notifikasi ke Admin (Siap diarsipkan)
            $admins = User::where('role', 'admin')->where('is_active', true)->get();
            foreach ($admins as $admin) {
                Notifikasi::kirim(
                    $admin->id,
                    'Surat Masuk Siap Diarsipkan',
                    "Tindak lanjut surat no. {$surat->no_agenda} telah diverifikasi Kasubid dan siap untuk diarsipkan.",
                    "/surat-masuk/{$surat->id}"
                );
            }

            LogAktivitas::catat(
                $user->id,
                'Verifikasi Kasubid',
                'Surat Masuk',
                $surat->id,
                "Kasubid memverifikasi laporan surat {$surat->no_agenda}",
                $request->ip()
            );

            return response()->json([
                'success' => true,
                'message' => 'Hasil tindak lanjut berhasil diverifikasi. Surat siap diarsipkan oleh Admin.',
                'data' => $surat,
            ]);
        });
    }

    /**
     * Kabid approves surat masuk and forwards to Kasubid (IPA / P3A).
     */
    public function approveKabid($id, Request $request)
    {
        $user = $request->user();
        if (!$user->isKabid()) {
            return response()->json(['success' => false, 'message' => 'Hanya Kepala Bidang (Kabid) yang berwenang memberikan persetujuan & arahan disposisi.'], 403);
        }

        $request->validate([
            'bidang_tujuan' => ['required', Rule::in(['ipa', 'p3a'])],
            'catatan' => 'nullable|string',
        ]);

        $surat = SuratMasuk::findOrFail($id);

        return DB::transaction(function () use ($surat, $user, $request) {
            $surat->bidang_tujuan = $request->bidang_tujuan;
            $surat->status = 'diteruskan_kasubid';
            $surat->approved_by = $user->id;
            $surat->approved_at = now();
            if ($request->filled('catatan')) {
                $surat->isi_disposisi = $request->catatan;
            }
            $surat->save();

            $bidangNama = strtoupper($surat->bidang_tujuan);
            TindakLanjut::create([
                'surat_masuk_id' => $surat->id,
                'user_id' => $user->id,
                'jenis' => 'approval',
                'catatan' => "Disetujui dan didisposisikan oleh Kepala Bidang ke Sub Bidang {$bidangNama}: " . ($request->catatan ?? 'Sesuai dengan berkas dan ketentuan yang berlaku.'),
                'created_at' => now(),
            ]);

            // Notifikasi ke Kasubid tujuan
            $kasubidList = User::where('role', 'kasubid')->where('bidang', $surat->bidang_tujuan)->where('is_active', true)->get();
            foreach ($kasubidList as $kasubid) {
                Notifikasi::kirim(
                    $kasubid->id,
                    'Disposisi Surat Masuk dari Kabid',
                    "Kabid telah menyetujui dan mendisposisikan surat no. {$surat->no_agenda} ({$surat->opd_asal}) ke Sub Bidang {$bidangNama}.",
                    "/surat-masuk/{$surat->id}"
                );
            }

            LogAktivitas::catat(
                $user->id,
                'Approval & Disposisi Kabid',
                'Surat Masuk',
                $surat->id,
                "Kabid menyetujui dan mendisposisikan surat no {$surat->no_agenda} ke Sub Bidang {$bidangNama}",
                $request->ip()
            );

            return response()->json([
                'success' => true,
                'message' => "Surat masuk berhasil disetujui dan didisposisikan ke Kasubid {$bidangNama}.",
                'data' => $surat,
            ]);
        });
    }

    /**
     * Admin archives surat masuk (After flow completion).
     */
    public function arsipkan($id, Request $request)
    {
        $user = $request->user();
        if (!$user->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Hanya Admin yang berwenang mengarsipkan surat.'], 403);
        }

        $surat = SuratMasuk::findOrFail($id);

        if (!in_array($surat->status, ['terverifikasi_kasubid', 'disetujui_kabid'])) {
            return response()->json([
                'success' => false,
                'message' => 'Surat masuk BELUM dapat diarsipkan karena proses tindak lanjut belum selesai dan terverifikasi.',
            ], 422);
        }

        return DB::transaction(function () use ($surat, $user, $request) {
            $surat->status = 'diarsipkan';
            $surat->save();

            TindakLanjut::create([
                'surat_masuk_id' => $surat->id,
                'user_id' => $user->id,
                'jenis' => 'approval',
                'catatan' => 'Surat resmi diarsipkan dalam buku agenda dan lemari penyimpanan digital.',
                'created_at' => now(),
            ]);

            LogAktivitas::catat(
                $user->id,
                'Arsipkan Surat Masuk',
                'Surat Masuk',
                $surat->id,
                "Admin mengarsipkan surat no {$surat->no_agenda}",
                $request->ip()
            );

            return response()->json([
                'success' => true,
                'message' => 'Surat masuk berhasil diarsipkan.',
                'data' => $surat,
            ]);
        });
    }

    /**
     * Soft delete surat masuk (Admin only).
     */
    public function destroy($id, Request $request)
    {
        $user = $request->user();
        if (!$user->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Hanya Admin yang dapat menghapus surat.'], 403);
        }

        $surat = SuratMasuk::findOrFail($id);
        $noAgenda = $surat->no_agenda;
        $surat->delete();

        LogAktivitas::catat(
            $user->id,
            'Hapus Surat Masuk',
            'Surat Masuk',
            $id,
            "Admin menghapus (soft delete) surat masuk no agenda {$noAgenda}",
            $request->ip()
        );

        return response()->json([
            'success' => true,
            'message' => "Surat masuk no agenda {$noAgenda} berhasil dihapus (dapat dipulihkan).",
        ]);
    }
}
