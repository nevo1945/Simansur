import api from './client';

export const getLogAktivitasList = (params) => api.get('/log-aktivitas', { params });
