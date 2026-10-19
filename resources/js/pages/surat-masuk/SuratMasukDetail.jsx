import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileText,
  Printer,
  ArrowLeft,
  Send,
  CheckCircle2,
  AlertCircle,
  Archive,
  CornerDownLeft,
  Clock,
  UserCheck,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import {
  getSuratMasukDetail,
  teruskanKeStaff,
  perluKoreksi,
  perbaikiBidang,
  laporStaff,
  verifikasiKasubid,
  approveKabid,
  arsipkanSuratMasuk,
} from '../../api/suratMasuk';
import { getStaffByBidang } from '../../api/users';
import { getCetakDisposisiUrl } from '../../api/laporan';
import Breadcrumb from '../../components/layout/Breadcrumb';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { Input, Textarea, Select } from '../../components/ui/Input';
import PdfViewer from '../../components/surat/PdfViewer';
import TimelineDisposisi from '../../components/surat/TimelineDisposisi';
import { getStatusInfo, getSifatBadge, formatDateIndo, formatDateTimeIndo, getBidangShortLabel } from '../../utils/formatters';

export default function SuratMasukDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Modals state
  const [isTeruskanModalOpen, setIsTeruskanModalOpen] = useState(false);
  const [isKoreksiModalOpen, setIsKoreksiModalOpen] = useState(false);
  const [isPerbaikiModalOpen, setIsPerbaikiModalOpen] = useState(false);
  const [isLaporModalOpen, setIsLaporModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  // Form inputs for modals
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [modalCatatan, setModalCatatan] = useState('');
  const [modalBidang, setModalBidang] = useState('');
  const [buktiFile, setBuktiFile] = useState(null);

  // Fetch surat detail
  const { data, isLoading } = useQuery({
    queryKey: ['surat-masuk-detail', id],
    queryFn: () => getSuratMasukDetail(id),
  });

  const surat = data?.data;

  // Fetch staff list for Kasubid modal
  const { data: staffData } = useQuery({
    queryKey: ['staff-by-bidang', surat?.bidang_tujuan],
    queryFn: () => getStaffByBidang(surat?.bidang_tujuan),
    enabled: Boolean(user?.role === 'kasubid' && surat?.bidang_tujuan),
  });

  const staffList = staffData?.data || [];

  // Mutations
  const invalidateAll = () => {
    queryClient.invalidateQueries(['surat-masuk-detail', id]);
    queryClient.invalidateQueries(['surat-masuk-list']);
    queryClient.invalidateQueries(['dashboard-data']);
  };

  const teruskanMutation = useMutation({
    mutationFn: (payload) => teruskanKeStaff(id, payload),
    onSuccess: () => {
      invalidateAll();
      setIsTeruskanModalOpen(false);
      setModalCatatan('');
      setSelectedStaffId('');
    },
  });

  const koreksiMutation = useMutation({
    mutationFn: (payload) => perluKoreksi(id, payload),
    onSuccess: () => {
      invalidateAll();
      setIsKoreksiModalOpen(false);
      setModalCatatan('');
    },
  });

  const perbaikiMutation = useMutation({
    mutationFn: (payload) => perbaikiBidang(id, payload),
    onSuccess: () => {
      invalidateAll();
      setIsPerbaikiModalOpen(false);
      setModalCatatan('');
    },
  });

  const laporMutation = useMutation({
    mutationFn: (formData) => laporStaff(id, formData),
    onSuccess: () => {
      invalidateAll();
      setIsLaporModalOpen(false);
      setModalCatatan('');
      setBuktiFile(null);
    },
  });

  const verifikasiMutation = useMutation({
    mutationFn: () => verifikasiKasubid(id, { catatan: 'Laporan telah diverifikasi lengkap oleh Kasubid.' }),
    onSuccess: () => invalidateAll(),
  });

  const approveMutation = useMutation({
    mutationFn: (payload) => approveKabid(id, payload),
    onSuccess: () => {
      invalidateAll();
      setIsApproveModalOpen(false);
      setModalCatatan('');
    },
  });

  const arsipMutation = useMutation({
    mutationFn: () => arsipkanSuratMasuk(id),
    onSuccess: () => invalidateAll(),
  });

  if (isLoading || !surat) {
    return <div className="p-12 text-center text-xs text-slate-500">Memuat detail surat masuk...</div>;
  }

  const statusInfo = getStatusInfo(surat.status);
  const sifatInfo = getSifatBadge(surat.sifat);

  // Determine allowed actions
  const isKabidCanApprove = user?.role === 'kabid' && (surat.status === 'baru' || surat.status === 'perlu_koreksi');
  const isKasubidCanTeruskan = user?.role === 'kasubid' && surat.status === 'diteruskan_kasubid' && user?.bidang === surat.bidang_tujuan;
  const isKasubidCanKoreksi = user?.role === 'kasubid' && surat.status === 'diteruskan_kasubid' && user?.bidang === surat.bidang_tujuan;
  const isKasubidCanVerifikasi = user?.role === 'kasubid' && surat.status === 'selesai_staff' && user?.bidang === surat.bidang_tujuan;
  const isStaffCanLapor = user?.role === 'staff' && surat.status === 'diteruskan_staff' && user?.bidang === surat.bidang_tujuan;
  const isAdminCanArsipkan = user?.role === 'admin' && (surat.status === 'terverifikasi_kasubid' || surat.status === 'disetujui_kabid');
  const isAdminCanPerbaiki = user?.role === 'admin' && surat.status === 'perlu_koreksi';

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: 'Surat Masuk', href: '/surat-masuk' },
          { label: surat.no_agenda },
        ]}
      />

      {/* Top Header Card */}
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
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {getBidangShortLabel(surat.bidang_tujuan)}
            </span>
          </div>
          <p className="text-xs text-slate-500">{statusInfo.desc}</p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={getCetakDisposisiUrl(surat.id)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" icon={Printer}>
              Cetak Disposisi
            </Button>
          </a>

          <Link to="/surat-masuk">
            <Button variant="ghost" size="sm" icon={ArrowLeft}>
              Kembali
            </Button>
          </Link>
        </div>
      </Card>

      {/* Main Two-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Metadata, Disposisi Ringkasan, Action Box, Timeline */}
        <div className="lg:col-span-6 space-y-5">
          {/* Action Box based on Role & Current State */}
          {(isKabidCanApprove ||
            isKasubidCanTeruskan ||
            isKasubidCanVerifikasi ||
            isStaffCanLapor ||
            isAdminCanArsipkan ||
            isAdminCanPerbaiki) && (
            <Card className="p-4 border-2 border-primary/30 bg-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                  Tindakan Wewenang Anda ({user?.role?.toUpperCase()})
                </h3>
              </div>

              {/* Kabid Approval & Disposisi Awal */}
              {isKabidCanApprove && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-700">
                    Surat masuk memerlukan <b>Persetujuan (Approval)</b> dan arahan disposisi dari Kepala Bidang untuk diteruskan ke Kasubid terkait (Sub Bidang IPA atau P3A).
                  </p>
                  <Button
                    variant="accent"
                    size="sm"
                    icon={CheckCircle2}
                    onClick={() => {
                      setModalBidang(surat.bidang_tujuan || 'ipa');
                      setIsApproveModalOpen(true);
                    }}
                  >
                    Setujui & Disposisikan ke Kasubid
                  </Button>
                </div>
              )}

              {/* Kasubid Actions */}
              {isKasubidCanTeruskan && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-700">
                    Kepala Bidang telah menyetujui & mendisposisikan surat ke Sub Bidang Anda. Silakan teruskan ke Staf teknis pelaksana atau kembalikan jika memerlukan koreksi.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Send}
                      onClick={() => setIsTeruskanModalOpen(true)}
                    >
                      Teruskan ke Staf
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon={CornerDownLeft}
                      onClick={() => setIsKoreksiModalOpen(true)}
                    >
                      Kembalikan ke Kabid
                    </Button>
                  </div>
                </div>
              )}

              {/* Staff Action */}
              {isStaffCanLapor && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-700">
                    Surat telah ditugaskan kepada Anda oleh Kasubid. Silakan laksanakan tindak lanjut teknis di lapangan dan laporkan hasilnya.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={CheckCircle2}
                    onClick={() => setIsLaporModalOpen(true)}
                  >
                    Laporkan Hasil & Unggah Bukti
                  </Button>
                </div>
              )}

              {/* Kasubid Verifikasi */}
              {isKasubidCanVerifikasi && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-700">
                    Staf telah selesai melaporkan tindak lanjut. Silakan verifikasi laporan ini agar surat siap diarsipkan oleh Admin.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={UserCheck}
                    isLoading={verifikasiMutation.isPending}
                    onClick={() => verifikasiMutation.mutate()}
                  >
                    Verifikasi Laporan Staf
                  </Button>
                </div>
              )}

              {/* Admin Arsipkan */}
              {isAdminCanArsipkan && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-700">
                    Tindak lanjut surat telah selesai dan terverifikasi Kasubid. Anda sekarang dapat menyelesaikan proses dan mengarsipkan berkas.
                  </p>
                  <Button
                    variant="success"
                    size="sm"
                    icon={Archive}
                    isLoading={arsipMutation.isPending}
                    onClick={() => arsipMutation.mutate()}
                  >
                    Arsipkan Berkas Surat
                  </Button>
                </div>
              )}

              {/* Admin Perbaiki Bidang */}
              {isAdminCanPerbaiki && (
                <div className="space-y-2">
                  <p className="text-xs text-rose-700 font-medium">
                    Surat ditandai perlu koreksi. Anda dapat memperbaiki bidang tujuan atau menunggu Kabid mendisposisikan ulang.
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Send}
                    onClick={() => {
                      setModalBidang(surat.bidang_tujuan === 'ipa' ? 'p3a' : 'ipa');
                      setIsPerbaikiModalOpen(true);
                    }}
                  >
                    Perbaiki Bidang & Teruskan
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* Key Fields Card */}
          <Card className="p-5">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Informasi Kunci Dokumen
            </h2>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400">Nomor Surat Asal</span>
                <p className="font-bold text-slate-900 mt-0.5">{surat.no_surat}</p>
              </div>

              <div>
                <span className="text-slate-400">Pengirim (OPD)</span>
                <p className="font-bold text-slate-900 mt-0.5">{surat.opd_asal}</p>
              </div>

              <div>
                <span className="text-slate-400">Tanggal Surat</span>
                <p className="font-semibold text-slate-800 mt-0.5">{formatDateIndo(surat.tanggal_surat)}</p>
              </div>

              <div>
                <span className="text-slate-400">Tanggal Terima Sistem</span>
                <p className="font-semibold text-slate-800 mt-0.5">{formatDateIndo(surat.tanggal_terima)}</p>
              </div>

              <div className="col-span-2">
                <span className="text-slate-400">Perihal Surat</span>
                <p className="font-semibold text-slate-900 mt-0.5 leading-relaxed">{surat.perihal}</p>
              </div>
            </div>
          </Card>

          {/* Ringkasan Disposisi Eksternal Card */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Ringkasan Instruksi Disposisi Fisik
              </h2>
              <span className="text-[11px] text-slate-400">Disposisi Luar Sistem</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed">
              {surat.isi_disposisi ? (
                surat.isi_disposisi
              ) : (
                <span className="text-slate-400 italic">
                  Tidak ada catatan ringkasan khusus. Petunjuk teknis mengacu langsung pada lembar scan disposisi di panel kanan.
                </span>
              )}
            </div>
          </Card>

          {/* Animated Timeline Disposisi Card */}
          <Card className="p-5">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              Jejak Alur & Riwayat Tindak Lanjut
            </h2>
            <TimelineDisposisi timeline={surat.tindak_lanjut} />
          </Card>
        </div>

        {/* Right Column: PDF Scan Viewer (Single Source of Truth) */}
        <div className="lg:col-span-6 sticky top-20">
          <div className="space-y-2 mb-2 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Berkas Scan Lengkap
              </h3>
              <p className="text-[11px] text-slate-400">
                Sumber kebenaran dokumen (Surat + Lembar Disposisi + BAST/BA)
              </p>
            </div>
          </div>

          <PdfViewer filePath={surat.file_scan} title={`Scan Berkas - ${surat.no_agenda}`} />
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. Modal Teruskan ke Staff (Kasubid) */}
      <Modal
        isOpen={isTeruskanModalOpen}
        onClose={() => setIsTeruskanModalOpen(false)}
        title="Teruskan Surat ke Staf Teknis"
        subtitle={`Surat No. ${surat.no_agenda} (Sub Bid. ${surat.bidang_tujuan})`}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsTeruskanModalOpen(false)}>
              Batal
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!selectedStaffId || !modalCatatan.trim()}
              isLoading={teruskanMutation.isPending}
              onClick={() =>
                teruskanMutation.mutate({
                  staff_id: selectedStaffId,
                  catatan: modalCatatan,
                })
              }
            >
              Teruskan Sekarang
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Pilih Staf Pelaksana"
            required
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
          >
            <option value="">-- Pilih Staf di Sub Bidang Ini --</option>
            {staffList.map((st) => (
              <option key={st.id} value={st.id}>
                {st.nama_lengkap} (NIP: {st.nip})
              </option>
            ))}
          </Select>

          <Textarea
            label="Instruksi / Catatan Tindak Lanjut"
            required
            rows={4}
            value={modalCatatan}
            onChange={(e) => setModalCatatan(e.target.value)}
            placeholder="Instruksikan hal teknis yang harus dikerjakan staf (misal: cek ke lapangan, rekonsiliasi KIB, dll)..."
          />
        </div>
      </Modal>

      {/* 2. Modal Koreksi Bidang (Kasubid) */}
      <Modal
        isOpen={isKoreksiModalOpen}
        onClose={() => setIsKoreksiModalOpen(false)}
        title="Kembalikan Surat ke Kepala Bidang"
        subtitle="Minta penyesuaian disposisi atau sub bidang jika salah alamat"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsKoreksiModalOpen(false)}>
              Batal
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={!modalCatatan.trim()}
              isLoading={koreksiMutation.isPending}
              onClick={() => koreksiMutation.mutate({ catatan: modalCatatan })}
            >
              Kembalikan ke Kabid
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-600">
            Surat ini akan dikembalikan ke Kepala Bidang dengan status <b>Perlu Koreksi</b> agar bidang tujuan atau arahan disposisi dapat disesuaikan.
          </p>
          <Textarea
            label="Alasan Pengembalian / Catatan Koreksi"
            required
            rows={4}
            value={modalCatatan}
            onChange={(e) => setModalCatatan(e.target.value)}
            placeholder="Contoh: Berkas ini terkait inventarisasi aset, mohon dialihkan ke Sub Bidang IPA..."
          />
        </div>
      </Modal>

      {/* 3. Modal Admin Perbaiki Bidang */}
      <Modal
        isOpen={isPerbaikiModalOpen}
        onClose={() => setIsPerbaikiModalOpen(false)}
        title="Perbaiki Bidang Tujuan Surat"
        subtitle={`Surat No. ${surat.no_agenda}`}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsPerbaikiModalOpen(false)}>
              Batal
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={perbaikiMutation.isPending}
              onClick={() =>
                perbaikiMutation.mutate({
                  bidang_tujuan: modalBidang,
                  catatan: modalCatatan || 'Telah dikoreksi oleh Admin',
                })
              }
            >
              Simpan & Teruskan Ulang
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Bidang Tujuan yang Benar"
            required
            value={modalBidang}
            onChange={(e) => setModalBidang(e.target.value)}
          >
            <option value="ipa">Sub Bidang IPA (Inventarisasi &amp; Penghapusan Aset)</option>
            <option value="p3a">Sub Bidang P3A (Pemanfaatan, Penggunaan &amp; Pengamanan Aset)</option>
          </Select>

          <Textarea
            label="Catatan Perbaikan Admin"
            rows={3}
            value={modalCatatan}
            onChange={(e) => setModalCatatan(e.target.value)}
            placeholder="Catatan pengalihan bidang..."
          />
        </div>
      </Modal>

      {/* 4. Modal Lapor Hasil Staff */}
      <Modal
        isOpen={isLaporModalOpen}
        onClose={() => setIsLaporModalOpen(false)}
        title="Laporkan Hasil Tindak Lanjut"
        subtitle={`Pelaksanaan tugas surat no. ${surat.no_agenda}`}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsLaporModalOpen(false)}>
              Batal
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!modalCatatan.trim()}
              isLoading={laporMutation.isPending}
              onClick={() => {
                const formData = new FormData();
                formData.append('catatan', modalCatatan);
                if (buktiFile) formData.append('file_bukti', buktiFile);
                laporMutation.mutate(formData);
              }}
            >
              Kirim Laporan ke Kasubid
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Textarea
            label="Uraian Hasil Tindak Lanjut"
            required
            rows={5}
            value={modalCatatan}
            onChange={(e) => setModalCatatan(e.target.value)}
            placeholder="Jelaskan secara rinci hasil pemeriksaan fisik, pencatatan KIB, atau koordinasi yang telah dilaksanakan..."
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-1.5">
              Unggah Berkas Bukti / Foto Fisik (Opsional)
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setBuktiFile(e.target.files[0])}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-btn file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            <p className="text-[11px] text-slate-400 mt-1">Maksimal 10 MB (PDF, JPG, PNG)</p>
          </div>
        </div>
      </Modal>

      {/* 5. Modal Approval & Disposisi Kabid */}
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title="Persetujuan & Disposisi Kepala Bidang"
        subtitle={`Surat Masuk No. ${surat.no_agenda} (${surat.opd_asal})`}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsApproveModalOpen(false)}>
              Batal
            </Button>
            <Button
              variant="accent"
              size="sm"
              isLoading={approveMutation.isPending}
              onClick={() =>
                approveMutation.mutate({
                  bidang_tujuan: modalBidang || surat.bidang_tujuan || 'ipa',
                  catatan: modalCatatan || 'Disetujui dan diteruskan untuk ditindaklanjuti sesuai ketentuan.',
                })
              }
            >
              Setujui & Teruskan ke Kasubid
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-700">
            Sesuai isi surat, silakan tetapkan Sub Bidang tujuan Kasubid (IPA atau P3A) dan berikan arahan disposisi resmi Anda.
          </p>

          <Select
            label="Sub Bidang Tujuan (Kasubid)"
            required
            value={modalBidang || surat.bidang_tujuan || 'ipa'}
            onChange={(e) => setModalBidang(e.target.value)}
          >
            <option value="ipa">Sub Bidang IPA (Inventarisasi &amp; Penghapusan Aset)</option>
            <option value="p3a">Sub Bidang P3A (Pemanfaatan, Penggunaan &amp; Pengamanan Aset)</option>
          </Select>

          <Textarea
            label="Catatan & Arahan Disposisi Kabid"
            rows={3}
            value={modalCatatan}
            onChange={(e) => setModalCatatan(e.target.value)}
            placeholder="Tuliskan petunjuk atau arahan tindak lanjut untuk Kasubid..."
          />
        </div>
      </Modal>
    </div>
  );
}
