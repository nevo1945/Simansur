<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SuratMasuk;
use App\Models\SuratKeluar;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // 1. Base counts
        $totalSuratMasuk = SuratMasuk::count();
        $totalSuratKeluar = SuratKeluar::count();
        $totalArsip = SuratMasuk::where('status', 'diarsipkan')->count() + SuratKeluar::where('status', 'diarsipkan')->count();
        $totalUser = User::where('is_active', true)->count();

        // 2. Role-specific priority counts & lists
        $pendingApprovalKabid = 0;
        $needActionCount = 0;
        $prioritySuratMasuk = [];
        $prioritySuratKeluar = [];

        if ($user->isAdmin()) {
            // Admin needs to:
            // 1) Arsipkan surat masuk yang terverifikasi_kasubid / disetujui_kabid
            // 2) Arsipkan surat keluar yang disetujui_kabid
            // 3) Perbaiki surat keluar yang dikembalikan
            // 4) Bantu perbaiki surat masuk perlu_koreksi
            $siapArsipMasuk = SuratMasuk::whereIn('status', ['terverifikasi_kasubid', 'disetujui_kabid'])->count();
            $siapArsipKeluar = SuratKeluar::where('status', 'disetujui_kabid')->count();
            $perluKoreksiMasuk = SuratMasuk::where('status', 'perlu_koreksi')->count();
            $keluarDikembalikan = SuratKeluar::where('status', 'dikembalikan')->count();

            $needActionCount = $siapArsipMasuk + $siapArsipKeluar + $perluKoreksiMasuk + $keluarDikembalikan;

            $prioritySuratMasuk = SuratMasuk::whereIn('status', ['terverifikasi_kasubid', 'disetujui_kabid', 'perlu_koreksi'])
                ->orderBy('updated_at', 'desc')->take(5)->get();

            $prioritySuratKeluar = SuratKeluar::whereIn('status', ['disetujui_kabid', 'dikembalikan'])
                ->orderBy('updated_at', 'desc')->take(5)->get();

        } elseif ($user->isKabid()) {
            // Kabid needs to approve & disposisi:
            // 1) Surat masuk: status 'baru' (menunggu telaah & approval disposisi ke Kasubid) atau 'perlu_koreksi'
            // 2) Surat keluar: status 'diverifikasi_admin' / 'diinput' (menunggu persetujuan arsip)
            $masukMenunggu = SuratMasuk::whereIn('status', ['baru', 'perlu_koreksi'])->count();
            $keluarMenunggu = SuratKeluar::whereIn('status', ['diverifikasi_admin', 'diinput'])->count();
            $pendingApprovalKabid = $masukMenunggu + $keluarMenunggu;
            $needActionCount = $pendingApprovalKabid;

            $prioritySuratMasuk = SuratMasuk::whereIn('status', ['baru', 'perlu_koreksi'])
                ->orderBy('updated_at', 'desc')->take(5)->get();

            $prioritySuratKeluar = SuratKeluar::whereIn('status', ['diverifikasi_admin', 'diinput'])
                ->orderBy('updated_at', 'desc')->take(5)->get();

        } elseif ($user->isKasubid()) {
            // Kasubid needs to:
            // 1) Teruskan surat masuk 'diteruskan_kasubid' pada bidangnya ke staf
            // 2) Verifikasi laporan staff 'selesai_staff' pada bidangnya
            $queryMasuk = SuratMasuk::where('bidang_tujuan', $user->bidang);
            $masukDiteruskan = (clone $queryMasuk)->where('status', 'diteruskan_kasubid')->count();
            $masukSelesaiStaff = (clone $queryMasuk)->where('status', 'selesai_staff')->count();

            $needActionCount = $masukDiteruskan + $masukSelesaiStaff;

            $prioritySuratMasuk = (clone $queryMasuk)
                ->whereIn('status', ['diteruskan_kasubid', 'selesai_staff'])
                ->orderBy('updated_at', 'desc')->take(5)->get();

        } elseif ($user->isStaff()) {
            // Staff needs to execute: surat masuk 'diteruskan_staff' di bidangnya
            $prioritySuratMasuk = SuratMasuk::where('bidang_tujuan', $user->bidang)
                ->where('status', 'diteruskan_staff')
                ->orderBy('updated_at', 'desc')->take(5)->get();
            $needActionCount = $prioritySuratMasuk->count();
        }

        // 3. Trends for Recharts (Last 7 Days)
        $trendData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dateStr = $date->format('Y-m-d');
            $label = $date->translatedFormat('d M');

            $masukCount = SuratMasuk::whereDate('created_at', $dateStr)->count();
            $keluarCount = SuratKeluar::whereDate('created_at', $dateStr)->count();

            $trendData[] = [
                'date' => $dateStr,
                'label' => $label,
                'masuk' => $masukCount,
                'keluar' => $keluarCount,
            ];
        }

        // 4. Distribution by Bidang & Jenis Dokumen
        $distribusiBidang = [
            'ipa' => SuratMasuk::where('bidang_tujuan', 'ipa')->count(),
            'p3a' => SuratMasuk::where('bidang_tujuan', 'p3a')->count(),
        ];

        $distribusiJenisKeluar = [
            'surat' => SuratKeluar::where('jenis_dokumen', 'surat')->count(),
            'berita_acara' => SuratKeluar::where('jenis_dokumen', 'berita_acara')->count(),
            'bast' => SuratKeluar::where('jenis_dokumen', 'bast')->count(),
        ];

        // Status counts for pie/summary
        $statusSuratMasuk = [
            'baru' => SuratMasuk::where('status', 'baru')->count(),
            'diteruskan_kasubid' => SuratMasuk::where('status', 'diteruskan_kasubid')->count(),
            'diteruskan_staff' => SuratMasuk::where('status', 'diteruskan_staff')->count(),
            'selesai_staff' => SuratMasuk::where('status', 'selesai_staff')->count(),
            'terverifikasi_kasubid' => SuratMasuk::where('status', 'terverifikasi_kasubid')->count(),
            'disetujui_kabid' => SuratMasuk::where('status', 'disetujui_kabid')->count(),
            'diarsipkan' => SuratMasuk::where('status', 'diarsipkan')->count(),
            'perlu_koreksi' => SuratMasuk::where('status', 'perlu_koreksi')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'total_surat_masuk' => $totalSuratMasuk,
                    'total_surat_keluar' => $totalSuratKeluar,
                    'total_arsip' => $totalArsip,
                    'total_user' => $totalUser,
                    'need_action_count' => $needActionCount,
                    'pending_approval_kabid' => $pendingApprovalKabid,
                ],
                'trend_7_days' => $trendData,
                'distribusi_bidang' => $distribusiBidang,
                'distribusi_jenis_keluar' => $distribusiJenisKeluar,
                'status_surat_masuk' => $statusSuratMasuk,
                'priority_surat_masuk' => $prioritySuratMasuk,
                'priority_surat_keluar' => $prioritySuratKeluar,
            ],
        ]);
    }
}
