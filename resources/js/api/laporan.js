import api from './client';

export const getRekapitulasi = (params) => api.get('/laporan/rekapitulasi', { params });

export const getExportPdfUrl = (type, params = {}) => {
  const token = localStorage.getItem('simansur_token') || '';
  const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== ''));
  const query = new URLSearchParams({ ...cleanParams, token }).toString();
  return `/api/laporan/${type}/pdf?${query}`;
};

export const getExportExcelUrl = (type, params = {}) => {
  const token = localStorage.getItem('simansur_token') || '';
  const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== ''));
  const query = new URLSearchParams({ ...cleanParams, token }).toString();
  return `/api/laporan/${type}/excel?${query}`;
};

export const getExportCsvUrl = (type, params = {}) => {
  return getExportExcelUrl(type, params);
};

export const getCetakDisposisiUrl = (suratId) => {
  const token = localStorage.getItem('simansur_token') || '';
  return `/api/surat-masuk/${suratId}/cetak-disposisi?token=${token}`;
};

/**
 * Helper untuk download file Blob (Excel/PDF) dengan auth token otomatis
 */
export const downloadFileBlob = async (endpointUrl, defaultFilename) => {
  const response = await api.get(endpointUrl, {
    responseType: 'blob',
  });

  const blob = new Blob([response]);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', defaultFilename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
