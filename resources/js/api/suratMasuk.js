import api from './client';

export const getSuratMasukList = (params) => api.get('/surat-masuk', { params });

export const getSuratMasukDetail = (id) => api.get(`/surat-masuk/${id}`);

export const createSuratMasuk = (formData) => {
  return api.post('/surat-masuk', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const teruskanKeStaff = (id, data) => api.post(`/surat-masuk/${id}/teruskan-staff`, data);

export const perluKoreksi = (id, data) => api.post(`/surat-masuk/${id}/perlu-koreksi`, data);

export const perbaikiBidang = (id, data) => api.post(`/surat-masuk/${id}/perbaiki-bidang`, data);

export const laporStaff = (id, formData) => {
  return api.post(`/surat-masuk/${id}/lapor-staff`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const verifikasiKasubid = (id, data) => api.post(`/surat-masuk/${id}/verifikasi-kasubid`, data);

export const approveKabid = (id, data) => api.post(`/surat-masuk/${id}/approve-kabid`, data);

export const arsipkanSuratMasuk = (id) => api.post(`/surat-masuk/${id}/arsipkan`);

export const deleteSuratMasuk = (id) => api.delete(`/surat-masuk/${id}`);
