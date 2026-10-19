import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

import MainLayout from '../components/layout/MainLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import SuratMasukList from '../pages/surat-masuk/SuratMasukList';
import SuratMasukDetail from '../pages/surat-masuk/SuratMasukDetail';
import SuratMasukForm from '../pages/surat-masuk/SuratMasukForm';
import SuratKeluarList from '../pages/surat-keluar/SuratKeluarList';
import SuratKeluarDetail from '../pages/surat-keluar/SuratKeluarDetail';
import SuratKeluarForm from '../pages/surat-keluar/SuratKeluarForm';
import ManajemenUser from '../pages/ManajemenUser';
import Laporan from '../pages/Laporan';
import LogAktivitas from '../pages/LogAktivitas';
import Notifikasi from '../pages/Notifikasi';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, token } = useAuthStore();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function AppRoutes() {
  const { token, user } = useAuthStore();

  return (
    <Routes>
      <Route
        path="/login"
        element={token && user ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Surat Masuk */}
        <Route path="surat-masuk" element={<SuratMasukList />} />
        <Route
          path="surat-masuk/buat"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SuratMasukForm />
            </ProtectedRoute>
          }
        />
        <Route path="surat-masuk/:id" element={<SuratMasukDetail />} />

        {/* Surat Keluar (Staff is excluded) */}
        <Route
          path="surat-keluar"
          element={
            <ProtectedRoute allowedRoles={['admin', 'kabid', 'kasubid', 'staff']}>
              <SuratKeluarList />
            </ProtectedRoute>
          }
        />
        <Route
          path="surat-keluar/buat"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SuratKeluarForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="surat-keluar/:id"
          element={
            <ProtectedRoute allowedRoles={['admin', 'kabid', 'kasubid', 'staff']}>
              <SuratKeluarDetail />
            </ProtectedRoute>
          }
        />

        {/* Manajemen User (Admin & Kasubid) */}
        <Route
          path="manajemen-user"
          element={
            <ProtectedRoute allowedRoles={['admin', 'kasubid']}>
              <ManajemenUser />
            </ProtectedRoute>
          }
        />

        {/* Laporan (Admin, Kabid, Kasubid) */}
        <Route
          path="laporan"
          element={
            <ProtectedRoute allowedRoles={['admin', 'kabid', 'kasubid']}>
              <Laporan />
            </ProtectedRoute>
          }
        />

        {/* Log Aktivitas (Admin only) */}
        <Route
          path="log-aktivitas"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <LogAktivitas />
            </ProtectedRoute>
          }
        />

        {/* Notifikasi */}
        <Route path="notifikasi" element={<Notifikasi />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
