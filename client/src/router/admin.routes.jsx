import { Navigate } from 'react-router-dom';

import { adminLoader } from '../loader/admin.auth.loader';
import AdminOverviewPage from '../pages/admin/AdminOverviewPage';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminProfileUpload from '../pages/admin/AdminProfileUpload';
import AdminResultUpload from '../pages/admin/AdminResultUpload';
import AdminSubjectUpload from '../pages/admin/AdminSubjectsUpload';

export const adminRoutes = [
  {
    loader: adminLoader.publicRoute,
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    loader: adminLoader.protectedRoute,
    path: '/admin/overview',
    element: <AdminOverviewPage />,
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
