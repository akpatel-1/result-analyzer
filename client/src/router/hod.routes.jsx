import { loader as hodAuthLoader } from '../loader/hod.auth.loader';
import HodDashboardPage from '../pages/hod/HodDasbhoardPage';
import HodLoginPage from '../pages/hod/HodLoginPage';

export const hodRoutes = [
  {
    path: '/hod/login',
    element: <HodLoginPage />,
    loader: hodAuthLoader.publicRoute,
  },
  {
    path: '/hod/dashboard',
    element: <HodDashboardPage />,
    loader: hodAuthLoader.protectedRoute,
  },
];
