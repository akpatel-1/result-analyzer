import { redirect } from 'react-router-dom';

import { studentApi } from '../api/student.api';

export const studentLoader = {
  async protectedRoute() {
    try {
      await studentApi.me();
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
