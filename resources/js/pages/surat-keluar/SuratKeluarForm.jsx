import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { createSuratKeluar } from '../../api/suratKeluar';
import Breadcrumb from '../../components/layout/Breadcrumb';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Input, Textarea, Select } from '../../components/ui/Input';
import FileUploadZone from '../../components/surat/FileUploadZone';

const formSchema = z.object({
  no_surat: z.string().min(1, 'Nomor surat keluar wajib diisi'),
  tanggal_surat: z.string().min(1, 'Tanggal surat wajib diisi'),
  opd_tujuan: z.string().min(1, 'Instansi / OPD tujuan wajib diisi'),
  perihal: z.string().min(3, 'Perihal minimal 3 karakter'),
  sifat: z.enum(['biasa', 'penting', 'segera', 'rahasia']),
  jenis_dokumen: z.enum(['surat', 'berita_acara', 'bast']),
  keterangan: z.string().optional(),
});

export default function SuratKeluarForm() {
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
      opd_tujuan: '',
      perihal: '',
      sifat: 'biasa',
      jenis_dokumen: 'surat',
      keterangan: '',
    },
  });

  const onSubmit = async (data) => {
    if (!selectedFile) {
      setFileError('File scan dokumen lengkap (surat/BA/BAST) wajib diunggah.');
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

      const res = await createSuratKeluar(formData);
      if (res.success && res.data) {
        navigate(`/surat-keluar/${res.data.id}`);
      }
    } catch (err) {
      const msg = err.message || (err.errors ? Object.values(err.errors)[0][0] : 'Gagal menyimpan surat keluar.');
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <Breadcrumb
        items={[
          { label: 'Surat Keluar', href: '/surat-keluar' },
          { label: 'Input Surat Keluar Baru' },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Input Surat Keluar</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftarkan berkas surat keluar dinas, Berita Acara, atau BAST Aset Daerah
          </p>
        </div>

        <Link to="/surat-keluar">
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
        <Card className="p-5 space-y-3 border-secondary/20">
          <div className="border-b border-slate-100 pb-2.5">
            <h2 className="text-sm font-bold text-slate-900">1. Unggah Berkas Scan Dokumen Keluar</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Satu berkas memuat dokumen surat fisik resmi, lampiran, dan Berita Acara / BAST jika ada.
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

        <Card className="p-5 space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <h2 className="text-sm font-bold text-slate-900">2. Metadata Surat Keluar</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Field kunci untuk pencarian, pelaporan agenda, dan alur verifikasi admin ke Kabid.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nomor Surat Keluar"
              placeholder="Contoh: 028/BPKAD-ASET/2026/045"
              required
              error={errors.no_surat?.message}
              {...register('no_surat')}
            />

            <Input
              label="OPD / Instansi Tujuan"
              placeholder="Contoh: Badan Pendapatan Daerah Kota Pekanbaru"
              required
              error={errors.opd_tujuan?.message}
              {...register('opd_tujuan')}
            />

            <Input
              label="Tanggal Surat"
              type="date"
              required
              error={errors.tanggal_surat?.message}
              {...register('tanggal_surat')}
            />

            <Select
              label="Jenis Dokumen"
              required
              error={errors.jenis_dokumen?.message}
              {...register('jenis_dokumen')}
            >
              <option value="surat">Surat Dinas Biasa</option>
              <option value="berita_acara">Berita Acara (BA)</option>
              <option value="bast">BAST (Berita Acara Serah Terima)</option>
            </Select>

            <Select
              label="Sifat Dokumen"
              required
              error={errors.sifat?.message}
              {...register('sifat')}
            >
              <option value="biasa">Biasa</option>
              <option value="penting">Penting</option>
              <option value="segera">Segera</option>
              <option value="rahasia">Rahasia</option>
            </Select>

            <div className="md:col-span-2">
              <Textarea
                label="Perihal Surat Keluar"
                placeholder="Tuliskan perihal surat keluar..."
                rows={2}
                required
                error={errors.perihal?.message}
                {...register('perihal')}
              />
            </div>

            <div className="md:col-span-2">
              <Textarea
                label="Keterangan Tambahan (Opsional)"
                placeholder="Catatan tujuan atau informasi pendukung..."
                rows={2}
                error={errors.keterangan?.message}
                {...register('keterangan')}
              />
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link to="/surat-keluar">
            <Button variant="outline" size="md">
              Batal
            </Button>
          </Link>
          <Button
            type="submit"
            variant="secondary"
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
