import { redirect } from 'react-router-dom';

import { hodApi } from '../api/hod.api';

export const loader = {
  async protectedRoute() {
    try {
      await hodApi.me();
      return null;
    } catch {
      return redirect('/hod/login');
    }
  },

  async publicRoute() {
    try {
      await hodApi.me();
      return redirect('/hod/dashboard');
    } catch {
      return null;
    }
  },
};
