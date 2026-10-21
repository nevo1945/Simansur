import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Inbox,
  PlusCircle,
  Search,
  Filter,
  FileText,
  Printer,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getSuratMasukList, deleteSuratMasuk } from '../../api/suratMasuk';
import { getCetakDisposisiUrl } from '../../api/laporan';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { getStatusInfo, getSifatBadge, formatDateIndo, getBidangShortLabel } from '../../utils/formatters';

export default function SuratMasukList() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('semua'); // 'semua' | 'perlu_tindakan' | 'selesai'
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sifatFilter, setSifatFilter] = useState('');
  const [bidangFilter, setBidangFilter] = useState('');
  const [page, setPage] = useState(1);

  // Debounce search
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ['surat-masuk-list', activeTab, debouncedSearch, statusFilter, sifatFilter, bidangFilter, page],
    queryFn: () =>
      getSuratMasukList({
        tab: activeTab === 'semua' ? undefined : activeTab,
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
        sifat: sifatFilter || undefined,
        bidang_tujuan: bidangFilter || undefined,
        page,
        per_page: 15,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSuratMasuk,
    onSuccess: () => {
      queryClient.invalidateQueries(['surat-masuk-list']);
    },
  });

  const handleDelete = (id, noAgenda) => {
    if (window.confirm(`Yakin ingin menghapus surat masuk no agenda ${noAgenda}? Data akan dipindahkan ke tempat sampah.`)) {
      deleteMutation.mutate(id);
    }
  };

  const suratList = data?.data?.data || [];
  const meta = data?.data || {};

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Surat Masuk' }]} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Agenda Surat Masuk</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar lengkap berkas scan persuratan dinas masuk dan riwayat disposisi
          </p>
        </div>

        {user?.role === 'admin' && (
          <Link to="/surat-masuk/buat">
            <Button variant="primary" icon={PlusCircle}>
              Input Surat Masuk
            </Button>
          </Link>
        )}
      </div>

      {/* Tabs & Filters */}
      <Card className="p-4 space-y-4">
        {/* Quick Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('semua');
              setPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-btn text-xs font-bold transition-all shrink-0 ${
              activeTab === 'semua'
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Semua Surat
          </button>

          <button
            onClick={() => {
              setActiveTab('perlu_tindakan');
              setPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-btn text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'perlu_tindakan'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Perlu Tindakan Saya</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('selesai');
              setPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-btn text-xs font-bold transition-all shrink-0 ${
              activeTab === 'selesai'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Selesai / Diarsipkan
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nomor, agenda, OPD, perihal..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-input focus:bg-white focus:border-primary focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-input focus:bg-white focus:border-primary focus:outline-none"
          >
            <option value="">Semua Status</option>
            <option value="baru">Baru Masuk</option>
            <option value="diteruskan_kasubid">Diteruskan Kasubid</option>
            <option value="diteruskan_staff">Diteruskan ke Staf</option>
            <option value="selesai_staff">Selesai Staf</option>
            <option value="terverifikasi_kasubid">Terverifikasi Kasubid</option>
            <option value="disetujui_kabid">Disetujui Kabid</option>
            <option value="diarsipkan">Diarsipkan</option>
            <option value="perlu_koreksi">Perlu Koreksi</option>
          </select>

          <select
            value={sifatFilter}
            onChange={(e) => {
              setSifatFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-input focus:bg-white focus:border-primary focus:outline-none"
          >
            <option value="">Semua Sifat Surat</option>
            <option value="biasa">Biasa</option>
            <option value="penting">Penting</option>
            <option value="segera">Segera</option>
            <option value="rahasia">Rahasia</option>
          </select>

          {(user?.role === 'admin' || user?.role === 'kabid') && (
            <select
              value={bidangFilter}
              onChange={(e) => {
                setBidangFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-input focus:bg-white focus:border-primary focus:outline-none"
            >
              <option value="">Semua Sub Bidang</option>
              <option value="ipa">IPA – Inventarisasi &amp; Penghapusan Aset</option>
              <option value="p3a">P3A – Pemanfaatan, Penggunaan &amp; Pengamanan Aset</option>
            </select>
          )}
        </div>
      </Card>

      {/* Surat Masuk Table */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500">Memuat data agenda surat masuk...</div>
        ) : suratList.length === 0 ? (
          <EmptyState
            title="Tidak Ada Surat Masuk"
            description="Tidak ada dokumen yang sesuai dengan kriteria filter saat ini."
            actionLabel={user?.role === 'admin' ? 'Input Surat Baru' : undefined}
            onAction={() => window.location.assign('/surat-masuk/buat')}
          />
        ) : (
          <>
            {/* Mobile Cards View (Visible on mobile screens) */}
            <div className="md:hidden divide-y divide-slate-100">
              {suratList.map((item) => {
                const statusInfo = getStatusInfo(item.status);
                const sifatInfo = getSifatBadge(item.sifat);

                return (
                  <div key={item.id} className="p-4 hover:bg-slate-50/80 transition-colors space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {item.no_agenda}
                      </span>
                      <Badge dotColor={statusInfo.dot} className={statusInfo.bg}>
                        {statusInfo.label}
                      </Badge>
                    </div>

                    <div>
                      <p className="font-semibold text-slate-900 text-xs leading-snug">{item.perihal}</p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        <span className="font-medium text-slate-700">{item.opd_asal}</span> • No. {item.no_surat}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                        {getBidangShortLabel(item.bidang_tujuan)}
                      </span>
                      <span className={`px-2 py-0.5 rounded font-bold uppercase border ${sifatInfo.bg}`}>
                        {sifatInfo.label}
                      </span>
                      <span className="text-slate-400">
                        {formatDateIndo(item.tanggal_surat)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                      <Link to={`/surat-masuk/${item.id}`} className="flex-1">
                        <Button variant="primary" size="sm" icon={Eye} className="w-full justify-center text-xs py-1.5">
                          Buka Detail
                        </Button>
                      </Link>

                      <a
                        href={getCetakDisposisiUrl(item.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-btn border border-slate-200 transition-colors shrink-0"
                        title="Cetak Disposisi"
                      >
                        <Printer className="w-4 h-4" />
                      </a>

                      {user?.role === 'admin' && (
                        <button
                          onClick={() => handleDelete(item.id, item.no_agenda)}
                          title="Hapus Surat"
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-btn border border-slate-200 transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (Visible on tablet and desktop screens) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">No. Agenda</th>
                    <th className="py-3 px-4">Surat & Tanggal</th>
                    <th className="py-3 px-4">Pengirim (OPD)</th>
                    <th className="py-3 px-4">Perihal</th>
                    <th className="py-3 px-4">Bidang</th>
                    <th className="py-3 px-4">Sifat</th>
                    <th className="py-3 px-4">Status Alur</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {suratList.map((item) => {
                    const statusInfo = getStatusInfo(item.status);
                    const sifatInfo = getSifatBadge(item.sifat);

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-primary whitespace-nowrap">
                          {item.no_agenda}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <p className="font-semibold text-slate-900">{item.no_surat}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Tgl: {formatDateIndo(item.tanggal_surat)}
                          </p>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-800 max-w-[160px] truncate" title={item.opd_asal}>
                          {item.opd_asal}
                        </td>
                        <td className="py-3.5 px-4 max-w-[240px] truncate text-slate-700" title={item.perihal}>
                          {item.perihal}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-semibold text-slate-700">
                            {getBidangShortLabel(item.bidang_tujuan)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${sifatInfo.bg}`}>
                            {sifatInfo.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <Badge dotColor={statusInfo.dot} className={statusInfo.bg}>
                            {statusInfo.label}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Link to={`/surat-masuk/${item.id}`} title="Lihat Detail & Dokumen">
                              <Button variant="outline" size="sm" icon={Eye}>
                                Detail
                              </Button>
                            </Link>

                            <a
                              href={getCetakDisposisiUrl(item.id)}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Cetak Lembar Disposisi"
                              className="p-1.5 text-slate-600 hover:text-primary hover:bg-slate-100 rounded transition-colors"
                            >
                              <Printer className="w-4 h-4" />
                            </a>

                            {user?.role === 'admin' && (
                              <button
                                onClick={() => handleDelete(item.id, item.no_agenda)}
                                title="Hapus Surat (Soft Delete)"
                                aria-label="Hapus Surat"
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination Bar */}
        {meta.total > meta.per_page && (
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span>
              Menampilkan {meta.from || 0} - {meta.to || 0} dari total {meta.total} surat
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                icon={ChevronLeft}
              >
                Sebelumnya
              </Button>
              <span className="font-semibold text-slate-800">
                Hal. {page} dari {meta.last_page}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.last_page}
                onClick={() => setPage((prev) => Math.min(prev + 1, meta.last_page))}
                icon={ChevronRight}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
