<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SuratMasuk;
use App\Models\SuratKeluar;
use App\Models\TindakLanjut;
use App\Models\TindakLanjutKeluar;
use App\Models\Notifikasi;
use App\Models\LogAktivitas;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class SuratSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('username', 'admin')->first();
        $kabid = User::where('username', 'kabid')->first();
        $kasubidIpa = User::where('username', 'kasubid.ipa')->first();
        $kasubidP3a = User::where('username', 'kasubid.p3a')->first();
        $staffIpa = User::where('username', 'staff.ipa')->first();
        $staffP3a = User::where('username', 'staff.p3a')->first();

        // Create sample PDF for preview
        $htmlSample = '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Dokumen Scan Persuratan BPKAD Kota Pekanbaru</title>
            <style>
                body { font-family: sans-serif; margin: 30px; font-size: 13px; line-height: 1.6; color: #1f2937; }
                .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 24px; }
                .kop h2 { margin: 0; font-size: 16px; text-transform: uppercase; font-weight: bold; }
                .kop h1 { margin: 4px 0; font-size: 20px; font-weight: 800; }
                .kop p { margin: 0; font-size: 11px; }
                .meta-table { width: 100%; margin-bottom: 20px; border-collapse: collapse; }
                .meta-table td { padding: 4px 0; vertical-align: top; }
                .content { text-align: justify; margin-bottom: 24px; }
                .stamp-box { border: 2px dashed #1A3A5C; padding: 12px; margin-top: 30px; width: 60%; float: right; background: #f8fafc; }
                .stamp-title { font-weight: bold; color: #1A3A5C; font-size: 12px; border-bottom: 1px solid #1A3A5C; padding-bottom: 4px; margin-bottom: 6px; }
                .page-break { page-break-after: always; }
                .badge { display: inline-block; padding: 2px 8px; background: #e2e8f0; font-size: 11px; font-weight: bold; border-radius: 4px; }
            </style>
        </head>
        <body>
            <div class="kop">
                <h2>Pemerintah Kota Pekanbaru</h2>
                <h1>BADAN PENGELOLA KEUANGAN DAN ASET DAERAH</h1>
                <p>Jalan Abdul Rahman Hamid, Komplek Perkantoran Tenayan Raya, Kota Pekanbaru, Riau</p>
                <p>Website: bpkad.pekanbaru.go.id | Email: bpkad@pekanbaru.go.id</p>
            </div>

            <table class="meta-table">
                <tr><td width="15%">Nomor Surat</td><td width="3%">:</td><td width="47%">005/BPKAD-SET/2026/089</td><td width="12%">Sifat</td><td width="3%">:</td><td width="20%"><span class="badge">PENTING</span></td></tr>
                <tr><td>Lampiran</td><td>:</td><td>1 (satu) Berkas Lengkap</td><td>Tanggal</td><td>:</td><td>12 Oktober 2026</td></tr>
                <tr><td>Perihal</td><td>:</td><td colspan="4"><b>Laporan Inventarisasi dan Penghapusan Aset (IPA) serta Pengamanan Aset (P3A)</b></td></tr>
            </table>

            <div class="content">
                <p>Kepada Yth.<br><b>Kepala BPKAD Kota Pekanbaru</b><br>c.q. Kepala Bidang Aset<br>di Tempat</p>
                <p>Sehubungan dengan pelaksanaan penatausahaan dan penertiban Barang Milik Daerah (BMD) Pemerintah Kota Pekanbaru Tahun Anggaran 2026, bersama ini kami sampaikan berkas usulan penghapusan dan pengamanan aset.</p>
                <p>Dokumen scan terlampir meliputi:</p>
                <ol>
                    <li>Surat Pengantar Dinas Teknis</li>
                    <li>Lembar Disposisi Kepala Badan dan Sekretaris BPKAD</li>
                    <li>Berita Acara Serah Terima (BAST) Fisik Lapangan</li>
                    <li>Daftar Inventaris Kendaraan Operasional dan Tanah</li>
                </ol>
            </div>

            <div class="stamp-box">
                <div class="stamp-title">CATATAN DISPOSISI KEPALA BADAN / KABID ASET</div>
                <p style="margin:0; font-size:11px;">"Tindak lanjuti segera sesuai SOP Aset Daerah. Lakukan pengecekan lapangan bersama staf teknis dan laporkan progres dalam 3 hari kerja."</p>
                <p style="margin-top:10px; margin-bottom:0; font-size:10px; text-align:right;">Pekanbaru, 12 Oktober 2026<br><b>Kepala Bidang Aset</b></p>
            </div>

            <div style="clear:both;"></div>

            <div class="page-break"></div>

            <div class="kop">
                <h2>Lampiran Dokumen Berita Acara</h2>
                <h1>BERITA ACARA SERAH TERIMA & PENGAMANAN FISIK BMD</h1>
                <p>Sub Bidang Aset Kota Pekanbaru - Tahun 2026</p>
            </div>
            <div class="content">
                <p>Pada hari ini, Senin tanggal Dua Belas bulan Oktober tahun Dua Ribu Dua Puluh Enam, bertempat di Kantor BPKAD Kota Pekanbaru, telah dilakukan verifikasi dan pemeriksaan berkas fisik terhadap:</p>
                <table style="width:100%; border:1px solid #ccc; border-collapse:collapse; font-size:12px;">
                    <tr style="background:#f1f5f9;"><th style="border:1px solid #ccc; padding:6px;">No</th><th style="border:1px solid #ccc; padding:6px;">Uraian Aset</th><th style="border:1px solid #ccc; padding:6px;">Lokasi / Nopol</th><th style="border:1px solid #ccc; padding:6px;">Kondisi</th></tr>
                    <tr><td style="border:1px solid #ccc; padding:6px; text-align:center;">1</td><td style="border:1px solid #ccc; padding:6px;">Tanah Cadangan Perkantoran</td><td style="border:1px solid #ccc; padding:6px;">Kec. Tenayan Raya (5.000 m²)</td><td style="border:1px solid #ccc; padding:6px;">Aman / Berpagar</td></tr>
                    <tr><td style="border:1px solid #ccc; padding:6px; text-align:center;">2</td><td style="border:1px solid #ccc; padding:6px;">Kendaraan Roda 4 Dinas</td><td style="border:1px solid #ccc; padding:6px;">BM 1024 AP</td><td style="border:1px solid #ccc; padding:6px;">Baik Terawat</td></tr>
                </table>
                <p style="margin-top:20px;">Demikian Berita Acara ini dibuat untuk dipergunakan sebagaimana mestinya.</p>
            </div>
        </body>
        </html>
        ';

        $pdf = Pdf::loadHTML($htmlSample)->setPaper('a4', 'portrait');
        $pdfContent = $pdf->output();

        Storage::disk('public')->put('surat-masuk/sample_dokumen_lengkap.pdf', $pdfContent);
        Storage::disk('public')->put('surat-keluar/sample_dokumen_keluar.pdf', $pdfContent);

        // 1. Surat Masuk - Status BARU
        $sm1 = SuratMasuk::create([
            'no_agenda' => 'SM/2026/10/0001',
            'no_surat' => '005/DISDIK/X/2026/112',
            'tanggal_surat' => '2026-10-10',
            'tanggal_terima' => '2026-10-12',
            'opd_asal' => 'Dinas Pendidikan Kota Pekanbaru',
            'perihal' => 'Permohonan Mutasi dan Penghapusan Aset Meubelair Gedung SMP Negeri 45',
            'sifat' => 'biasa',
            'bidang_tujuan' => 'ipa',
            'isi_disposisi' => 'Kasubid IPA: Pelajari berkas BAST meubelair dan buatkan telaah teknis penghapusan.',
            'file_scan' => 'surat-masuk/sample_dokumen_lengkap.pdf',
            'status' => 'baru',
            'created_by' => $admin->id,
        ]);
        TindakLanjut::create([
            'surat_masuk_id' => $sm1->id,
            'user_id' => $admin->id,
            'jenis' => 'teruskan',
            'catatan' => 'Surat masuk diinput oleh Admin dan menunggu penanganan Kasubid IPA.',
            'created_at' => now()->subDays(3),
        ]);

        // 2. Surat Masuk - DITERUSKAN KASUBID KE STAFF
        $sm2 = SuratMasuk::create([
            'no_agenda' => 'SM/2026/10/0002',
            'no_surat' => '028/SATPOL-PP/2026/045',
            'tanggal_surat' => '2026-10-11',
            'tanggal_terima' => '2026-10-13',
            'opd_asal' => 'Satuan Polisi Pamong Praja Kota Pekanbaru',
            'perihal' => 'Permintaan Bantuan Pemasangan Papan Pengamanan Aset Tanah Jl. Soekarno Hatta',
            'sifat' => 'penting',
            'bidang_tujuan' => 'p3a',
            'isi_disposisi' => 'Kasubid P3A: Koordinasikan dengan Satpol PP untuk jadwal pemasangan patok & plang aset.',
            'file_scan' => 'surat-masuk/sample_dokumen_lengkap.pdf',
            'status' => 'diteruskan_staff',
            'created_by' => $admin->id,
        ]);
        TindakLanjut::create([
            'surat_masuk_id' => $sm2->id,
            'user_id' => $kasubidP3a->id,
            'jenis' => 'teruskan',
            'catatan' => 'Diteruskan kepada Staf Rian Pratama: Lakukan survei titik koordinat dan hitung kebutuhan plang.',
            'created_at' => now()->subDays(2),
        ]);

        // 3. Surat Masuk - SELESAI STAFF (Menunggu verifikasi Kasubid)
        $sm3 = SuratMasuk::create([
            'no_agenda' => 'SM/2026/10/0003',
            'no_surat' => '030/DINKES/2026/789',
            'tanggal_surat' => '2026-10-08',
            'tanggal_terima' => '2026-10-09',
            'opd_asal' => 'Dinas Kesehatan Kota Pekanbaru',
            'perihal' => 'Laporan Rekonsiliasi Aset Alat Kesehatan Puskesmas Rumbai Pesisir',
            'sifat' => 'biasa',
            'bidang_tujuan' => 'ipa',
            'isi_disposisi' => 'Cek kesesuaian nilai KIB B dengan aplikasi SIMDA/SIPD BMD.',
            'file_scan' => 'surat-masuk/sample_dokumen_lengkap.pdf',
            'status' => 'selesai_staff',
            'created_by' => $admin->id,
        ]);
        TindakLanjut::create([
            'surat_masuk_id' => $sm3->id,
            'user_id' => $staffIpa->id,
            'jenis' => 'laporan',
            'catatan' => 'Pemeriksaan KIB B selesai. Seluruh 34 unit alkes terdata cocok dengan nilai buku per 30 September 2026.',
            'created_at' => now()->subDays(1),
        ]);

        // 4. Surat Masuk - TERVERIFIKASI KASUBID (Menunggu Approval Kabid WAJIB)
        $sm4 = SuratMasuk::create([
            'no_agenda' => 'SM/2026/10/0004',
            'no_surat' => '100/BAG-UMUM/2026/301',
            'tanggal_surat' => '2026-10-07',
            'tanggal_terima' => '2026-10-08',
            'opd_asal' => 'Bagian Umum Sekretariat Daerah Kota Pekanbaru',
            'perihal' => 'Permohonan Pengamanan Aset dan Pengosongan Rumah Dinas Jabatan',
            'sifat' => 'segera',
            'bidang_tujuan' => 'p3a',
            'isi_disposisi' => 'Prioritas: Validasi status hak pakai dan siapkan surat pengamanan.',
            'file_scan' => 'surat-masuk/sample_dokumen_lengkap.pdf',
            'status' => 'terverifikasi_kasubid',
            'created_by' => $admin->id,
        ]);
        TindakLanjut::create([
            'surat_masuk_id' => $sm4->id,
            'user_id' => $kasubidP3a->id,
            'jenis' => 'verifikasi',
            'catatan' => 'Verifikasi lapangan telah lengkap. Dokumen telah siap dimintakan persetujuan Kepala Bidang Aset.',
            'created_at' => now()->subHours(10),
        ]);

        // 5. Surat Masuk - DISETUJUI KABID (Siap Diarsipkan Admin)
        $sm5 = SuratMasuk::create([
            'no_agenda' => 'SM/2026/10/0005',
            'no_surat' => '020/DISHUB/2026/505',
            'tanggal_surat' => '2026-10-05',
            'tanggal_terima' => '2026-10-06',
            'opd_asal' => 'Dinas Perhubungan Kota Pekanbaru',
            'perihal' => 'Serah Terima Aset Fasilitas Perlengkapan Jalan Halte Bus TMP',
            'sifat' => 'biasa',
            'bidang_tujuan' => 'ipa',
            'isi_disposisi' => 'Setujui pencatatan ke dalam KIB C Aset BPKAD.',
            'file_scan' => 'surat-masuk/sample_dokumen_lengkap.pdf',
            'status' => 'disetujui_kabid',
            'created_by' => $admin->id,
            'approved_by' => $kabid->id,
            'approved_at' => now()->subHours(2),
        ]);
        TindakLanjut::create([
            'surat_masuk_id' => $sm5->id,
            'user_id' => $kabid->id,
            'jenis' => 'approval',
            'catatan' => 'Disetujui. Silakan Admin arsipkan berkas fisik dan digital.',
            'created_at' => now()->subHours(2),
        ]);

        // 6. Surat Masuk - DIARSIPKAN
        $sm6 = SuratMasuk::create([
            'no_agenda' => 'SM/2026/10/0006',
            'no_surat' => '900/PUPR/2026/890',
            'tanggal_surat' => '2026-09-28',
            'tanggal_terima' => '2026-09-29',
            'opd_asal' => 'Dinas Pekerjaan Umum dan Penataan Ruang',
            'perihal' => 'Pelimpahan Aset Jalan dan Jembatan Hasil Karya Bakti TA 2026',
            'sifat' => 'penting',
            'bidang_tujuan' => 'ipa',
            'isi_disposisi' => 'Selesai diarsipkan dalam buku induk inventarisasi.',
            'file_scan' => 'surat-masuk/sample_dokumen_lengkap.pdf',
            'status' => 'diarsipkan',
            'created_by' => $admin->id,
            'approved_by' => $kabid->id,
            'approved_at' => now()->subDays(5),
        ]);

        // 7. Surat Masuk - PERLU KOREKSI (Kasubid kembalikan ke Admin)
        $sm7 = SuratMasuk::create([
            'no_agenda' => 'SM/2026/10/0007',
            'no_surat' => '500/DISTAN/2026/220',
            'tanggal_surat' => '2026-10-12',
            'tanggal_terima' => '2026-10-13',
            'opd_asal' => 'Dinas Pertanian dan Perikanan',
            'perihal' => 'Pengamanan Tanah Balai Benih Ikan (BBI) Kulim',
            'sifat' => 'biasa',
            'bidang_tujuan' => 'ipa', // Salah alamat, seharusnya P3A
            'isi_disposisi' => 'Mohon diteliti batas-batas patok tanah.',
            'file_scan' => 'surat-masuk/sample_dokumen_lengkap.pdf',
            'status' => 'perlu_koreksi',
            'created_by' => $admin->id,
        ]);
        TindakLanjut::create([
            'surat_masuk_id' => $sm7->id,
            'user_id' => $kasubidIpa->id,
            'jenis' => 'pengembalian',
            'catatan' => 'Salah bidang tujuan. Berkas ini mengenai pemanfaatan dan pengamanan fisik tanah, mohon dialihkan ke Sub Bidang P3A.',
            'created_at' => now()->subHours(4),
        ]);

        // ==================== SURAT KELUAR ====================

        // 1. Surat Keluar - DIINPUT
        $sk1 = SuratKeluar::create([
            'no_agenda' => 'SK/2026/10/0001',
            'no_surat' => '028/BPKAD-ASET/2026/101',
            'tanggal_surat' => '2026-10-14',
            'opd_tujuan' => 'Inspektorat Kota Pekanbaru',
            'perihal' => 'Penyampaian Tindak Lanjut Temuan BPK RI atas Pengamanan Aset Tetap',
            'sifat' => 'penting',
            'jenis_dokumen' => 'surat',
            'file_scan' => 'surat-keluar/sample_dokumen_keluar.pdf',
            'status' => 'diinput',
            'created_by' => $admin->id,
            'keterangan' => 'Menunggu verifikasi admin sebelum diteruskan ke Kabid',
        ]);
        TindakLanjutKeluar::create([
            'surat_keluar_id' => $sk1->id,
            'user_id' => $admin->id,
            'jenis' => 'input',
            'catatan' => 'Draft surat keluar berhasil diinput oleh Admin.',
            'created_at' => now()->subDays(2),
        ]);

        // 2. Surat Keluar - DIVERIFIKASI ADMIN (Menunggu Approval Kabid)
        $sk2 = SuratKeluar::create([
            'no_agenda' => 'SK/2026/10/0002',
            'no_surat' => '030/BPKAD-ASET/BA/2026/042',
            'tanggal_surat' => '2026-10-13',
            'opd_tujuan' => 'Badan Pendapatan Daerah Kota Pekanbaru',
            'perihal' => 'Berita Acara Pinjam Pakai Gedung Arsip Pajak Daerah',
            'sifat' => 'biasa',
            'jenis_dokumen' => 'berita_acara',
            'file_scan' => 'surat-keluar/sample_dokumen_keluar.pdf',
            'status' => 'diverifikasi_admin',
            'created_by' => $admin->id,
            'verified_by' => $admin->id,
            'keterangan' => 'Lampiran BA dan telaah sudah diverifikasi lengkap. Siap approval Kabid.',
        ]);
        TindakLanjutKeluar::create([
            'surat_keluar_id' => $sk2->id,
            'user_id' => $admin->id,
            'jenis' => 'verifikasi',
            'catatan' => 'Data dan scan telah diverifikasi lengkap oleh Admin.',
            'created_at' => now()->subDays(1),
        ]);

        // 3. Surat Keluar - DISETUJUI KABID (Siap Arsip)
        $sk3 = SuratKeluar::create([
            'no_agenda' => 'SK/2026/10/0003',
            'no_surat' => '028/BPKAD-ASET/BAST/2026/019',
            'tanggal_surat' => '2026-10-11',
            'opd_tujuan' => 'Kecamatan Tampan',
            'perihal' => 'Berita Acara Serah Terima (BAST) 2 Unit Sepeda Motor Operasional',
            'sifat' => 'biasa',
            'jenis_dokumen' => 'bast',
            'file_scan' => 'surat-keluar/sample_dokumen_keluar.pdf',
            'status' => 'disetujui_kabid',
            'created_by' => $admin->id,
            'verified_by' => $admin->id,
            'approved_by' => $kabid->id,
            'approved_at' => now()->subHours(6),
            'keterangan' => 'Kabid telah menandatangani & menyetujui pengarsipan berkas BAST.',
        ]);
        TindakLanjutKeluar::create([
            'surat_keluar_id' => $sk3->id,
            'user_id' => $kabid->id,
            'jenis' => 'approval',
            'catatan' => 'Persetujuan Kabid diberikan. Siap dilakukan pengarsipan akhir.',
            'created_at' => now()->subHours(6),
        ]);

        // 4. Surat Keluar - DIARSIPKAN
        $sk4 = SuratKeluar::create([
            'no_agenda' => 'SK/2026/10/0004',
            'no_surat' => '028/BPKAD-ASET/2026/088',
            'tanggal_surat' => '2026-10-02',
            'opd_tujuan' => 'Dinas Komunikasi dan Informatika Kota Pekanbaru',
            'perihal' => 'Penyampaian Daftar Kebutuhan Domain dan Hosting SIMANSUR Aset',
            'sifat' => 'biasa',
            'jenis_dokumen' => 'surat',
            'file_scan' => 'surat-keluar/sample_dokumen_keluar.pdf',
            'status' => 'diarsipkan',
            'created_by' => $admin->id,
            'verified_by' => $admin->id,
            'approved_by' => $kabid->id,
            'approved_at' => now()->subDays(6),
            'keterangan' => 'Telah diarsipkan secara resmi.',
        ]);

        // 5. Surat Keluar - DIKEMBALIKAN KABID
        $sk5 = SuratKeluar::create([
            'no_agenda' => 'SK/2026/10/0005',
            'no_surat' => '028/BPKAD-ASET/2026/099',
            'tanggal_surat' => '2026-10-12',
            'opd_tujuan' => 'Sekretariat DPRD Kota Pekanbaru',
            'perihal' => 'Konfirmasi Pengembalian Kendaraan Operasional Pimpinan DPRD',
            'sifat' => 'penting',
            'jenis_dokumen' => 'surat',
            'file_scan' => 'surat-keluar/sample_dokumen_keluar.pdf',
            'status' => 'dikembalikan',
            'created_by' => $admin->id,
            'verified_by' => $admin->id,
            'keterangan' => 'Kabid mengembalikan berkas: Nomor rangka mobil dinas pada halaman 2 belum dicantumkan.',
        ]);
        TindakLanjutKeluar::create([
            'surat_keluar_id' => $sk5->id,
            'user_id' => $kabid->id,
            'jenis' => 'pengembalian',
            'catatan' => 'Perbaiki lampiran nomor rangka dan nomor mesin sebelum saya approve.',
            'created_at' => now()->subHours(3),
        ]);

        // Notifikasi Sampel
        Notifikasi::kirim(
            $kabid->id,
            'Surat Masuk Menunggu Persetujuan',
            'Surat masuk no. SM/2026/10/0004 dari Bagian Umum telah diverifikasi oleh Kasubid dan siap disetujui.',
            '/surat-masuk/4'
        );
        Notifikasi::kirim(
            $kasubidIpa->id,
            'Surat Masuk Baru Diterima',
            'Surat masuk no. SM/2026/10/0001 dari Dinas Pendidikan telah dialokasikan ke Sub Bidang IPA.',
            '/surat-masuk/1'
        );
        Notifikasi::kirim(
            $staffP3a->id,
            'Tugas Tindak Lanjut Surat Masuk',
            'Kasubid P3A meneruskan surat no. SM/2026/10/0002 dari Satpol PP untuk disurvei.',
            '/surat-masuk/2'
        );
        Notifikasi::kirim(
            $admin->id,
            'Surat Masuk Memerlukan Koreksi',
            'Kasubid IPA mengembalikan surat no. SM/2026/10/0007 karena salah bidang tujuan.',
            '/surat-masuk/7'
        );

        // Log Aktivitas Sampel
        LogAktivitas::catat($admin->id, 'Login', 'Autentikasi', null, 'Admin login ke SIMANSUR BPKAD', '127.0.0.1');
        LogAktivitas::catat($admin->id, 'Tambah Surat Masuk', 'Surat Masuk', $sm1->id, 'Input surat masuk no agenda SM/2026/10/0001', '127.0.0.1');
        LogAktivitas::catat($kasubidP3a->id, 'Teruskan Surat', 'Surat Masuk', $sm2->id, 'Kasubid P3A meneruskan surat ke staf Rian Pratama', '127.0.0.1');
        LogAktivitas::catat($kabid->id, 'Persetujuan Surat', 'Surat Masuk', $sm5->id, 'Kabid menyetujui surat no SM/2026/10/0005', '127.0.0.1');
    }
}
