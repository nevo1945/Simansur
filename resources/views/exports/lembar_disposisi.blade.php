<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Lembar Disposisi - {{ $surat->no_agenda }}</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #1f2937; margin: 25px; }
        .kop { text-align: center; border-bottom: 3px double #1A3A5C; padding-bottom: 10px; margin-bottom: 16px; }
        .kop h3 { margin: 0; font-size: 14px; text-transform: uppercase; color: #1A3A5C; letter-spacing: 1px; }
        .kop h2 { margin: 4px 0; font-size: 18px; font-weight: bold; }
        .kop p { margin: 0; font-size: 11px; color: #4b5563; }
        .title-box { text-align: center; font-weight: bold; font-size: 16px; text-transform: uppercase; padding: 6px; background-color: #f1f5f9; border: 1px solid #1A3A5C; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        th, td { border: 1px solid #334155; padding: 7px 10px; vertical-align: top; }
        .header-cell { background-color: #f8fafc; font-weight: bold; width: 22%; }
        .disposisi-box { border: 1px solid #334155; padding: 12px; min-height: 120px; background-color: #ffffff; }
        .ttd-container { width: 100%; margin-top: 25px; }
        .ttd-right { width: 45%; float: right; text-align: center; }
        .ttd-left { width: 45%; float: left; text-align: center; }
    </style>
</head>
<body>
    <div class="kop">
        <h3>Pemerintah Kota Pekanbaru</h3>
        <h2>BADAN PENGELOLA KEUANGAN DAN ASET DAERAH</h2>
        <p>Jalan Abdul Rahman Hamid, Komplek Perkantoran Tenayan Raya, Kota Pekanbaru</p>
    </div>

    <div class="title-box">
        LEMBAR DISPOSISI KENDALI PERSURATAN
    </div>

    <table>
        <tr>
            <td class="header-cell">No. Agenda</td>
            <td width="30%"><b>{{ $surat->no_agenda }}</b></td>
            <td class="header-cell">Sifat Surat</td>
            <td><b>{{ strtoupper($surat->sifat) }}</b></td>
        </tr>
        <tr>
            <td class="header-cell">No. Surat</td>
            <td>{{ $surat->no_surat }}</td>
            <td class="header-cell">Tanggal Terima</td>
            <td>{{ $surat->tanggal_terima ? $surat->tanggal_terima->format('d F Y') : '-' }}</td>
        </tr>
        <tr>
            <td class="header-cell">Tanggal Surat</td>
            <td>{{ $surat->tanggal_surat ? $surat->tanggal_surat->format('d F Y') : '-' }}</td>
            <td class="header-cell">Bidang Tujuan</td>
            <td><b>Sub Bidang {{ ucfirst($surat->bidang_tujuan) }}</b></td>
        </tr>
        <tr>
            <td class="header-cell">Asal OPD / Pengirim</td>
            <td colspan="3"><b>{{ $surat->opd_asal }}</b></td>
        </tr>
        <tr>
            <td class="header-cell">Perihal</td>
            <td colspan="3">{{ $surat->perihal }}</td>
        </tr>
    </table>

    <div style="margin-bottom: 6px; font-weight: bold;">RINGKASAN INSTRUKSI / PETUNJUK DISPOSISI:</div>
    <div class="disposisi-box">
        <p style="margin: 0; font-size: 13px; line-height: 1.6;">
            {{ $surat->isi_disposisi ?? 'Tidak ada catatan khusus. Tindak lanjuti sesuai ketentuan perundang-undangan.' }}
        </p>
    </div>

    @if($surat->tindakLanjut && $surat->tindakLanjut->count() > 0)
    <div style="margin-top: 16px; margin-bottom: 6px; font-weight: bold;">CATATAN RIWAYAT TINDAK LANJUT BIDANG:</div>
    <table>
        <thead>
            <tr style="background:#f1f5f9;">
                <th width="20%">Waktu</th>
                <th width="25%">Pejabat / Staf</th>
                <th width="15%">Aksi</th>
                <th width="40%">Catatan / Hasil</th>
            </tr>
        </thead>
        <tbody>
            @foreach($surat->tindakLanjut as $tl)
            <tr>
                <td style="font-size:10px;">{{ $tl->created_at ? $tl->created_at->format('d/m/Y H:i') : '-' }}</td>
                <td><b>{{ $tl->user->nama_lengkap ?? '-' }}</b><br><small>({{ strtoupper($tl->user->role ?? '-') }})</small></td>
                <td>{{ strtoupper($tl->jenis) }}</td>
                <td>{{ $tl->catatan }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    <div class="ttd-container">
        <div class="ttd-left">
            <p>Petugas Agenda (Admin),</p>
            <div style="height: 45px;"></div>
            <p><b>{{ $surat->creator->nama_lengkap ?? 'Administrator' }}</b><br>NIP. {{ $surat->creator->nip ?? '-' }}</p>
        </div>
        <div class="ttd-right">
            <p>Pekanbaru, {{ date('d F Y') }}<br>Kepala Bidang Aset,</p>
            <div style="height: 45px;"></div>
            <p><b>{{ $surat->approver ? $surat->approver->nama_lengkap : 'Drs. H. Ahmad Fauzi, M.Si' }}</b><br>NIP. {{ $surat->approver ? $surat->approver->nip : '19750812 199803 1 002' }}</p>
        </div>
    </div>
</body>
</html>
