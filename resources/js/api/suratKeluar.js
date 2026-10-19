import api from './client';

export const getSuratKeluarList = (params) => api.get('/surat-keluar', { params });

export const getSuratKeluarDetail = (id) => api.get(`/surat-keluar/${id}`);

export const createSuratKeluar = (formData) => {
  return api.post('/surat-keluar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const verifikasiAdmin = (id, data) => api.post(`/surat-keluar/${id}/verifikasi-admin`, data);

export const approveKabidKeluar = (id, data) => api.post(`/surat-keluar/${id}/approve-kabid`, data);

export const kembalikanKabid = (id, data) => api.post(`/surat-keluar/${id}/kembalikan-kabid`, data);

export const arsipkanSuratKeluar = (id) => api.post(`/surat-keluar/${id}/arsipkan`);

export const deleteSuratKeluar = (id) => api.delete(`/surat-keluar/${id}`);
