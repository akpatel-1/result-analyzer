import { loader as deptAuthLoader } from '../loader/dept.auth.loader';
import DeptDashboardPage from '../pages/department/DeptDasbhoardPage';
import DeptLoginPage from '../pages/department/DeptLoginPage';

export const deptRoutes = [
  {
    path: '/dept/login',
    element: <DeptLoginPage />,
    loader: deptAuthLoader.publicRoute,
  },
  {
    path: '/dept/dashboard',
    element: <DeptDashboardPage />,
    loader: deptAuthLoader.protectedRoute,
  },
];
