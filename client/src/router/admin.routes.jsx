import { Navigate } from 'react-router-dom';

import { adminLoader } from '../loader/admin.auth.loader';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminOverviewPage from '../pages/admin/AdminOverviewPage';
import AdminProfilePage from '../pages/admin/AdminProfilePage';
import AdminProfileUpload from '../pages/admin/AdminProfileUpload';
import AdminResultPage from '../pages/admin/AdminResultPage';
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
    loader: adminLoader.protectedRoute,
    path: '/admin/student/profile',
    element: <AdminProfilePage />,
  },
  {
    loader: adminLoader.protectedRoute,
    path: '/admin/results',
    element: <AdminResultPage />,
  },
  {
    path: '/admin/upload',
    loader: adminLoader.protectedRoute,
    children: [
      { index: true, element: <Navigate to="profile" replace /> },
      { path: 'profiles', element: <AdminProfileUpload /> },
      { path: 'results', element: <AdminResultUpload /> },
      { path: 'subjects', element: <AdminSubjectUpload /> },
    ],
  },
];
