<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Rekapitulasi Surat Keluar - BPKAD Kota Pekanbaru</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #1f2937; margin: 15px; }
        .kop { text-align: center; border-bottom: 2px solid #1A3A5C; padding-bottom: 8px; margin-bottom: 16px; }
        .kop h3 { margin: 0; font-size: 14px; text-transform: uppercase; color: #1A3A5C; }
        .kop h2 { margin: 2px 0; font-size: 16px; font-weight: bold; }
        .kop p { margin: 0; font-size: 10px; color: #4b5563; }
        .title { text-align: center; margin-bottom: 14px; }
        .title h4 { margin: 0; font-size: 13px; text-decoration: underline; }
        .title p { margin: 2px 0 0 0; font-size: 10px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background-color: #1A3A5C; color: #ffffff; padding: 6px 4px; font-size: 10px; border: 1px solid #1A3A5C; text-align: center; }
        td { border: 1px solid #cbd5e1; padding: 5px 4px; vertical-align: top; font-size: 10px; }
        tr:nth-child(even) { background-color: #f8fafc; }
        .ttd-box { width: 35%; float: right; text-align: center; margin-top: 25px; }
    </style>
</head>
<body>
    <div class="kop">
        <h3>Pemerintah Kota Pekanbaru</h3>
        <h2>BADAN PENGELOLA KEUANGAN DAN ASET DAERAH</h2>
        <p>Sub Bidang Aset | Jalan Abdul Rahman Hamid, Komplek Perkantoran Tenayan Raya, Pekanbaru</p>
    </div>

    <div class="title">
        <h4>BUKU AGENDA & REKAPITULASI SURAT KELUAR</h4>
        <p>Periode: {{ $startDate }} s.d. {{ $endDate }} | Dicetak oleh: {{ $user->nama_lengkap }} ({{ strtoupper($user->role) }})</p>
    </div>

    <table>
        <thead>
            <tr>
                <th width="4%">No</th>
                <th width="14%">No. Agenda</th>
                <th width="15%">No. Surat</th>
                <th width="8%">Tgl Surat</th>
                <th width="18%">OPD Tujuan</th>
                <th width="23%">Perihal</th>
                <th width="9%">Dokumen</th>
                <th width="9%">Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($items as $index => $item)
            <tr>
                <td align="center">{{ $index + 1 }}</td>
                <td><b>{{ $item->no_agenda }}</b></td>
                <td>{{ $item->no_surat }}</td>
                <td align="center">{{ $item->tanggal_surat ? $item->tanggal_surat->format('d/m/Y') : '-' }}</td>
                <td>{{ $item->opd_tujuan }}</td>
                <td>{{ $item->perihal }}</td>
                <td align="center">{{ strtoupper($item->jenis_dokumen) }}</td>
                <td align="center"><b>{{ strtoupper(str_replace('_', ' ', $item->status)) }}</b></td>
            </tr>
            @empty
            <tr>
                <td colspan="8" align="center">Tidak ada data surat keluar untuk kriteria ini.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="ttd-box">
        <p>Pekanbaru, {{ date('d F Y') }}<br>Kepala Bidang Aset</p>
        <div style="height: 45px;"></div>
        <p><b>Drs. H. Ahmad Fauzi, M.Si</b><br>NIP. 19750812 199803 1 002</p>
    </div>
</body>
</html>
