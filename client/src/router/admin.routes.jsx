import AdminDashboardPage from '../pages/admin/AdminDashboarPage';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminUploadPage from '../pages/admin/AdminUploadPage';

export const adminRoutes = [
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin/dashboard',
    element: <AdminDashboardPage />,
  },
  {
    path: '/admin/upload',
    element: <AdminUploadPage />,
  },
];
