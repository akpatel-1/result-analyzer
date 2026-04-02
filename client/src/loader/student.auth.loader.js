import { redirect } from 'react-router-dom';

import { useAuthStore } from '../store/user.auth.store';

export const studentLoader = {
  async protectedRoute() {
    const authState = useAuthStore.getState();

    if (authState.student || authState.isAuthenticated) {
      return null;
    }

    try {
      await authState.fetchMe();
      return null;
    } catch {
      return redirect('/student/login');
    }
  },

  async publicRoute() {
    const authState = useAuthStore.getState();

    if (authState.student || authState.isAuthenticated) {
      return redirect('/student/profile');
    }

    try {
      await authState.fetchMe();
      return redirect('/student/profile');
    } catch {
      return null;
    }
  },
};
