import { Navigate } from 'react-router-dom';

import { loader } from '../loader/admin.auth.loader';
import AdminDashboardPage from '../pages/admin/AdminDashboarPage';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminProfileUpload from '../pages/admin/AdminProfileUpload';
import AdminResultUpload from '../pages/admin/AdminResultUpload';
import AdminSubjectUpload from '../pages/admin/AdminSubjectsUpload';

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
    path: '/admin/upload',
    children: [
      { index: true, element: <Navigate to="profile" replace /> },
      { path: 'profiles', element: <AdminProfileUpload /> },
      { path: 'results', element: <AdminResultUpload /> },
      { path: 'subjects', element: <AdminSubjectUpload /> },
    ],
  },
];
