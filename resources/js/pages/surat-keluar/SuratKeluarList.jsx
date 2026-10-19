import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Send,
  PlusCircle,
  Search,
  FileText,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getSuratKeluarList, deleteSuratKeluar } from '../../api/suratKeluar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { getStatusInfo, getSifatBadge, formatDateIndo } from '../../utils/formatters';

export default function SuratKeluarList() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('semua');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sifatFilter, setSifatFilter] = useState('');
  const [jenisDokumenFilter, setJenisDokumenFilter] = useState('');
  const [page, setPage] = useState(1);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);



  const { data, isLoading } = useQuery({
    queryKey: ['surat-keluar-list', activeTab, debouncedSearch, statusFilter, sifatFilter, jenisDokumenFilter, page],
    queryFn: () =>
      getSuratKeluarList({
        tab: activeTab === 'semua' ? undefined : activeTab,
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
        sifat: sifatFilter || undefined,
        jenis_dokumen: jenisDokumenFilter || undefined,
        page,
        per_page: 15,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSuratKeluar,
    onSuccess: () => {
      queryClient.invalidateQueries(['surat-keluar-list']);
    },
  });

  const handleDelete = (id, noAgenda) => {
    if (window.confirm(`Yakin ingin menghapus surat keluar no agenda ${noAgenda}? Data akan dipindahkan ke tempat sampah.`)) {
      deleteMutation.mutate(id);
    }
  };

  const suratList = data?.data?.data || [];
  const meta = data?.data || {};

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Surat Keluar' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Agenda Surat Keluar</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar pengajuan surat keluar, Berita Acara, dan BAST Aset Daerah
          </p>
        </div>

        {user?.role === 'admin' && (
          <Link to="/surat-keluar/buat">
            <Button variant="secondary" icon={PlusCircle}>
              Input Surat Keluar
            </Button>
          </Link>
        )}
      </div>

      <Card className="p-4 space-y-4">
        {/* Quick Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('semua');
              setPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-btn text-xs font-bold transition-all shrink-0 ${
              activeTab === 'semua' ? 'bg-secondary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Semua Dokumen
          </button>

          <button
            onClick={() => {
              setActiveTab('perlu_tindakan');
              setPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-btn text-xs font-bold transition-all shrink-0 ${
              activeTab === 'perlu_tindakan' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Perlu Tindakan Saya
          </button>

          <button
            onClick={() => {
              setActiveTab('selesai');
              setPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-btn text-xs font-bold transition-all shrink-0 ${
              activeTab === 'selesai' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Diarsipkan
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
              placeholder="Cari nomor, agenda, tujuan, perihal..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-input focus:bg-white focus:border-secondary focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-input focus:bg-white focus:border-secondary focus:outline-none"
          >
            <option value="">Semua Status</option>
            <option value="diinput">Draft Terinput</option>
            <option value="diverifikasi_admin">Diverifikasi Admin</option>
            <option value="disetujui_kabid">Disetujui Kabid</option>
            <option value="diarsipkan">Diarsipkan</option>
            <option value="dikembalikan">Dikembalikan Kabid</option>
          </select>

          <select
            value={jenisDokumenFilter}
            onChange={(e) => {
              setJenisDokumenFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-input focus:bg-white focus:border-secondary focus:outline-none"
          >
            <option value="">Semua Jenis Dokumen</option>
            <option value="surat">Surat Biasa</option>
            <option value="berita_acara">Berita Acara (BA)</option>
            <option value="bast">BAST (Serah Terima)</option>
          </select>

          <select
            value={sifatFilter}
            onChange={(e) => {
              setSifatFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-input focus:bg-white focus:border-secondary focus:outline-none"
          >
            <option value="">Semua Sifat Surat</option>
            <option value="biasa">Biasa</option>
            <option value="penting">Penting</option>
            <option value="segera">Segera</option>
            <option value="rahasia">Rahasia</option>
          </select>
        </div>
      </Card>

      {/* Surat Keluar Table */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500">Memuat data surat keluar...</div>
        ) : suratList.length === 0 ? (
          <EmptyState
            title="Tidak Ada Surat Keluar"
            description="Tidak ada dokumen surat keluar yang sesuai dengan kriteria filter saat ini."
            actionLabel={user?.role === 'admin' ? 'Input Surat Keluar Baru' : undefined}
            onAction={() => window.location.assign('/surat-keluar/buat')}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">No. Agenda</th>
                  <th className="py-3 px-4">Surat & Tanggal</th>
                  <th className="py-3 px-4">OPD Tujuan</th>
                  <th className="py-3 px-4">Perihal</th>
                  <th className="py-3 px-4">Jenis Dokumen</th>
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
                      <td className="py-3.5 px-4 font-mono font-bold text-secondary whitespace-nowrap">
                        {item.no_agenda}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-semibold text-slate-900">{item.no_surat}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Tgl: {formatDateIndo(item.tanggal_surat)}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800 max-w-[160px] truncate" title={item.opd_tujuan}>
                        {item.opd_tujuan}
                      </td>
                      <td className="py-3.5 px-4 max-w-[260px] truncate text-slate-700" title={item.perihal}>
                        {item.perihal}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {item.jenis_dokumen?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge dotColor={statusInfo.dot} className={statusInfo.bg}>
                          {statusInfo.label}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link to={`/surat-keluar/${item.id}`} title="Lihat Detail & Scan Dokumen">
                            <Button variant="outline" size="sm" icon={Eye}>
                              Detail
                            </Button>
                          </Link>

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
        )}

        {meta.total > meta.per_page && (
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
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
