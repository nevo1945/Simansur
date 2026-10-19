import { create } from 'zustand';
import api from '../api/client';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('simansur_user') || 'null'),
  token: localStorage.getItem('simansur_token') || null,
  isLoading: false,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/login', { username, password });
      if (res.success && res.data) {
        const { token, user } = res.data;
        localStorage.setItem('simansur_token', token);
        localStorage.setItem('simansur_user', JSON.stringify(user));
        set({ user, token, isLoading: false, error: null });
        return { success: true };
      }
      set({ isLoading: false, error: res.message || 'Login gagal' });
      return { success: false, message: res.message };
    } catch (err) {
      const msg = err.message || (err.errors ? Object.values(err.errors)[0][0] : 'Kombinasi nama pengguna atau kata sandi salah.');
      set({ isLoading: false, error: msg });
      return { success: false, message: msg };
    }
  },

  logout: async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('simansur_token');
      localStorage.removeItem('simansur_user');
      set({ user: null, token: null });
      window.location.href = '/login';
    }
  },

  checkSession: async () => {
    const token = localStorage.getItem('simansur_token');
    if (!token) {
      set({ user: null, token: null });
      return false;
    }
    try {
      const res = await api.get('/me');
      if (res.success && res.data.user) {
        localStorage.setItem('simansur_user', JSON.stringify(res.data.user));
        set({ user: res.data.user });
        return true;
      }
    } catch (e) {
      localStorage.removeItem('simansur_token');
      localStorage.removeItem('simansur_user');
      set({ user: null, token: null });
      return false;
    }
    return false;
  },

  hasRole: (...roles) => {
    const { user } = get();
    if (!user) return false;
    return roles.includes(user.role);
  },
}));
