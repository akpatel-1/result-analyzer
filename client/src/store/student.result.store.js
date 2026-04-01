import { create } from 'zustand';

import { studentApi } from '../api/student.api';

export const useResultStore = create((set, get) => ({
  latestResult: null,
  semesterResults: {},

  fetchLatestResult: async () => {
    if (get().latestResult) return;

    const res = await studentApi.latestResult();
    set({ latestResult: res.data });
  },

  fetchSemesterResult: async (sem) => {
    if (get().semesterResults[sem]) return;

    const res = await studentApi.semesterResult(sem);
    set((state) => ({
      semesterResults: { ...state.semesterResults, [sem]: res.data },
    }));
  },

  clearResults: () => set({ latestResult: null, semesterResults: {} }),
}));
