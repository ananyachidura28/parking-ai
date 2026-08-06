import { create } from 'zustand';
import API from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('parksmart_user')) || {
    id: 'demo-user-id',
    email: 'user@parksmart.ai',
    fullName: 'Sarah Jenkins',
    role: 'CUSTOMER',
    loyaltyPoints: 340,
    walletBalance: 850.0,
    membershipTier: 'Gold',
  },
  token: localStorage.getItem('parksmart_token') || 'demo_token_jwt',
  isAuthenticated: true,
  isLoading: false,

  setRole: (newRole) => set((state) => {
    const updatedUser = { ...state.user, role: newRole };
    localStorage.setItem('parksmart_user', JSON.stringify(updatedUser));
    return { user: updatedUser };
  }),

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('parksmart_token', res.data.token);
        localStorage.setItem('parksmart_user', JSON.stringify(res.data.user));
        set({ user: res.data.user, token: res.data.token, isAuthenticated: true, isLoading: false });
        return { success: true };
      }
    } catch (err) {
      set({ isLoading: false });
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const res = await API.post('/auth/register', data);
      if (res.data.success) {
        localStorage.setItem('parksmart_token', res.data.token);
        localStorage.setItem('parksmart_user', JSON.stringify(res.data.user));
        set({ user: res.data.user, token: res.data.token, isAuthenticated: true, isLoading: false });
        return { success: true };
      }
    } catch (err) {
      set({ isLoading: false });
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('parksmart_token');
    localStorage.removeItem('parksmart_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
