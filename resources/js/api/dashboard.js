import api from './client';

export const getDashboardData = () => api.get('/dashboard');
