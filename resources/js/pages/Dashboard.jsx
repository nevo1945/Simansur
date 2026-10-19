import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Send,
  Archive,
  AlertCircle,
  Clock,
  CheckCircle2,
  PlusCircle,
  FileText,
  ChevronRight,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuthStore } from '../store/authStore';
import { getDashboardData } from '../api/dashboard';
import StatCard from '../components/ui/StatCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { getStatusInfo, getRoleBadge, formatDateIndo } from '../utils/formatters';

export default function Dashboard() {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: getDashboardData,
    refetchInterval: 30000,
  });

  const stats = data?.data?.stats || {};
  const trend7Days = data?.data?.trend_7_days || [];
  const priorityMasuk = data?.data?.priority_surat_masuk || [];
  const priorityKeluar = data?.data?.priority_surat_keluar || [];
  const roleInfo = getRoleBadge(user?.role);

  // Colors for charts conforming to our official government palette
  const COLOR_MASUK = '#1A3A5C'; // Navy
  const COLOR_KELUAR = '#F5A623'; // Amber
  const PIE_COLORS = ['#1A3A5C', '#2E5C8A', '#F5A623', '#10B981', '#64748B'];

  const bidangData = [
    { name: 'IPA (Inventarisasi & Penghapusan)', value: data?.data?.distribusi_bidang?.ipa || 0 },
    { name: 'P3A (Pemanfaatan, Penggunaan & Pengamanan)', value: data?.data?.distribusi_bidang?.p3a || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-card p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${roleInfo.color}`}>
              {roleInfo.label}
            </span>
            {user?.bidang && (
              <span className="text-xs text-slate-500 font-semibold">
                Sub Bidang {user.bidang.toUpperCase()}
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Selamat Datang, {user?.nama_lengkap || 'Pengguna'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sistem Informasi Manajemen Surat (SIMANSUR) BPKAD Sub Bidang Aset Kota Pekanbaru.
          </p>
        </div>

        {user?.role === 'admin' && (
          <div className="flex items-center gap-2">
            <Link to="/surat-masuk/buat">
              <Button variant="primary" size="md" icon={PlusCircle}>
                Input Surat Masuk
              </Button>
            </Link>
            <Link to="/surat-keluar/buat">
              <Button variant="secondary" size="md" icon={PlusCircle}>
                Input Surat Keluar
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Role-Oriented Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Surat Masuk"
          value={stats.total_surat_masuk}
          icon={Inbox}
          color="primary"
          subtitle="Tercatat dalam sistem"
        />

        {user?.role !== 'staff' && (
          <StatCard
            title="Total Surat Keluar"
            value={stats.total_surat_keluar}
            icon={Send}
            color="secondary"
            subtitle="Surat dinas & BAST"
          />
        )}

        <StatCard
          title="Perlu Tindakan Saya"
          value={stats.need_action_count}
          icon={AlertCircle}
          color={stats.need_action_count > 0 ? 'accent' : 'primary'}
          subtitle={
            user?.role === 'kabid'
              ? 'Menunggu persetujuan (Approval)'
              : user?.role === 'admin'
              ? 'Siap arsip / Perlu koreksi'
              : user?.role === 'kasubid'
              ? 'Disposisi & verifikasi staf'
              : 'Tugas tindak lanjut aktif'
          }
          badge={stats.need_action_count > 0 ? `${stats.need_action_count} Tugas` : undefined}
        />

        <StatCard
          title="Total Diarsipkan"
          value={stats.total_arsip}
          icon={Archive}
          color="success"
          subtitle="Arsip resmi disetujui Kabid"
        />
      </div>

      {/* Priority Action Feeds */}
      {stats.need_action_count > 0 && (
        <Card className="p-5 border-amber-300 bg-amber-50/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-amber-100 text-amber-800">
                <AlertCircle className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">
                Daftar Dokumen yang Memerlukan Tindakan Segera
              </h2>
            </div>
            <span className="text-xs text-amber-800 font-semibold">Prioritas Tugas</span>
          </div>

          <div className="divide-y divide-amber-200/60 bg-white rounded-lg border border-amber-200 overflow-hidden">
            {priorityMasuk.map((sm) => {
              const statusInfo = getStatusInfo(sm.status);
              return (
                <div key={sm.id} className="p-3 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary">{sm.no_agenda}</span>
                      <Badge dotColor={statusInfo.dot} className={statusInfo.bg}>
                        {statusInfo.label}
                      </Badge>
                      <span className="text-[11px] text-slate-500 font-semibold">
                        Sub Bid. {sm.bidang_tujuan}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-800 truncate mt-1">
                      {sm.perihal}
                    </p>
                    <p className="text-[11px] text-slate-500">Dari: {sm.opd_asal}</p>
                  </div>

                  <Link to={`/surat-masuk/${sm.id}`}>
                    <Button variant="outline" size="sm">
                      Proses
                    </Button>
                  </Link>
                </div>
              );
            })}

            {priorityKeluar.map((sk) => {
              const statusInfo = getStatusInfo(sk.status);
              return (
                <div key={sk.id} className="p-3 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-secondary">{sk.no_agenda}</span>
                      <Badge dotColor={statusInfo.dot} className={statusInfo.bg}>
                        {statusInfo.label}
                      </Badge>
                      <span className="text-[11px] text-slate-500 uppercase font-semibold">
                        {sk.jenis_dokumen}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-800 truncate mt-1">
                      {sk.perihal}
                    </p>
                    <p className="text-[11px] text-slate-500">Tujuan: {sk.opd_tujuan}</p>
                  </div>

                  <Link to={`/surat-keluar/${sk.id}`}>
                    <Button variant="outline" size="sm">
                      Proses
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Analytics Charts (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Bar Chart 7 Days */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Aktivitas Surat 7 Hari Terakhir</h2>
              <p className="text-xs text-slate-500">Tren volume surat masuk vs surat keluar</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-sm bg-[#1A3A5C]" />
                Surat Masuk
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-sm bg-[#F5A623]" />
                Surat Keluar
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: '#CBD5E1',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="masuk" name="Surat Masuk" fill={COLOR_MASUK} radius={[4, 4, 0, 0]} />
                <Bar dataKey="keluar" name="Surat Keluar" fill={COLOR_KELUAR} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Distribution Pie Chart */}
        <Card className="p-5">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900">Distribusi Bidang Surat Masuk</h2>
            <p className="text-xs text-slate-500">Alokasi tujuan sub bidang</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bidangData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {bidangData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {bidangData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }} />
                  {item.name}
                </span>
                <span className="font-bold text-slate-900">{item.value} Berkas</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/surat-masuk">
          <Card hoverEffect className="p-4 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Inbox className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Agenda Surat Masuk</p>
                <p className="text-xs text-slate-500">Lihat seluruh riwayat berkas, status, dan lembar disposisi</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
          </Card>
        </Link>

        {user?.role !== 'staff' && (
          <Link to="/surat-keluar">
            <Card hoverEffect className="p-4 flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white transition-colors">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Agenda Surat Keluar</p>
                  <p className="text-xs text-slate-500">Monitoring pengajuan, persetujuan Kabid, dan arsip dokumen</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-secondary transition-colors" />
            </Card>
          </Link>
        )}
      </div>
    </div>
  );
}
