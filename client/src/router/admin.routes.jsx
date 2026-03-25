import { Navigate } from 'react-router-dom';

import { loader } from '../loader/admin.auth.loader';
import AdminDashboardPage from '../pages/admin/AdminDashboarPage';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminProfileUpload from '../pages/admin/AdminProfileUpload';
import AdminResultUpload from '../pages/admin/AdminResultUpload';
import AdminReviewUpload from '../pages/admin/AdminReviewUpload';

export const adminRoutes = [
  {
    loader: loader.publicRoute,
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    loader: loader.protectedRoute,
    path: '/admin/dashboard',
    element: <AdminDashboardPage />,
  },
  {
    loader: loader.protectedRoute,
    path: '/admin/upload',
    children: [
      { index: true, element: <Navigate to="profile" replace /> },
      { path: 'profile', element: <AdminProfileUpload /> },
      { path: 'result', element: <AdminResultUpload /> },
      { path: 'review', element: <AdminReviewUpload /> },
    ],
  },
];
