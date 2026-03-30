import { redirect } from 'react-router-dom';

import { adminApi } from '../api/admin.api';

export const adminLoader = {
  async protectedRoute() {
    try {
      const res = await adminApi.me();
      if (res.data.user.role !== 'admin') {
        return redirect('/error/403');
      }
      return null;
    } catch {
      return redirect('/admin/login');
    }
  },

  async publicRoute() {
    try {
      const res = await adminApi.me();
      if (res.data.user.role !== 'admin') {
        return redirect('/error/403');
      }
      return redirect('/admin/overview');
    } catch {
      return null;
    }
  },
};
