import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Save, AlertCircle, FileCheck } from 'lucide-react';
import { createSuratMasuk } from '../../api/suratMasuk';
import Breadcrumb from '../../components/layout/Breadcrumb';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Input, Textarea, Select } from '../../components/ui/Input';
import FileUploadZone from '../../components/surat/FileUploadZone';

const formSchema = z.object({
  no_surat: z.string().min(1, 'Nomor surat asal wajib diisi'),
  tanggal_surat: z.string().min(1, 'Tanggal surat wajib diisi'),
  tanggal_terima: z.string().min(1, 'Tanggal terima berkas wajib diisi'),
  opd_asal: z.string().min(1, 'Instansi / OPD pengirim wajib diisi'),
  perihal: z.string().min(3, 'Perihal surat minimal 3 karakter'),
  sifat: z.enum(['biasa', 'penting', 'segera', 'rahasia']),
  bidang_tujuan: z.enum(['ipa', 'p3a']),
  isi_disposisi: z.string().optional(),
});

export default function SuratMasukForm() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      no_surat: '',
      tanggal_surat: today,
      tanggal_terima: today,
      opd_asal: '',
      perihal: '',
      sifat: 'biasa',
      bidang_tujuan: 'ipa',
      isi_disposisi: '',
    },
  });

  const onSubmit = async (data) => {
    if (!selectedFile) {
      setFileError('File scan berkas lengkap (surat, disposisi, BAST/BA) wajib diunggah.');
      return;
    }
    setFileError('');
    setServerError('');
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      formData.append('file_scan', selectedFile);

      const res = await createSuratMasuk(formData);
      if (res.success && res.data) {
        navigate(`/surat-masuk/${res.data.id}`);
      }
    } catch (err) {
      const msg = err.message || (err.errors ? Object.values(err.errors)[0][0] : 'Gagal menyimpan surat masuk.');
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <Breadcrumb
        items={[
          { label: 'Surat Masuk', href: '/surat-masuk' },
          { label: 'Input Surat Masuk Baru' },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Input Surat Masuk</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Unggah berkas scan lengkap dan catat field penting untuk pencarian & disposisi
          </p>
        </div>

        <Link to="/surat-masuk">
          <Button variant="ghost" size="sm" icon={ArrowLeft}>
            Kembali
          </Button>
        </Link>
      </div>

      {serverError && (
        <div className="p-3.5 rounded-btn bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Scan Dokumen Lengkap */}
        <Card className="p-5 space-y-3 border-primary/20">
          <div className="border-b border-slate-100 pb-2.5">
            <h2 className="text-sm font-bold text-slate-900">1. Unggah Berkas Scan Lengkap (Sumber Kebenaran)</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Satu berkas memuat SEMUA dokumen fisik: surat pengantar, lembar disposisi pimpinan, dan lampiran BAST/Berita Acara.
            </p>
          </div>

          <FileUploadZone
            selectedFile={selectedFile}
            onFileSelect={(file) => {
              setSelectedFile(file);
              if (file) setFileError('');
            }}
            error={fileError}
            maxSizeMB={20}
          />
        </Card>

        {/* Step 2: Metadata Lapangan */}
        <Card className="p-5 space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <h2 className="text-sm font-bold text-slate-900">2. Metadata & Ringkasan Disposisi</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cukup isi field kunci untuk pencarian, filter laporan, dan alur disposisi. Jangan ketik ulang isi dokumen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nomor Surat Asal"
              placeholder="Contoh: 005/DISDIK/2026/089"
              required
              error={errors.no_surat?.message}
              {...register('no_surat')}
            />

            <Input
              label="OPD / Instansi Pengirim"
              placeholder="Contoh: Dinas Pendidikan Kota Pekanbaru"
              required
              error={errors.opd_asal?.message}
              {...register('opd_asal')}
            />

            <Input
              label="Tanggal Surat"
              type="date"
              required
              error={errors.tanggal_surat?.message}
              {...register('tanggal_surat')}
            />

            <Input
              label="Tanggal Terima di BPKAD"
              type="date"
              required
              error={errors.tanggal_terima?.message}
              {...register('tanggal_terima')}
            />

            <Select
              label="Sifat Surat"
              required
              error={errors.sifat?.message}
              {...register('sifat')}
            >
              <option value="biasa">Biasa</option>
              <option value="penting">Penting</option>
              <option value="segera">Segera</option>
              <option value="rahasia">Rahasia</option>
            </Select>

            <Select
              label="Bidang Tujuan Disposisi"
              required
              error={errors.bidang_tujuan?.message}
              {...register('bidang_tujuan')}
            >
              <option value="ipa">Sub Bidang IPA (Inventarisasi &amp; Penghapusan Aset)</option>
              <option value="p3a">Sub Bidang P3A (Pemanfaatan, Penggunaan &amp; Pengamanan Aset)</option>
            </Select>

            <div className="md:col-span-2">
              <Textarea
                label="Perihal Surat"
                placeholder="Tuliskan pokok perihal surat secara ringkas dan jelas..."
                rows={2}
                required
                error={errors.perihal?.message}
                {...register('perihal')}
              />
            </div>

            <div className="md:col-span-2">
              <Textarea
                label="Ringkasan Instruksi Disposisi Fisik"
                placeholder="Kutip ringkasan petunjuk tertulis dari pimpinan (Kepala Badan / Sekretaris) jika ada..."
                rows={3}
                error={errors.isi_disposisi?.message}
                helperText="Disposisi sudah selesai di luar sistem. Yang dicatat hanya scan dan ringkasan."
                {...register('isi_disposisi')}
              />
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link to="/surat-masuk">
            <Button variant="outline" size="md">
              Batal
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Save}
            isLoading={isSubmitting}
          >
            Simpan & Teruskan ke Kabid
          </Button>
        </div>
      </form>
    </div>
  );
}
