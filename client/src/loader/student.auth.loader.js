import { redirect } from 'react-router-dom';

import { studentApi } from '../api/student.api';

export const loader = {
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
      return redirect('/student/dashboard');
    } catch {
      return null;
    }
  },
};
