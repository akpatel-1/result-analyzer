import { create } from 'zustand';

import { studentApi } from '../api/student.api';

let meRequestPromise = null;

export const useAuthStore = create((set, get) => ({
  student: null,
  isAuthenticated: false,
  isLoading: false,

  fetchMe: async () => {
    if (get().student) return get().student;
    if (meRequestPromise) return meRequestPromise;

    meRequestPromise = (async () => {
      set({ isLoading: true });
      try {
        const res = await studentApi.me();
        set({ student: res.data, isAuthenticated: true });
        return res.data;
      } catch (error) {
        set({ student: null, isAuthenticated: false });
        throw error;
      } finally {
        set({ isLoading: false });
        meRequestPromise = null;
      }
    })();

    return meRequestPromise;
  },

  logout: async () => {
    await studentApi.logout();
    set({ student: null, isAuthenticated: false });
  },

  setStudent: (student) => set({ student, isAuthenticated: true }),
}));
