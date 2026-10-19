import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileText,
  ArrowLeft,
  CheckCircle2,
  CornerDownLeft,
  Archive,
  ShieldCheck,
  Send,
  CheckCheck,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import {
  getSuratKeluarDetail,
  verifikasiAdmin,
  approveKabidKeluar,
  kembalikanKabid,
  arsipkanSuratKeluar,
} from '../../api/suratKeluar';
import Breadcrumb from '../../components/layout/Breadcrumb';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Input';
import PdfViewer from '../../components/surat/PdfViewer';
import TimelineKeluar from '../../components/surat/TimelineKeluar';
import { getStatusInfo, getSifatBadge, formatDateIndo } from '../../utils/formatters';

export default function SuratKeluarDetail() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [isKembalikanModalOpen, setIsKembalikanModalOpen] = useState(false);
  const [modalCatatan, setModalCatatan] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['surat-keluar-detail', id],
    queryFn: () => getSuratKeluarDetail(id),
  });

  const surat = data?.data;

  const invalidateAll = () => {
    queryClient.invalidateQueries(['surat-keluar-detail', id]);
    queryClient.invalidateQueries(['surat-keluar-list']);
    queryClient.invalidateQueries(['dashboard-data']);
  };

  const verifikasiMutation = useMutation({
    mutationFn: () => verifikasiAdmin(id, { catatan: 'Data dan dokumen scan diverifikasi lengkap oleh Admin.' }),
    onSuccess: () => invalidateAll(),
  });

  const approveMutation = useMutation({
    mutationFn: (payload) => approveKabidKeluar(id, payload),
    onSuccess: () => invalidateAll(),
  });

  const kembalikanMutation = useMutation({
    mutationFn: (payload) => kembalikanKabid(id, payload),
    onSuccess: () => {
      invalidateAll();
      setIsKembalikanModalOpen(false);
      setModalCatatan('');
    },
  });

  const arsipMutation = useMutation({
    mutationFn: () => arsipkanSuratKeluar(id),
    onSuccess: () => invalidateAll(),
  });

  if (isLoading || !surat) {
    return <div className="p-12 text-center text-xs text-slate-500">Memuat detail surat keluar...</div>;
  }

  const statusInfo = getStatusInfo(surat.status);
  const sifatInfo = getSifatBadge(surat.sifat);

  const isAdminCanVerifikasi = user?.role === 'admin' && (surat.status === 'diinput' || surat.status === 'dikembalikan');
  const isKabidCanApprove = user?.role === 'kabid' && surat.status === 'diverifikasi_admin';
  const isAdminCanArsipkan = user?.role === 'admin' && surat.status === 'disetujui_kabid';

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: 'Surat Keluar', href: '/surat-keluar' },
          { label: surat.no_agenda },
        ]}
      />

      <Card className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 font-mono">{surat.no_agenda}</h1>
            <Badge dotColor={statusInfo.dot} className={statusInfo.bg}>
              {statusInfo.label}
            </Badge>
            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${sifatInfo.bg}`}>
              Sifat: {sifatInfo.label}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
              Dokumen: {surat.jenis_dokumen?.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-slate-500">{statusInfo.desc}</p>
        </div>

        <Link to="/surat-keluar">
          <Button variant="ghost" size="sm" icon={ArrowLeft}>
            Kembali ke Daftar
          </Button>
        </Link>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Metadata & Action Workflow */}
        <div className="lg:col-span-6 space-y-5">
          {/* Action Box based on role */}
          {(isAdminCanVerifikasi || isKabidCanApprove || isAdminCanArsipkan) && (
            <Card className="p-4 border-2 border-secondary/30 bg-secondary/5">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-secondary" />
                <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">
                  Tindakan Wewenang Anda ({user?.role?.toUpperCase()})
                </h3>
              </div>

              {isAdminCanVerifikasi && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-700">
                    {surat.status === 'dikembalikan'
                      ? 'Dokumen telah diperbaiki sesuai catatan Kabid? Kirim ulang untuk persetujuan arsip.'
                      : 'Verifikasi kelengkapan data & berkas scan sebelum diajukan ke Kepala Bidang.'}
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={CheckCheck}
                    isLoading={verifikasiMutation.isPending}
                    onClick={() => verifikasiMutation.mutate()}
                  >
                    Verifikasi & Kirim ke Kabid
                  </Button>
                </div>
              )}

              {isKabidCanApprove && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-700">
                    Admin telah memverifikasi surat keluar ini. Persetujuan Kepala Bidang <b>WAJIB</b> diberikan sebelum dapat diarsipkan secara resmi.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button
                      variant="accent"
                      size="sm"
                      icon={CheckCircle2}
                      isLoading={approveMutation.isPending}
                      onClick={() => approveMutation.mutate({ catatan: 'Disetujui untuk diarsipkan.' })}
                    >
                      Beri Persetujuan (Approval Arsip)
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={CornerDownLeft}
                      onClick={() => setIsKembalikanModalOpen(true)}
                    >
                      Kembalikan ke Admin
                    </Button>
                  </div>
                </div>
              )}

              {isAdminCanArsipkan && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-700">
                    Kepala Bidang telah menyetujui dokumen ini. Anda sekarang dapat mengarsipkan surat keluar secara permanen.
                  </p>
                  <Button
                    variant="success"
                    size="sm"
                    icon={Archive}
                    isLoading={arsipMutation.isPending}
                    onClick={() => arsipMutation.mutate()}
                  >
                    Arsipkan Dokumen Surat Keluar
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* Key Fields Card */}
          <Card className="p-5">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Informasi Kunci Dokumen Surat Keluar
            </h2>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400">Nomor Surat Dinas</span>
                <p className="font-bold text-slate-900 mt-0.5">{surat.no_surat}</p>
              </div>

              <div>
                <span className="text-slate-400">Instansi / OPD Tujuan</span>
                <p className="font-bold text-slate-900 mt-0.5">{surat.opd_tujuan}</p>
              </div>

              <div>
                <span className="text-slate-400">Tanggal Surat</span>
                <p className="font-semibold text-slate-800 mt-0.5">{formatDateIndo(surat.tanggal_surat)}</p>
              </div>

              <div>
                <span className="text-slate-400">Jenis Dokumen</span>
                <p className="font-semibold text-slate-800 mt-0.5 uppercase">
                  {surat.jenis_dokumen?.replace('_', ' ')}
                </p>
              </div>

              <div className="col-span-2">
                <span className="text-slate-400">Perihal</span>
                <p className="font-semibold text-slate-900 mt-0.5 leading-relaxed">{surat.perihal}</p>
              </div>

              {surat.keterangan && (
                <div className="col-span-2">
                  <span className="text-slate-400">Keterangan Tambahan</span>
                  <p className="font-normal text-slate-700 mt-0.5 bg-slate-50 p-2.5 rounded border border-slate-100">
                    {surat.keterangan}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Timeline Alur Persetujuan */}
          <Card className="p-5">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              Jejak Alur Persetujuan & Arsip
            </h2>
            <TimelineKeluar timeline={surat.tindak_lanjut_keluar} />
          </Card>
        </div>

        {/* Right Column: PDF Scan Viewer */}
        <div className="lg:col-span-6 sticky top-20">
          <div className="mb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Berkas Scan Dokumen Keluar
            </h3>
            <p className="text-[11px] text-slate-400">
              Dokumen scan resmi beserta lembar pengesahan & lampiran fisik
            </p>
          </div>

          <PdfViewer filePath={surat.file_scan} title={`Berkas - ${surat.no_agenda}`} />
        </div>
      </div>

      {/* Modal Kembalikan Kabid */}
      <Modal
        isOpen={isKembalikanModalOpen}
        onClose={() => setIsKembalikanModalOpen(false)}
        title="Kembalikan Surat Keluar ke Admin"
        subtitle={`Surat No. ${surat.no_agenda}`}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsKembalikanModalOpen(false)}>
              Batal
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={!modalCatatan.trim()}
              isLoading={kembalikanMutation.isPending}
              onClick={() => kembalikanMutation.mutate({ catatan: modalCatatan })}
            >
              Kembalikan ke Admin
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-600">
            Jelaskan poin perbaikan atau lampiran yang belum lengkap agar Admin dapat memperbaikinya.
          </p>
          <Textarea
            label="Catatan Koreksi / Arahan Kabid"
            required
            rows={4}
            value={modalCatatan}
            onChange={(e) => setModalCatatan(e.target.value)}
            placeholder="Tuliskan catatan perbaikan (contoh: nomor rangka kendaraan belum lengkap pada lampiran)..."
          />
        </div>
      </Modal>
    </div>
  );
}
