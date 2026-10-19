import api from './client';

export const getUserList = (params) => api.get('/users', { params });

export const createUser = (data) => api.post('/users', data);

export const updateUser = (id, data) => api.put(`/users/${id}`, data);

export const toggleActiveUser = (id) => api.patch(`/users/${id}/toggle-active`);

export const getStaffByBidang = (bidang) => api.get(`/users/staff-by-bidang/${bidang}`);
