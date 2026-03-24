import { redirect } from 'react-router-dom';

import { adminApi } from '../api/admin.api';

export const loader = {
  async protectedRoute() {
    try {
      const res = await adminApi.me();
      if (res.data.user.role !== 'admin') {
        return redirect('/unauthorized');
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
        return redirect('/unauthorized');
      }
      return redirect('/admin/dashboard');
    } catch {
      return redirect('/admin/login');
    }
  },
};
