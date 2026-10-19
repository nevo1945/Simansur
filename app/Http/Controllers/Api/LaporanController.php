<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SuratMasuk;
use App\Models\SuratKeluar;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class LaporanController extends Controller
{
    private function checkAccess($user)
    {
        if ($user->isStaff()) {
            abort(response()->json(['success' => false, 'message' => 'Staff tidak memiliki akses ke menu laporan.'], 403));
        }
    }

    public function rekapitulasi(Request $request)
    {
        $user = $request->user();
        $this->checkAccess($user);

        $queryMasuk = SuratMasuk::query();
        $queryKeluar = SuratKeluar::query();

        if ($user->isKasubid()) {
            $queryMasuk->where('bidang_tujuan', $user->bidang);
        } elseif ($request->filled('bidang_tujuan')) {
            $queryMasuk->where('bidang_tujuan', $request->bidang_tujuan);
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $queryMasuk->whereBetween('tanggal_terima', [$request->start_date, $request->end_date]);
            $queryKeluar->whereBetween('tanggal_surat', [$request->start_date, $request->end_date]);
        }

        if ($request->filled('sifat')) {
            $queryMasuk->where('sifat', $request->sifat);
            $queryKeluar->where('sifat', $request->sifat);
        }

        if ($request->filled('status_masuk')) {
            $queryMasuk->where('status', $request->status_masuk);
        }

        if ($request->filled('status_keluar')) {
            $queryKeluar->where('status', $request->status_keluar);
        }

        $listMasuk = (clone $queryMasuk)->orderBy('tanggal_terima', 'desc')->take(100)->get();
        $listKeluar = (clone $queryKeluar)->orderBy('tanggal_surat', 'desc')->take(100)->get();

        $statsMasuk = [
            'total' => (clone $queryMasuk)->count(),
            'diarsipkan' => (clone $queryMasuk)->where('status', 'diarsipkan')->count(),
            'disetujui_kabid' => (clone $queryMasuk)->where('status', 'disetujui_kabid')->count(),
            'proses' => (clone $queryMasuk)->whereNotIn('status', ['diarsipkan', 'perlu_koreksi'])->count(),
            'perlu_koreksi' => (clone $queryMasuk)->where('status', 'perlu_koreksi')->count(),
        ];

        $statsKeluar = [
            'total' => (clone $queryKeluar)->count(),
            'diarsipkan' => (clone $queryKeluar)->where('status', 'diarsipkan')->count(),
            'disetujui_kabid' => (clone $queryKeluar)->where('status', 'disetujui_kabid')->count(),
            'proses' => (clone $queryKeluar)->whereNotIn('status', ['diarsipkan', 'dikembalikan'])->count(),
            'dikembalikan' => (clone $queryKeluar)->where('status', 'dikembalikan')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'stats_masuk' => $statsMasuk,
                'stats_keluar' => $statsKeluar,
                'list_masuk' => $listMasuk,
                'list_keluar' => $listKeluar,
            ],
        ]);
    }

    public function exportPdfSuratMasuk(Request $request)
    {
        $user = $request->user();
        $this->checkAccess($user);

        $query = SuratMasuk::with('approver');

        if ($user->isKasubid()) {
            $query->where('bidang_tujuan', $user->bidang);
        } elseif ($request->filled('bidang_tujuan')) {
            $query->where('bidang_tujuan', $request->bidang_tujuan);
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('tanggal_terima', [$request->start_date, $request->end_date]);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $items = $query->orderBy('no_agenda')->get();

        $html = view('exports.laporan_surat_masuk', [
            'items' => $items,
            'user' => $user,
            'startDate' => $request->start_date ?? date('Y-m-01'),
            'endDate' => $request->end_date ?? date('Y-m-d'),
        ])->render();

        $pdf = Pdf::loadHTML($html)->setPaper('a4', 'landscape');
        return $pdf->download('Laporan_Surat_Masuk_BPKAD_' . date('Ymd_His') . '.pdf');
    }

    public function exportPdfSuratKeluar(Request $request)
    {
        $user = $request->user();
        $this->checkAccess($user);

        $query = SuratKeluar::with(['approver', 'verifier']);

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('tanggal_surat', [$request->start_date, $request->end_date]);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $items = $query->orderBy('no_agenda')->get();

        $html = view('exports.laporan_surat_keluar', [
            'items' => $items,
            'user' => $user,
            'startDate' => $request->start_date ?? date('Y-m-01'),
            'endDate' => $request->end_date ?? date('Y-m-d'),
        ])->render();

        $pdf = Pdf::loadHTML($html)->setPaper('a4', 'landscape');
        return $pdf->download('Laporan_Surat_Keluar_BPKAD_' . date('Ymd_His') . '.pdf');
    }

    public function cetakDisposisi($id, Request $request)
    {
        $user = $request->user();
        $surat = SuratMasuk::with(['creator', 'approver', 'tindakLanjut.user'])->findOrFail($id);

        $html = view('exports.lembar_disposisi', [
            'surat' => $surat,
            'user' => $user,
        ])->render();

        $pdf = Pdf::loadHTML($html)->setPaper('a4', 'portrait');
        return $pdf->stream('Lembar_Disposisi_' . str_replace('/', '_', $surat->no_agenda) . '.pdf');
    }

    public function exportCsvSuratMasuk(Request $request)
    {
        $user = $request->user();
        $this->checkAccess($user);

        $query = SuratMasuk::query();
        if ($user->isKasubid()) {
            $query->where('bidang_tujuan', $user->bidang);
        }
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('tanggal_terima', [$request->start_date, $request->end_date]);
        }
        $items = $query->orderBy('no_agenda')->get();

        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=Rekap_Surat_Masuk_" . date('Ymd') . ".csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $columns = ['No Agenda', 'No Surat', 'Tanggal Surat', 'Tanggal Terima', 'OPD Asal', 'Perihal', 'Sifat', 'Bidang Tujuan', 'Status'];

        $callback = function () use ($items, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($items as $item) {
                fputcsv($file, [
                    $item->no_agenda,
                    $item->no_surat,
                    $item->tanggal_surat ? $item->tanggal_surat->format('Y-m-d') : '',
                    $item->tanggal_terima ? $item->tanggal_terima->format('Y-m-d') : '',
                    $item->opd_asal,
                    $item->perihal,
                    strtoupper($item->sifat),
                    strtoupper($item->bidang_tujuan),
                    strtoupper(str_replace('_', ' ', $item->status)),
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function exportCsvSuratKeluar(Request $request)
    {
        $user = $request->user();
        $this->checkAccess($user);

        $query = SuratKeluar::query();
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('tanggal_surat', [$request->start_date, $request->end_date]);
        }
        $items = $query->orderBy('no_agenda')->get();

        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=Rekap_Surat_Keluar_" . date('Ymd') . ".csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $columns = ['No Agenda', 'No Surat', 'Tanggal Surat', 'OPD Tujuan', 'Perihal', 'Sifat', 'Jenis Dokumen', 'Status'];

        $callback = function () use ($items, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($items as $item) {
                fputcsv($file, [
                    $item->no_agenda,
                    $item->no_surat,
                    $item->tanggal_surat ? $item->tanggal_surat->format('Y-m-d') : '',
                    $item->opd_tujuan,
                    $item->perihal,
                    strtoupper($item->sifat),
                    strtoupper(str_replace('_', ' ', $item->jenis_dokumen)),
                    strtoupper(str_replace('_', ' ', $item->status)),
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
