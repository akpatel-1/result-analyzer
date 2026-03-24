import HodDashboardPage from '../pages/hod/HodDasbhoardPage';
import HodLoginPage from '../pages/hod/HodLoginPage';

export const hodRoutes = [
  {
    path: '/hod/login',
    element: <HodLoginPage />,
  },
  {
    path: '/hod/dashboard',
    element: <HodDashboardPage />,
  },
];
