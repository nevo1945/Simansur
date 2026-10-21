<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExcelExportService
{
    /**
     * Export Rekapitulasi Surat Masuk ke Excel (.xlsx) dengan layout dinas resmi yang rapi
     */
    public function exportSuratMasuk($items, $startDate, $endDate, $user): StreamedResponse
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Surat Masuk');

        // Page setup
        $sheet->setShowGridLines(true);

        // KOP & Header Judul
        $sheet->mergeCells('A1:J1');
        $sheet->setCellValue('A1', 'PEMERINTAH KOTA PEKANBARU');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('1A3A5C'));
        $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $sheet->mergeCells('A2:J2');
        $sheet->setCellValue('A2', 'BADAN PENGELOLA KEUANGAN DAN ASET DAERAH');
        $sheet->getStyle('A2')->getFont()->setBold(true)->setSize(13)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('1A3A5C'));
        $sheet->getStyle('A2')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $sheet->mergeCells('A3:J3');
        $sheet->setCellValue('A3', 'Sub Bidang Aset | Jalan Abdul Rahman Hamid, Komplek Perkantoran Tenayan Raya, Pekanbaru');
        $sheet->getStyle('A3')->getFont()->setSize(9)->setItalic(true)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('4B5563'));
        $sheet->getStyle('A3')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $sheet->mergeCells('A5:J5');
        $sheet->setCellValue('A5', 'BUKU AGENDA & REKAPITULASI SURAT MASUK');
        $sheet->getStyle('A5')->getFont()->setBold(true)->setSize(12)->setUnderline(true);
        $sheet->getStyle('A5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $sheet->mergeCells('A6:J6');
        $sheet->setCellValue('A6', "Periode: {$startDate} s.d. {$endDate}  |  Dicetak oleh: {$user->nama_lengkap} (" . strtoupper($user->role) . ")  |  Waktu: " . date('d/m/Y H:i'));
        $sheet->getStyle('A6')->getFont()->setSize(9)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('4B5563'));
        $sheet->getStyle('A6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Table Header
        $headers = [
            'A' => 'NO',
            'B' => 'NO. AGENDA',
            'C' => 'NO. SURAT',
            'D' => 'TGL SURAT',
            'E' => 'TGL TERIMA',
            'F' => 'OPD PENGIRIM',
            'G' => 'PERIHAL',
            'H' => 'SUB BIDANG',
            'I' => 'SIFAT',
            'J' => 'STATUS',
        ];

        $headerRow = 8;
        $sheet->getRowDimension($headerRow)->setRowHeight(28);

        foreach ($headers as $col => $title) {
            $cell = $col . $headerRow;
            $sheet->setCellValue($cell, $title);
            $sheet->getStyle($cell)->getFont()->setBold(true)->setSize(10)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FFFFFF'));
            $sheet->getStyle($cell)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('1A3A5C');
            $sheet->getStyle($cell)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
        }

        // Data Rows
        $row = 9;
        $no = 1;
        foreach ($items as $item) {
            $sheet->getRowDimension($row)->setRowHeight(24);

            $sheet->setCellValue("A{$row}", $no++);
            $sheet->setCellValue("B{$row}", $item->no_agenda);
            $sheet->setCellValue("C{$row}", $item->no_surat);
            $sheet->setCellValue("D{$row}", $item->tanggal_surat ? $item->tanggal_surat->format('d/m/Y') : '-');
            $sheet->setCellValue("E{$row}", $item->tanggal_terima ? $item->tanggal_terima->format('d/m/Y') : '-');
            $sheet->setCellValue("F{$row}", $item->opd_asal);
            $sheet->setCellValue("G{$row}", $item->perihal);
            $sheet->setCellValue("H{$row}", strtoupper($item->bidang_tujuan ?? '-'));
            $sheet->setCellValue("I{$row}", strtoupper($item->sifat ?? '-'));
            $sheet->setCellValue("J{$row}", strtoupper(str_replace('_', ' ', $item->status ?? '-')));

            // Alignments
            $sheet->getStyle("A{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
            $sheet->getStyle("B{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
            $sheet->getStyle("B{$row}")->getFont()->setBold(true);
            $sheet->getStyle("C{$row}")->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
            $sheet->getStyle("D{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
            $sheet->getStyle("E{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
            $sheet->getStyle("F{$row}")->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
            $sheet->getStyle("G{$row}")->getAlignment()->setVertical(Alignment::VERTICAL_CENTER)->setWrapText(true);
            $sheet->getStyle("H{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
            $sheet->getStyle("I{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
            $sheet->getStyle("J{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
            $sheet->getStyle("J{$row}")->getFont()->setBold(true);

            // Zebra background
            if ($row % 2 === 0) {
                $sheet->getStyle("A{$row}:J{$row}")->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('F8FAFC');
            }

            $row++;
        }

        // Summary row
        $summaryRow = $row;
        $sheet->mergeCells("A{$summaryRow}:I{$summaryRow}");
        $sheet->setCellValue("A{$summaryRow}", "TOTAL DATA SURAT MASUK: " . count($items) . " DOKUMEN");
        $sheet->getStyle("A{$summaryRow}")->getFont()->setBold(true)->setSize(10);
        $sheet->getStyle("A{$summaryRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT)->setVertical(Alignment::VERTICAL_CENTER);
        $sheet->setCellValue("J{$summaryRow}", count($items));
        $sheet->getStyle("J{$summaryRow}")->getFont()->setBold(true)->setSize(10);
        $sheet->getStyle("J{$summaryRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
        $sheet->getStyle("A{$summaryRow}:J{$summaryRow}")->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('E2E8F0');

        // Borders
        $styleArray = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'CBD5E1'],
                ],
            ],
        ];
        $sheet->getStyle("A8:J{$summaryRow}")->applyFromArray($styleArray);

        // Column Auto-width
        $sheet->getColumnDimension('A')->setWidth(6);
        $sheet->getColumnDimension('B')->setWidth(18);
        $sheet->getColumnDimension('C')->setWidth(24);
        $sheet->getColumnDimension('D')->setWidth(14);
        $sheet->getColumnDimension('E')->setWidth(14);
        $sheet->getColumnDimension('F')->setWidth(28);
        $sheet->getColumnDimension('G')->setWidth(40);
        $sheet->getColumnDimension('H')->setWidth(15);
        $sheet->getColumnDimension('I')->setWidth(12);
        $sheet->getColumnDimension('J')->setWidth(18);

        return $this->createStreamedResponse($spreadsheet, 'Rekap_Surat_Masuk_BPKAD_' . date('Ymd_His') . '.xlsx');
    }

    /**
     * Export Rekapitulasi Surat Keluar ke Excel (.xlsx) dengan layout dinas resmi yang rapi
     */
    public function exportSuratKeluar($items, $startDate, $endDate, $user): StreamedResponse
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Surat Keluar');

        $sheet->setShowGridLines(true);

        // KOP & Header Judul
        $sheet->mergeCells('A1:I1');
        $sheet->setCellValue('A1', 'PEMERINTAH KOTA PEKANBARU');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('1A3A5C'));
        $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $sheet->mergeCells('A2:I2');
        $sheet->setCellValue('A2', 'BADAN PENGELOLA KEUANGAN DAN ASET DAERAH');
        $sheet->getStyle('A2')->getFont()->setBold(true)->setSize(13)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('1A3A5C'));
        $sheet->getStyle('A2')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $sheet->mergeCells('A3:I3');
        $sheet->setCellValue('A3', 'Sub Bidang Aset | Jalan Abdul Rahman Hamid, Komplek Perkantoran Tenayan Raya, Pekanbaru');
        $sheet->getStyle('A3')->getFont()->setSize(9)->setItalic(true)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('4B5563'));
        $sheet->getStyle('A3')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $sheet->mergeCells('A5:I5');
        $sheet->setCellValue('A5', 'BUKU AGENDA & REKAPITULASI SURAT KELUAR');
        $sheet->getStyle('A5')->getFont()->setBold(true)->setSize(12)->setUnderline(true);
        $sheet->getStyle('A5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $sheet->mergeCells('A6:I6');
        $sheet->setCellValue('A6', "Periode: {$startDate} s.d. {$endDate}  |  Dicetak oleh: {$user->nama_lengkap} (" . strtoupper($user->role) . ")  |  Waktu: " . date('d/m/Y H:i'));
        $sheet->getStyle('A6')->getFont()->setSize(9)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('4B5563'));
        $sheet->getStyle('A6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Table Header
        $headers = [
            'A' => 'NO',
            'B' => 'NO. AGENDA',
            'C' => 'NO. SURAT',
            'D' => 'TGL SURAT',
            'E' => 'OPD TUJUAN',
            'F' => 'PERIHAL',
            'G' => 'JENIS DOKUMEN',
            'H' => 'SIFAT',
            'J' => 'STATUS',
        ];

        // Adjusted columns (A to I)
        $cols = [
            'A' => ['title' => 'NO', 'width' => 6],
            'B' => ['title' => 'NO. AGENDA', 'width' => 18],
            'C' => ['title' => 'NO. SURAT', 'width' => 24],
            'D' => ['title' => 'TGL SURAT', 'width' => 14],
            'E' => ['title' => 'OPD TUJUAN', 'width' => 28],
            'F' => ['title' => 'PERIHAL', 'width' => 40],
            'G' => ['title' => 'JENIS DOKUMEN', 'width' => 18],
            'H' => ['title' => 'SIFAT', 'width' => 12],
            'I' => ['title' => 'STATUS', 'width' => 18],
        ];

        $headerRow = 8;
        $sheet->getRowDimension($headerRow)->setRowHeight(28);

        foreach ($cols as $col => $config) {
            $cell = $col . $headerRow;
            $sheet->setCellValue($cell, $config['title']);
            $sheet->getStyle($cell)->getFont()->setBold(true)->setSize(10)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FFFFFF'));
            $sheet->getStyle($cell)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('1A3A5C');
            $sheet->getStyle($cell)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
            $sheet->getColumnDimension($col)->setWidth($config['width']);
        }

        // Data Rows
        $row = 9;
        $no = 1;
        foreach ($items as $item) {
            $sheet->getRowDimension($row)->setRowHeight(24);

            $sheet->setCellValue("A{$row}", $no++);
            $sheet->setCellValue("B{$row}", $item->no_agenda);
            $sheet->setCellValue("C{$row}", $item->no_surat);
            $sheet->setCellValue("D{$row}", $item->tanggal_surat ? $item->tanggal_surat->format('d/m/Y') : '-');
            $sheet->setCellValue("E{$row}", $item->opd_tujuan);
            $sheet->setCellValue("F{$row}", $item->perihal);
            $sheet->setCellValue("G{$row}", strtoupper(str_replace('_', ' ', $item->jenis_dokumen ?? '-')));
            $sheet->setCellValue("H{$row}", strtoupper($item->sifat ?? '-'));
            $sheet->setCellValue("I{$row}", strtoupper(str_replace('_', ' ', $item->status ?? '-')));

            // Alignments
            $sheet->getStyle("A{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
            $sheet->getStyle("B{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
            $sheet->getStyle("B{$row}")->getFont()->setBold(true);
            $sheet->getStyle("C{$row}")->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
            $sheet->getStyle("D{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
            $sheet->getStyle("E{$row}")->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
            $sheet->getStyle("F{$row}")->getAlignment()->setVertical(Alignment::VERTICAL_CENTER)->setWrapText(true);
            $sheet->getStyle("G{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
            $sheet->getStyle("H{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
            $sheet->getStyle("I{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
            $sheet->getStyle("I{$row}")->getFont()->setBold(true);

            if ($row % 2 === 0) {
                $sheet->getStyle("A{$row}:I{$row}")->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('F8FAFC');
            }

            $row++;
        }

        // Summary row
        $summaryRow = $row;
        $sheet->mergeCells("A{$summaryRow}:H{$summaryRow}");
        $sheet->setCellValue("A{$summaryRow}", "TOTAL DATA SURAT KELUAR: " . count($items) . " DOKUMEN");
        $sheet->getStyle("A{$summaryRow}")->getFont()->setBold(true)->setSize(10);
        $sheet->getStyle("A{$summaryRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT)->setVertical(Alignment::VERTICAL_CENTER);
        $sheet->setCellValue("I{$summaryRow}", count($items));
        $sheet->getStyle("I{$summaryRow}")->getFont()->setBold(true)->setSize(10);
        $sheet->getStyle("I{$summaryRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER)->setVertical(Alignment::VERTICAL_CENTER);
        $sheet->getStyle("A{$summaryRow}:I{$summaryRow}")->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('E2E8F0');

        // Borders
        $styleArray = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'CBD5E1'],
                ],
            ],
        ];
        $sheet->getStyle("A8:I{$summaryRow}")->applyFromArray($styleArray);

        return $this->createStreamedResponse($spreadsheet, 'Rekap_Surat_Keluar_BPKAD_' . date('Ymd_His') . '.xlsx');
    }

    /**
     * Streamed response helper
     */
    private function createStreamedResponse(Spreadsheet $spreadsheet, string $filename): StreamedResponse
    {
        $response = new StreamedResponse(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        });

        $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $response->headers->set('Content-Disposition', 'attachment; filename="' . $filename . '"');
        $response->headers->set('Cache-Control', 'max-age=0, no-cache, must-revalidate, proxy-revalidate');

        return $response;
    }
}
