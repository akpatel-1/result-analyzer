import { redirect } from 'react-router-dom';

import { deptApi } from '../api/dept.api';

export const loader = {
  async protectedRoute() {
    try {
      await deptApi.me();
      return null;
    } catch {
      return redirect('/dept/login');
    }
  },

  async publicRoute() {
    try {
      await deptApi.me();
      return redirect('/dept/dashboard');
    } catch {
      return null;
    }
  },
};
