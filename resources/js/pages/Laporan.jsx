import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  FileBarChart,
  FileDown,
  Printer,
  Calendar,
  Filter,
  Inbox,
  Send,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getRekapitulasi, getExportPdfUrl, getExportCsvUrl } from '../api/laporan';
import Breadcrumb from '../components/layout/Breadcrumb';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { formatDateIndo, getStatusInfo } from '../utils/formatters';

export default function Laporan() {
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState('surat_masuk'); // 'surat_masuk' | 'surat_keluar'
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [bidangFilter, setBidangFilter] = useState('');
  const [sifatFilter, setSifatFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['rekapitulasi', startDate, endDate, bidangFilter, sifatFilter],
    queryFn: () =>
      getRekapitulasi({
        start_date: startDate,
        end_date: endDate,
        bidang_tujuan: bidangFilter || undefined,
        sifat: sifatFilter || undefined,
      }),
  });

  const statsMasuk = data?.data?.stats_masuk || {};
  const statsKeluar = data?.data?.stats_keluar || {};
  const listMasuk = data?.data?.list_masuk || [];
  const listKeluar = data?.data?.list_keluar || [];

  const handleExportPdf = () => {
    const type = activeTab === 'surat_masuk' ? 'surat-masuk' : 'surat-keluar';
    const url = getExportPdfUrl(type, {
      start_date: startDate,
      end_date: endDate,
      bidang_tujuan: bidangFilter || undefined,
    });
    window.open(url, '_blank');
  };

  const handleExportCsv = () => {
    const type = activeTab === 'surat_masuk' ? 'surat-masuk' : 'surat-keluar';
    const url = getExportCsvUrl(type, {
      start_date: startDate,
      end_date: endDate,
    });
    window.location.href = url;
  };

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Laporan & Rekapitulasi' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Laporan & Rekapitulasi Persuratan</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cetak buku agenda resmi dan ekspor rekapitulasi data persuratan BPKAD Kota Pekanbaru
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={FileSpreadsheet} onClick={handleExportCsv}>
            Ekspor Excel (CSV)
          </Button>
          <Button variant="primary" size="sm" icon={Printer} onClick={handleExportPdf}>
            Cetak PDF Resmi
          </Button>
        </div>
      </div>

      {/* Filter Parameters */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-primary" />
          <span>Parameter Periode & Kriteria</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Mulai Tanggal</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-input focus:bg-white focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Sampai Tanggal</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-input focus:bg-white focus:border-primary focus:outline-none"
            />
          </div>

          {(user?.role === 'admin' || user?.role === 'kabid') && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Sub Bidang</label>
              <select
                value={bidangFilter}
                onChange={(e) => setBidangFilter(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-input focus:bg-white focus:border-primary focus:outline-none"
              >
                <option value="">Semua Sub Bidang</option>
                <option value="ipa">IPA – Inventarisasi &amp; Penghapusan Aset</option>
                <option value="p3a">P3A – Pemanfaatan, Penggunaan &amp; Pengamanan Aset</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Sifat Dokumen</label>
            <select
              value={sifatFilter}
              onChange={(e) => setSifatFilter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-input focus:bg-white focus:border-primary focus:outline-none"
            >
              <option value="">Semua Sifat</option>
              <option value="biasa">Biasa</option>
              <option value="penting">Penting</option>
              <option value="segera">Segera</option>
              <option value="rahasia">Rahasia</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-primary">
          <p className="text-xs text-slate-500 font-medium">Surat Masuk Periode Ini</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{statsMasuk.total || 0}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{statsMasuk.diarsipkan || 0} telah diarsipkan</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-secondary">
          <p className="text-xs text-slate-500 font-medium">Surat Keluar Periode Ini</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{statsKeluar.total || 0}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{statsKeluar.diarsipkan || 0} telah diarsipkan</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-500">
          <p className="text-xs text-slate-500 font-medium">Telah Disetujui Kabid</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {(statsMasuk.disetujui_kabid || 0) + (statsKeluar.disetujui_kabid || 0)}
          </p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Siap diarsipkan Admin</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <p className="text-xs text-slate-500 font-medium">Dalam Proses Berjalan</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {(statsMasuk.proses || 0) + (statsKeluar.proses || 0)}
          </p>
          <p className="text-[11px] text-amber-600 mt-0.5">Tindak lanjut & verifikasi</p>
        </Card>
      </div>

      {/* Preview Data Tables */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 border-b border-slate-200 p-3 bg-slate-50/80">
          <button
            onClick={() => setActiveTab('surat_masuk')}
            className={`px-3 py-1.5 rounded-btn text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'surat_masuk' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Rekap Surat Masuk ({listMasuk.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('surat_keluar')}
            className={`px-3 py-1.5 rounded-btn text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'surat_keluar' ? 'bg-secondary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Rekap Surat Keluar ({listKeluar.length})</span>
          </button>
        </div>

        {activeTab === 'surat_masuk' ? (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/60 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                  <th className="py-2.5 px-4">No. Agenda</th>
                  <th className="py-2.5 px-4">No. Surat</th>
                  <th className="py-2.5 px-4">Tgl Terima</th>
                  <th className="py-2.5 px-4">OPD Asal</th>
                  <th className="py-2.5 px-4">Perihal</th>
                  <th className="py-2.5 px-4">Bidang</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {listMasuk.map((item) => {
                  const statusInfo = getStatusInfo(item.status);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-4 font-mono font-bold text-primary">{item.no_agenda}</td>
                      <td className="py-2.5 px-4">{item.no_surat}</td>
                      <td className="py-2.5 px-4">{formatDateIndo(item.tanggal_terima)}</td>
                      <td className="py-2.5 px-4">{item.opd_asal}</td>
                      <td className="py-2.5 px-4 max-w-[200px] truncate">{item.perihal}</td>
                      <td className="py-2.5 px-4 capitalize">{item.bidang_tujuan}</td>
                      <td className="py-2.5 px-4">
                        <Badge dotColor={statusInfo.dot} className={statusInfo.bg}>
                          {statusInfo.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/60 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                  <th className="py-2.5 px-4">No. Agenda</th>
                  <th className="py-2.5 px-4">No. Surat</th>
                  <th className="py-2.5 px-4">Tgl Surat</th>
                  <th className="py-2.5 px-4">OPD Tujuan</th>
                  <th className="py-2.5 px-4">Perihal</th>
                  <th className="py-2.5 px-4">Dokumen</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {listKeluar.map((item) => {
                  const statusInfo = getStatusInfo(item.status);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="py-2.5 px-4 font-mono font-bold text-secondary">{item.no_agenda}</td>
                      <td className="py-2.5 px-4">{item.no_surat}</td>
                      <td className="py-2.5 px-4">{formatDateIndo(item.tanggal_surat)}</td>
                      <td className="py-2.5 px-4">{item.opd_tujuan}</td>
                      <td className="py-2.5 px-4 max-w-[200px] truncate">{item.perihal}</td>
                      <td className="py-2.5 px-4 uppercase">{item.jenis_dokumen?.replace('_', ' ')}</td>
                      <td className="py-2.5 px-4">
                        <Badge dotColor={statusInfo.dot} className={statusInfo.bg}>
                          {statusInfo.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
