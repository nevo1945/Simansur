import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Building2, Lock, User, AlertCircle, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const loginSchema = z.object({
  username: z.string().min(1, 'Nama pengguna (username) wajib diisi'),
  password: z.string().min(1, 'Kata sandi wajib diisi'),
});

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setErrorMessage('');
    const res = await login(data.username, data.password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMessage(res.message || 'Login gagal.');
    }
  };

  const handleQuickLogin = (u, p) => {
    setValue('username', u);
    setValue('password', p);
    onSubmit({ username: u, password: p });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F5F7FA]">
      {/* Left Column: Government Brand Identity & Line Art Illustration */}
      <div className="md:w-1/2 bg-[#1A3A5C] text-white p-8 md:p-14 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative grid */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div>
          {/* Header Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center text-slate-900 shadow-md">
              <Building2 className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wider text-white">SIMANSUR</h1>
              <p className="text-xs text-amber-300 font-medium">Sistem Informasi Manajemen Surat</p>
            </div>
          </div>

          <div className="mt-12 max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#244e7c] border border-blue-400/30 text-amber-300 text-xs font-semibold mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pemerintah Kota Pekanbaru</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Tata Kelola Arsip & Disposisi Aset Daerah yang Akuntabel
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Platform persuratan digital terpadu Badan Pengelola Keuangan dan Aset Daerah (BPKAD) Sub Bidang Aset Kota Pekanbaru.
            </p>
          </div>
        </div>

        {/* Clean Vector SVG Illustration of Government Building & Documents */}
        <div className="my-8 py-6 flex justify-center">
          <svg className="w-64 h-48 text-sky-200/20" viewBox="0 0 240 180" fill="none" stroke="currentColor" strokeWidth="2">
            {/* Government Facade Pillars */}
            <path d="M20 160h200M30 160V60M210 160V60M120 20L20 60h200L120 20z" strokeWidth="2.5" />
            <path d="M60 60v100M90 60v100M120 60v100M150 60v100M180 60v100" strokeDasharray="3 3" />
            {/* Seal Emblem */}
            <circle cx="120" cy="45" r="8" fill="currentColor" fillOpacity="0.4" />
            {/* Base Steps */}
            <path d="M10 170h220M4 178h232" strokeWidth="2" />
          </svg>
        </div>

        {/* Footer Identity */}
        <div className="text-xs text-slate-400 border-t border-[#244e7c] pt-4 flex items-center justify-between">
          <span>Sub Bidang Inventarisasi & Pengamanan BMD</span>
          <span>Versi 1.0</span>
        </div>
      </div>

      {/* Right Column: Clean Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-card shadow-gov border border-slate-200 p-8 sm:p-10">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Masuk ke Sistem</h2>
            <p className="text-xs text-slate-500 mt-1">Masukkan kredensial NIP / Nama Pengguna Anda</p>
          </div>

          {(error || errorMessage) && (
            <div className="mb-5 p-3 rounded-btn bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Nama Pengguna (Username)"
              icon={User}
              placeholder="Contoh: admin / kabid / kasubid.inv"
              required
              error={errors.username?.message}
              {...register('username')}
            />

            <Input
              label="Kata Sandi"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              required
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="pt-2">
              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
                Masuk SIMANSUR
              </Button>
            </div>
          </form>

          {/* Quick Demo Credential Selector for Instant Testing */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-accent" />
              Pilih Akun Cepat Pengujian:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'password123')}
                className="p-2 rounded border border-slate-200 hover:border-primary hover:bg-primary/5 text-left transition-all"
              >
                <p className="font-bold text-primary">1. Admin</p>
                <p className="text-[10px] text-slate-500">Input, kelola user & arsip</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('kabid', 'password123')}
                className="p-2 rounded border border-slate-200 hover:border-accent hover:bg-amber-50 text-left transition-all"
              >
                <p className="font-bold text-slate-900">2. Kabid</p>
                <p className="text-[10px] text-slate-500">Persetujuan (Approval Wajib)</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('kasubid.inv', 'password123')}
                className="p-2 rounded border border-slate-200 hover:border-secondary hover:bg-secondary/5 text-left transition-all"
              >
                <p className="font-bold text-secondary">3. Kasubid Inv.</p>
                <p className="text-[10px] text-slate-500">Disposisi & verifikasi staf</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('staff.inv', 'password123')}
                className="p-2 rounded border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-left transition-all"
              >
                <p className="font-bold text-slate-800">4. Staf Inv.</p>
                <p className="text-[10px] text-slate-500">Lapor hasil & bukti fisik</p>
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-3">
              Password default semua akun: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">password123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
