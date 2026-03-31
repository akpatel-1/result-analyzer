import { redirect } from 'react-router-dom';

import { deptApi } from '../api/dept.api';

export const deptLoader = {
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
      return redirect('/dept/overview');
    } catch {
      return null;
    }
  },
};
