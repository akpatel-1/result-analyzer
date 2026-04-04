import { create } from 'zustand';

import { studentApi } from '../api/student.api';

let meRequestPromise = null;
let profileRequestPromise = null;

export const useAuthStore = create((set, get) => ({
  student: null,
  isAuthenticated: false,
  isLoading: false,
  profile: null,
  backlogs: [],
  cgpa: null,
  isProfileLoading: false,
  profileError: '',

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
    set({
      student: null,
      isAuthenticated: false,
      profile: null,
      backlogs: [],
      cgpa: null,
      isProfileLoading: false,
      profileError: '',
    });
  },

  setStudent: (student) =>
    set({
      student,
      isAuthenticated: true,
      profile: null,
      backlogs: [],
      cgpa: null,
      profileError: '',
    }),

  fetchProfile: async ({ force = false } = {}) => {
    const { profile, student } = get();
    const studentData = student?.user || student;
    const baseProfile = {
      name: studentData?.name,
      email: studentData?.email,
      roll_no: studentData?.roll_no,
      branch: studentData?.branch,
      enroll_id: studentData?.enroll_id,
      abc_id: studentData?.abc_id,
      batch: studentData?.batch,
    };

    if (baseProfile?.name && !profile) {
      set({ profile: baseProfile });
    }

    if (!force && profile) return profile;
    if (profileRequestPromise) return profileRequestPromise;

    profileRequestPromise = (async () => {
      set({ isProfileLoading: true, profileError: '' });
      try {
        const response = await studentApi.profile();
        const payload = response?.data?.profile || {};
        const nextProfile = payload?.profile || baseProfile || null;
        const nextBacklogs = Array.isArray(payload?.backlogs)
          ? payload.backlogs
          : [];
        const nextCgpa = payload?.cgpa || null;

        set({
          profile: nextProfile,
          backlogs: nextBacklogs,
          cgpa: nextCgpa,
          profileError: '',
        });

        return nextProfile;
      } catch (error) {
        set((state) => ({
          profile: state.profile || baseProfile || null,
          profileError:
            error?.response?.data?.message || 'Unable to fetch profile data.',
        }));
        throw error;
      } finally {
        set({ isProfileLoading: false });
        profileRequestPromise = null;
      }
    })();

    return profileRequestPromise;
  },
}));
