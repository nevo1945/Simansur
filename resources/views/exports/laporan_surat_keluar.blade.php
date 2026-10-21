<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Buku Agenda & Rekapitulasi Surat Keluar - BPKAD Kota Pekanbaru</title>
    <style>
        @page {
            margin: 20px 25px 30px 25px;
            size: a4 landscape;
        }
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 10px;
            color: #1e293b;
            line-height: 1.3;
        }
        .kop-table {
            width: 100%;
            border-collapse: collapse;
            border-bottom: 3px double #0f2d4a;
            padding-bottom: 6px;
            margin-bottom: 12px;
        }
        .kop-table td {
            border: none;
            padding: 0;
            vertical-align: middle;
            text-align: center;
        }
        .kop-text h4 {
            margin: 0;
            font-size: 11.5px;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: #334155;
        }
        .kop-text h2 {
            margin: 2px 0;
            font-size: 15px;
            font-weight: 800;
            color: #0f2d4a;
            letter-spacing: 0.5px;
        }
        .kop-text h3 {
            margin: 1px 0;
            font-size: 12px;
            font-weight: bold;
            color: #1e3a8a;
        }
        .kop-text p {
            margin: 2px 0 0 0;
            font-size: 9px;
            color: #475569;
        }
        .report-header {
            text-align: center;
            margin-bottom: 12px;
        }
        .report-header h3 {
            margin: 0;
            font-size: 12.5px;
            font-weight: bold;
            text-decoration: underline;
            color: #0f2d4a;
        }
        .report-header p {
            margin: 3px 0 0 0;
            font-size: 9px;
            color: #475569;
        }
        table.data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        table.data-table th {
            background-color: #0f2d4a;
            color: #ffffff;
            font-size: 9.5px;
            font-weight: bold;
            text-align: center;
            padding: 6px 4px;
            border: 1px solid #0f2d4a;
            text-transform: uppercase;
        }
        table.data-table td {
            border: 1px solid #cbd5e1;
            padding: 5px 6px;
            vertical-align: top;
            font-size: 9px;
        }
        table.data-table tr:nth-child(even) {
            background-color: #f8fafc;
        }
        .total-row {
            background-color: #e2e8f0 !important;
            font-weight: bold;
            font-size: 9.5px;
        }
        .badge {
            display: inline-block;
            padding: 2px 5px;
            font-size: 8px;
            font-weight: bold;
            border-radius: 3px;
        }
        .badge-arsip { background-color: #dcfce7; color: #166534; }
        .badge-proses { background-color: #fef3c7; color: #92400e; }
        .badge-setuju { background-color: #e0f2fe; color: #075985; }
        .badge-koreksi { background-color: #fee2e2; color: #991b1b; }
        .footer-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .footer-table td {
            border: none;
            padding: 0;
            vertical-align: top;
            font-size: 9.5px;
        }
    </style>
</head>
<body>

    <!-- KOP RESMI -->
    <table class="kop-table">
        <tr>
            <td class="kop-text">
                <h4>PEMERINTAH KOTA PEKANBARU</h4>
                <h2>BADAN PENGELOLA KEUANGAN DAN ASET DAERAH</h2>
                <h3>SUB BIDANG ASET</h3>
                <p>Jalan Abdul Rahman Hamid, Komplek Perkantoran Tenayan Raya, Gedung B3, Kota Pekanbaru, Riau<br>Email: bpkad@pekanbaru.go.id | Sistem Informasi Manajemen Surat (SIMANSUR)</p>
            </td>
        </tr>
    </table>

    <div class="report-header">
        <h3>BUKU AGENDA & REKAPITULASI SURAT KELUAR</h3>
        <p>Periode: <b>{{ $startDate }}</b> s.d. <b>{{ $endDate }}</b> &nbsp;|&nbsp; Dicetak oleh: <b>{{ $user->nama_lengkap }}</b> ({{ strtoupper($user->role) }}) &nbsp;|&nbsp; Tanggal Cetak: {{ date('d/m/Y H:i') }} WIB</p>
    </div>

    <table class="data-table">
        <thead>
            <tr>
                <th width="3%">NO</th>
                <th width="13%">NO. AGENDA</th>
                <th width="15%">NO. SURAT</th>
                <th width="9%">TGL SURAT</th>
                <th width="18%">OPD / INSTANSI TUJUAN</th>
                <th width="24%">PERIHAL SURAT</th>
                <th width="9%">DOKUMEN</th>
                <th width="9%">STATUS</th>
            </tr>
        </thead>
        <tbody>
            @forelse($items as $index => $item)
            <tr>
                <td align="center">{{ $index + 1 }}</td>
                <td align="center"><b style="color:#0f2d4a;">{{ $item->no_agenda }}</b></td>
                <td><b>{{ $item->no_surat }}</b></td>
                <td align="center">{{ $item->tanggal_surat ? $item->tanggal_surat->format('d/m/Y') : '-' }}</td>
                <td><b>{{ $item->opd_tujuan }}</b></td>
                <td>{{ $item->perihal }}</td>
                <td align="center">{{ strtoupper(str_replace('_', ' ', $item->jenis_dokumen)) }}</td>
                <td align="center">
                    @php
                        $st = $item->status;
                        $badgeClass = 'badge-proses';
                        if ($st === 'diarsipkan') $badgeClass = 'badge-arsip';
                        elseif (str_contains($st, 'disetujui') || str_contains($st, 'terverifikasi')) $badgeClass = 'badge-setuju';
                        elseif (str_contains($st, 'kembalikan') || str_contains($st, 'ditolak')) $badgeClass = 'badge-koreksi';
                    @endphp
                    <span class="badge {{ $badgeClass }}">
                        {{ strtoupper(str_replace('_', ' ', $st)) }}
                    </span>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="8" align="center" style="padding:15px; color:#64748b;">
                    <em>Tidak ditemukan data persuratan keluar pada rentang filter yang dipilih.</em>
                </td>
            </tr>
            @endforelse
            @if(count($items) > 0)
            <tr class="total-row">
                <td colspan="7" align="right" style="padding:6px 10px;">TOTAL DATA SURAT KELUAR:</td>
                <td align="center" style="padding:6px 10px;"><b>{{ count($items) }} Dokumen</b></td>
            </tr>
            @endif
        </tbody>
    </table>

    <table class="footer-table">
        <tr>
            <td width="65%">
                <p style="margin:0; font-size:8.5px; color:#64748b;">
                    * Dokumen rekapitulasi ini dicetak secara otomatis melalui aplikasi SIMANSUR BPKAD Kota Pekanbaru.<br>
                    * Sumber kebenaran fisik merujuk pada berkas dokumen scan asli yang tersimpan dalam sistem.
                </p>
            </td>
            <td width="35%" align="center">
                <p style="margin:0;">Pekanbaru, {{ date('d F Y') }}<br>Kepala Bidang Aset,</p>
                <div style="height: 48px;"></div>
                <p style="margin:0;">
                    <b>Drs. H. Ahmad Fauzi, M.Si</b><br>
                    NIP. 19750812 199803 1 002
                </p>
            </td>
        </tr>
    </table>

    <script type="text/php">
        if (isset($pdf)) {
            $x = 750;
            $y = 565;
            $text = "Halaman {PAGE_NUM} dari {PAGE_COUNT}";
            $font = $fontMetrics->get_font("Helvetica", "normal");
            $size = 8;
            $color = array(0.4, 0.4, 0.4);
            $pdf->page_text($x, $y, $text, $font, $size, $color);
        }
    </script>
</body>
</html>
