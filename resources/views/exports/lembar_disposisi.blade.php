<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Lembar Disposisi - {{ $surat->no_agenda }}</title>
    <style>
        @page {
            margin: 20px 25px 25px 25px;
            size: a4 portrait;
        }
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 11px;
            color: #1e293b;
            line-height: 1.35;
        }
        .kop-table {
            width: 100%;
            border-collapse: collapse;
            border-bottom: 3px double #0f2d4a;
            padding-bottom: 8px;
            margin-bottom: 12px;
        }
        .kop-table td {
            border: none;
            padding: 0;
            vertical-align: middle;
        }
        .kop-text {
            text-align: center;
        }
        .kop-text h4 {
            margin: 0;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: #334155;
        }
        .kop-text h2 {
            margin: 2px 0;
            font-size: 16px;
            font-weight: 800;
            color: #0f2d4a;
            letter-spacing: 0.5px;
        }
        .kop-text h3 {
            margin: 1px 0;
            font-size: 13px;
            font-weight: bold;
            color: #1e3a8a;
        }
        .kop-text p {
            margin: 2px 0 0 0;
            font-size: 9.5px;
            color: #475569;
        }
        .title-bar {
            text-align: center;
            background-color: #0f2d4a;
            color: #ffffff;
            font-weight: bold;
            font-size: 12px;
            letter-spacing: 1.5px;
            padding: 6px;
            margin-bottom: 12px;
            text-transform: uppercase;
            border-radius: 2px;
        }
        .table-data {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        .table-data th, .table-data td {
            border: 1px solid #64748b;
            padding: 5px 8px;
            vertical-align: top;
            font-size: 10px;
        }
        .bg-label {
            background-color: #f1f5f9;
            font-weight: bold;
            color: #1e293b;
        }
        .section-header {
            background-color: #e2e8f0;
            font-weight: bold;
            font-size: 10.5px;
            color: #0f2d4a;
            padding: 4px 8px;
            border: 1px solid #64748b;
            border-bottom: none;
        }
        .disposisi-panel {
            border: 1px solid #64748b;
            padding: 8px 10px;
            margin-bottom: 10px;
            background-color: #ffffff;
        }
        .checkbox-grid {
            width: 100%;
            border-collapse: collapse;
            margin: 4px 0 8px 0;
        }
        .checkbox-grid td {
            border: none;
            padding: 2px 4px;
            font-size: 10px;
            vertical-align: middle;
        }
        .box-check {
            display: inline-block;
            width: 11px;
            height: 11px;
            border: 1.2px solid #334155;
            text-align: center;
            line-height: 10px;
            font-size: 9px;
            font-weight: bold;
            margin-right: 4px;
            background: #fff;
        }
        .box-checked {
            background-color: #0f2d4a;
            color: #ffffff;
            border-color: #0f2d4a;
        }
        .catatan-box {
            border: 1px dashed #94a3b8;
            background-color: #f8fafc;
            padding: 8px;
            min-height: 60px;
            font-size: 10.5px;
            line-height: 1.4;
            color: #0f172a;
        }
        .ttd-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .ttd-table td {
            border: none;
            padding: 0;
            vertical-align: top;
            text-align: center;
            font-size: 10.5px;
        }
        .badge {
            display: inline-block;
            padding: 1px 6px;
            font-size: 9px;
            font-weight: bold;
            border-radius: 3px;
        }
        .badge-biasa { background-color: #e2e8f0; color: #334155; }
        .badge-penting { background-color: #dbeafe; color: #1e40af; }
        .badge-segera { background-color: #fef3c7; color: #92400e; }
        .badge-rahasia { background-color: #fee2e2; color: #991b1b; }
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
                <p>Jalan Abdul Rahman Hamid, Komplek Perkantoran Tenayan Raya, Gedung B3, Kota Pekanbaru, Riau<br>Email: bpkad@pekanbaru.go.id | Portal SIMANSUR</p>
            </td>
        </tr>
    </table>

    <div class="title-bar">
        LEMBAR KENDALI DISPOSISI PERSURATAN
    </div>

    <!-- DATA UTAMA SURAT -->
    <table class="table-data">
        <tr>
            <td class="bg-label" width="18%">No. Agenda</td>
            <td width="32%"><b style="font-size:11.5px; color:#0f2d4a;">{{ $surat->no_agenda }}</b></td>
            <td class="bg-label" width="18%">Tingkat Sifat</td>
            <td width="32%">
                @php
                    $sifat = strtolower($surat->sifat ?? 'biasa');
                @endphp
                <span class="badge badge-{{ $sifat }}">
                    {{ strtoupper($surat->sifat) }}
                </span>
            </td>
        </tr>
        <tr>
            <td class="bg-label">Nomor Surat</td>
            <td><b>{{ $surat->no_surat }}</b></td>
            <td class="bg-label">Tanggal Terima</td>
            <td><b>{{ $surat->tanggal_terima ? $surat->tanggal_terima->format('d/m/Y') : '-' }}</b></td>
        </tr>
        <tr>
            <td class="bg-label">Tanggal Surat</td>
            <td>{{ $surat->tanggal_surat ? $surat->tanggal_surat->format('d/m/Y') : '-' }}</td>
            <td class="bg-label">Sub Bidang Tujuan</td>
            <td>
                <b>SUB BIDANG {{ strtoupper($surat->bidang_tujuan) }}</b>
                @if(strtolower($surat->bidang_tujuan) === 'ipa')
                    <br><span style="font-size:9px; color:#64748b;">(Inventarisasi & Penghapusan Aset)</span>
                @elseif(strtolower($surat->bidang_tujuan) === 'p3a')
                    <br><span style="font-size:9px; color:#64748b;">(Pemanfaatan, Penatausahaan & Pengamanan Aset)</span>
                @endif
            </td>
        </tr>
        <tr>
            <td class="bg-label">Asal Instansi / OPD</td>
            <td colspan="3"><b style="font-size:10.5px;">{{ $surat->opd_asal }}</b></td>
        </tr>
        <tr>
            <td class="bg-label">Perihal Dokumen</td>
            <td colspan="3" style="line-height:1.4;">{{ $surat->perihal }}</td>
        </tr>
        <tr>
            <td class="bg-label">Status Terkini</td>
            <td colspan="3">
                <b>{{ strtoupper(str_replace('_', ' ', $surat->status)) }}</b>
                @if($surat->approver)
                    <span style="color:#64748b; font-size:9.5px;"> &bull; Approved oleh: {{ $surat->approver->nama_lengkap }} (Kabid Aset)</span>
                @endif
            </td>
        </tr>
    </table>

    <!-- DISPOSISI KABID ASET -->
    <div class="section-header">
        INSTRUKSI / ARAHAN DISPOSISI KEPALA BIDANG ASET
    </div>
    <div class="disposisi-panel">
        <table class="checkbox-grid">
            <tr>
                <td width="33%">
                    <span class="box-check {{ strtolower($surat->bidang_tujuan) === 'ipa' ? 'box-checked' : '' }}">
                        {{ strtolower($surat->bidang_tujuan) === 'ipa' ? '&#10003;' : '' }}
                    </span>
                    <b>Kasubid IPA</b>
                </td>
                <td width="33%">
                    <span class="box-check {{ strtolower($surat->bidang_tujuan) === 'p3a' ? 'box-checked' : '' }}">
                        {{ strtolower($surat->bidang_tujuan) === 'p3a' ? '&#10003;' : '' }}
                    </span>
                    <b>Kasubid P3A</b>
                </td>
                <td width="34%">
                    <span class="box-check {{ $surat->tindakLanjut && $surat->tindakLanjut->where('user.role', 'staff')->count() > 0 ? 'box-checked' : '' }}">
                        {{ $surat->tindakLanjut && $surat->tindakLanjut->where('user.role', 'staff')->count() > 0 ? '&#10003;' : '' }}
                    </span>
                    <b>Staf Pelaksana</b>
                </td>
            </tr>
        </table>

        <div style="font-size:9.5px; font-weight:bold; color:#475569; margin: 4px 0 2px 0;">PETUNJUK DISPOSISI / TINDAKAN:</div>
        <table class="checkbox-grid">
            <tr>
                <td width="33%"><span class="box-check">&#10003;</span> Tindak lanjuti / Selesaikan</td>
                <td width="33%"><span class="box-check"></span> Pelajari / Kaji / Telaah</td>
                <td width="34%"><span class="box-check"></span> Siapkan Konsep / Jawaban</td>
            </tr>
            <tr>
                <td><span class="box-check"></span> Koordinasikan / Konfirmasikan</td>
                <td><span class="box-check"></span> Hadiri / Wakili</td>
                <td><span class="box-check {{ $surat->status === 'diarsipkan' ? 'box-checked' : '' }}">{{ $surat->status === 'diarsipkan' ? '&#10003;' : '' }}</span> Simpan / Arsipkan</td>
            </tr>
        </table>

        <div style="font-size:9.5px; font-weight:bold; color:#475569; margin: 6px 0 3px 0;">CATATAN / ARAHAN KHUSUS KABID ASET:</div>
        <div class="catatan-box">
            @if(!empty($surat->isi_disposisi))
                {{ $surat->isi_disposisi }}
            @else
                <em>Tindak lanjuti dan proses sesuai dengan ketentuan perundang-undangan dan tata tertib pengelolaan aset daerah Kota Pekanbaru.</em>
            @endif
        </div>
    </div>

    <!-- RIWAYAT TINDAK LANJUT BIDANG JIKA ADA -->
    @if($surat->tindakLanjut && $surat->tindakLanjut->count() > 0)
    <div class="section-header">
        CATATAN RIWAYAT PROSES & TINDAK LANJUT
    </div>
    <table class="table-data" style="margin-bottom:12px;">
        <thead>
            <tr style="background:#f1f5f9;">
                <th width="15%" align="center">Waktu</th>
                <th width="25%">Pejabat / Staf</th>
                <th width="18%" align="center">Aksi / Status</th>
                <th width="42%">Uraian Tindak Lanjut</th>
            </tr>
        </thead>
        <tbody>
            @foreach($surat->tindakLanjut as $tl)
            <tr>
                <td align="center" style="font-size:9px;">{{ $tl->created_at ? $tl->created_at->format('d/m/Y H:i') : '-' }}</td>
                <td>
                    <b>{{ $tl->user->nama_lengkap ?? '-' }}</b><br>
                    <span style="font-size:8.5px; color:#64748b;">NIP. {{ $tl->user->nip ?? '-' }} ({{ strtoupper($tl->user->role ?? '-') }})</span>
                </td>
                <td align="center">
                    <span style="font-weight:bold; font-size:9px;">{{ strtoupper(str_replace('_', ' ', $tl->jenis)) }}</span>
                </td>
                <td style="font-size:9.5px; line-height:1.35;">{{ $tl->catatan }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    <!-- TANDA TANGAN -->
    <table class="ttd-table">
        <tr>
            <td width="50%">
                <p style="margin:0;">Petugas Pengagenda (Admin),</p>
                <div style="height: 48px;"></div>
                <p style="margin:0;">
                    <b>{{ $surat->creator->nama_lengkap ?? 'Administrator SIMANSUR' }}</b><br>
                    NIP. {{ $surat->creator->nip ?? '-' }}
                </p>
            </td>
            <td width="50%">
                <p style="margin:0;">Pekanbaru, {{ date('d F Y') }}<br>Kepala Bidang Aset,</p>
                <div style="height: 48px;"></div>
                <p style="margin:0;">
                    <b>{{ $surat->approver ? $surat->approver->nama_lengkap : 'Drs. H. Ahmad Fauzi, M.Si' }}</b><br>
                    NIP. {{ $surat->approver ? $surat->approver->nip : '19750812 199803 1 002' }}
                </p>
            </td>
        </tr>
    </table>

</body>
</html>
