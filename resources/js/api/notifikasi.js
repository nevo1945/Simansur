import api from './client';

export const getNotifikasiList = () => api.get('/notifikasi');

export const markNotifikasiRead = (id) => api.post(`/notifikasi/${id}/read`);

export const markAllNotifikasiRead = () => api.post('/notifikasi/read-all');
