import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { History, Search, Shield, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { getLogAktivitasList } from '../api/logs';
import Breadcrumb from '../components/layout/Breadcrumb';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { formatDateTimeIndo, getRoleBadge } from '../utils/formatters';

export default function LogAktivitas() {
  const [search, setSearch] = useState('');
  const [modulFilter, setModulFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['log-aktivitas', search, modulFilter, page],
    queryFn: () =>
      getLogAktivitasList({
        search: search || undefined,
        modul: modulFilter || undefined,
        page,
        per_page: 20,
      }),
  });

  const logs = data?.data?.data || [];
  const meta = data?.data || {};

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Log Aktivitas Sistem' }]} />

      <div>
        <h1 className="text-xl font-bold text-slate-900">Audit Trail & Log Aktivitas</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Rekaman seluruh mutasi data, login, disposisi, verifikasi, dan approval pengguna
        </p>
      </div>

      <Card className="p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cari aksi, keterangan log, atau alamat IP..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-input focus:bg-white focus:border-primary focus:outline-none"
          />
        </div>

        <select
          value={modulFilter}
          onChange={(e) => {
            setModulFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-input focus:bg-white focus:border-primary focus:outline-none"
        >
          <option value="">Semua Modul</option>
          <option value="Autentikasi">Autentikasi</option>
          <option value="Surat Masuk">Surat Masuk</option>
          <option value="Surat Keluar">Surat Keluar</option>
          <option value="Manajemen User">Manajemen User</option>
          <option value="Akun Pengguna">Akun Pengguna</option>
        </select>
      </Card>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500">Memuat log aktivitas...</div>
        ) : logs.length === 0 ? (
          <EmptyState
            icon={History}
            title="Tidak Ada Catatan Log"
            description="Belum ada riwayat aktivitas yang tercatat untuk filter ini."
          />
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Pengguna</th>
                  <th className="py-3 px-4">Modul</th>
                  <th className="py-3 px-4">Aksi</th>
                  <th className="py-3 px-4">Uraian / Keterangan</th>
                  <th className="py-3 px-4 text-right">Alamat IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => {
                  const roleBadge = getRoleBadge(log.user?.role);
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {formatDateTimeIndo(log.created_at)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-900 block">{log.user?.nama_lengkap || 'Sistem'}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${roleBadge.color}`}>
                          {roleBadge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {log.modul}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                        {log.aksi}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-sm">
                        {log.keterangan || '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[11px] text-slate-400">
                        {log.ip_address || '-'}
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
              Menampilkan {meta.from || 0} - {meta.to || 0} dari total {meta.total} rekaman
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
