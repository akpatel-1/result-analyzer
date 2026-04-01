import { create } from 'zustand';

import { studentApi } from '../api/student.api';

export const useAuthStore = create((set, get) => ({
  student: null,
  isAuthenticated: false,
  isLoading: false,

  fetchMe: async () => {
    if (get().student) return;

    set({ isLoading: true });
    try {
      const res = await studentApi.me();
      set({ student: res.data, isAuthenticated: true });
    } catch {
      set({ student: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await studentApi.logout();
    set({ student: null, isAuthenticated: false });
  },

  setStudent: (student) => set({ student, isAuthenticated: true }),
}));
