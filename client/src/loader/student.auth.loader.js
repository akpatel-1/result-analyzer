import { redirect } from 'react-router-dom';

import { studentApi } from '../api/student.api';
import { useAuthStore } from '../store/user.auth.store';

export const studentLoader = {
  async protectedRoute() {
    try {
      const res = await studentApi.me();
      useAuthStore.getState().setStudent(res.data);
      return null;
    } catch {
      return redirect('/student/login');
    }
  },

  async publicRoute() {
    try {
      await studentApi.me();
      return redirect('/student/profile');
    } catch {
      return null;
    }
  },
};
