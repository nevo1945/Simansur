import api from './client';

export const getRekapitulasi = (params) => api.get('/laporan/rekapitulasi', { params });

export const getExportPdfUrl = (type, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return `/api/laporan/${type}/pdf?${query}`;
};

export const getExportCsvUrl = (type, params = {}) => {
  const query = new URLSearchParams(params).toString();
  return `/api/laporan/${type}/csv?${query}`;
};

export const getCetakDisposisiUrl = (suratId) => {
  return `/api/surat-masuk/${suratId}/cetak-disposisi`;
};
