import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Users,
  UserPlus,
  Search,
  Edit,
  Shield,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getUserList, createUser, updateUser, toggleActiveUser } from '../api/users';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Input';
import Breadcrumb from '../components/layout/Breadcrumb';
import { getRoleBadge, getBidangShortLabel } from '../utils/formatters';

const userSchema = z.object({
  username: z.string().min(4, 'Username minimal 4 karakter'),
  password: z.string().min(8, 'Password minimal 8 karakter').optional().or(z.literal('')),
  nama_lengkap: z.string().min(2, 'Nama lengkap wajib diisi'),
  nip: z.string().min(5, 'NIP wajib diisi'),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  role: z.enum(['admin', 'kabid', 'kasubid', 'staff']),
  bidang: z.enum(['ipa', 'p3a', '']).optional(),
});

export default function ManajemenUser() {
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formError, setFormError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['user-list', search, roleFilter],
    queryFn: () =>
      getUserList({
        search: search || undefined,
        role: roleFilter || undefined,
      }),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: '',
      password: '',
      nama_lengkap: '',
      nip: '',
      email: '',
      role: currentUser?.role === 'kasubid' ? 'staff' : 'staff',
      bidang: currentUser?.bidang || '',
    },
  });

  const selectedRole = watch('role');

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['user-list']);
      setIsModalOpen(false);
      reset();
    },
    onError: (err) => {
      setFormError(err.message || 'Gagal menyimpan data pengguna.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['user-list']);
      setIsModalOpen(false);
      setEditingUser(null);
      reset();
    },
    onError: (err) => {
      setFormError(err.message || 'Gagal memperbarui data pengguna.');
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleActiveUser,
    onSuccess: () => queryClient.invalidateQueries(['user-list']),
  });

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormError('');
    reset({
      username: '',
      password: '',
      nama_lengkap: '',
      nip: '',
      email: '',
      role: currentUser?.role === 'kasubid' ? 'staff' : 'staff',
      bidang: currentUser?.bidang || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (targetUser) => {
    setEditingUser(targetUser);
    setFormError('');
    reset({
      username: targetUser.username,
      password: '',
      nama_lengkap: targetUser.nama_lengkap,
      nip: targetUser.nip,
      email: targetUser.email || '',
      role: targetUser.role,
      bidang: targetUser.bidang || '',
    });
    setIsModalOpen(true);
  };

  const onSubmit = (formData) => {
    setFormError('');
    if (editingUser) {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;
      updateMutation.mutate({ id: editingUser.id, data: payload });
    } else {
      if (!formData.password) {
        setFormError('Kata sandi wajib diisi untuk pengguna baru.');
        return;
      }
      createMutation.mutate(formData);
    }
  };

  const usersList = data?.data?.data || [];

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: 'Manajemen Pengguna' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {currentUser?.role === 'kasubid' ? 'Manajemen Staf Sub Bidang' : 'Manajemen Akun Pengguna'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentUser?.role === 'kasubid'
              ? `Kelola dan daftarkan staf teknis untuk Sub Bidang ${currentUser?.bidang}`
              : 'Kelola seluruh akun pegawai internal BPKAD Kota Pekanbaru'}
          </p>
        </div>

        <Button variant="primary" icon={UserPlus} onClick={handleOpenCreate}>
          {currentUser?.role === 'kasubid' ? 'Daftarkan Staf Baru' : 'Tambah Pengguna Baru'}
        </Button>
      </div>

      <Card className="p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama lengkap, NIP, username, atau email..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-input focus:bg-white focus:border-primary focus:outline-none"
          />
        </div>

        {currentUser?.role === 'admin' && (
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-input focus:bg-white focus:border-primary focus:outline-none"
          >
            <option value="">Semua Peran (Role)</option>
            <option value="admin">Admin</option>
            <option value="kabid">Kabid</option>
            <option value="kasubid">Kasubid</option>
            <option value="staff">Staff</option>
          </select>
        )}
      </Card>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500">Memuat data pengguna...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Nama Pegawai & NIP</th>
                  <th className="py-3 px-4">Username & Email</th>
                  <th className="py-3 px-4">Role / Wewenang</th>
                  <th className="py-3 px-4">Sub Bidang</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => {
                  const roleBadge = getRoleBadge(u.role);
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{u.nama_lengkap}</p>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">NIP. {u.nip}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800">{u.username}</p>
                        <p className="text-[11px] text-slate-400">{u.email || '-'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${roleBadge.color}`}>
                          {roleBadge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {u.bidang ? getBidangShortLabel(u.bidang) : '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            u.is_active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {u.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            title="Edit Data Pengguna"
                            className="p-1.5 text-slate-500 hover:text-primary hover:bg-slate-100 rounded transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {currentUser?.role === 'admin' && currentUser?.id !== u.id && (
                            <button
                              onClick={() => toggleMutation.mutate(u.id)}
                              title={u.is_active ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                              className={`p-1.5 rounded transition-colors ${
                                u.is_active
                                  ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                  : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                              }`}
                            >
                              {u.is_active ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
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
      </Card>

      {/* Modal Tambah / Edit User */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
        subtitle="Kelola profil akun dan hak akses SIMANSUR"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={createMutation.isPending || updateMutation.isPending}
              onClick={handleSubmit(onSubmit)}
            >
              Simpan Data
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {formError && (
            <div className="p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <Input
            label="Nama Lengkap & Gelar"
            placeholder="Contoh: Siti Rahmawati, S.Tr.A.P"
            required
            error={errors.nama_lengkap?.message}
            {...register('nama_lengkap')}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="NIP (Nomor Induk Pegawai)"
              placeholder="Contoh: 199201102015031002"
              required
              error={errors.nip?.message}
              {...register('nip')}
            />

            <Input
              label="Nama Pengguna (Username)"
              placeholder="Contoh: staff.inv2"
              required
              error={errors.username?.message}
              {...register('username')}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label={editingUser ? 'Kata Sandi Baru (Kosongkan jika tetap)' : 'Kata Sandi'}
              type="password"
              placeholder="Minimal 8 karakter"
              required={!editingUser}
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Alamat Email Dinas (Opsional)"
              type="email"
              placeholder="nama@bpkad.pekanbaru.go.id"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          {currentUser?.role === 'admin' ? (
            <div className="grid grid-cols-2 gap-3">
              <Select label="Role / Peran" required error={errors.role?.message} {...register('role')}>
                <option value="staff">Staf Teknis</option>
                <option value="kasubid">Kasubid</option>
                <option value="kabid">Kepala Bidang (Kabid)</option>
                <option value="admin">Administrator</option>
              </Select>

              {['kasubid', 'staff'].includes(selectedRole) && (
                <Select label="Sub Bidang" required error={errors.bidang?.message} {...register('bidang')}>
                  <option value="">-- Pilih Sub Bidang --</option>
                  <option value="ipa">IPA – Inventarisasi &amp; Penghapusan Aset</option>
                  <option value="p3a">P3A – Pemanfaatan, Penggunaan &amp; Pengamanan Aset</option>
                </Select>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs">
              <p className="font-semibold text-slate-700">Wewenang Registrasi Kasubid:</p>
              <p className="text-slate-500 mt-0.5">
                Akun akan otomatis didaftarkan sebagai <b>Staf</b> pada Sub Bidang <b>{currentUser?.bidang}</b>.
              </p>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
}
