import { Navigate } from 'react-router-dom';

import { studentLoader } from '../loader/student.auth.loader';
import StudentLoginPage from '../pages/student/StudentLoginPage';
import StudentOverviewPage from '../pages/student/StudentOverviewPage';
import StudentProfilePage from '../pages/student/StudentProfilePage';

export const studentRoutes = [
  {
    path: '/student/login',
    element: <StudentLoginPage />,
    loader: studentLoader.publicRoute,
  },
  {
    path: '/student',
    element: <StudentOverviewPage />,
    loader: studentLoader.protectedRoute,
    children: [
      { path: 'overview', element: <div>Overview </div> },
      { path: 'profile', element: <StudentProfilePage /> },
      { index: true, element: <Navigate to="profile" replace /> },
    ],
  },
];
