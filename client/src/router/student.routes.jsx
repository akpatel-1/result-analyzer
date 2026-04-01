import { Navigate } from 'react-router-dom';

import { studentLoader } from '../loader/student.auth.loader';
import StudentLoginPage from '../pages/student/StudentLoginPage';
import StudentOverviewPage from '../pages/student/StudentOverviewPage';
import StudentProfilePage from '../pages/student/StudentProfilePage';
import StudentResultPage from '../pages/student/StudentResultPage';
import StudentLatestResult from '../pages/student/SudentLatestResultPage';

export const studentRoutes = [
  {
    path: '/',
    element: <Navigate to="/student/login" replace />,
    loader: studentLoader.protectedRoute,
  },
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
      { path: 'latest-result', element: <StudentLatestResult /> },
      { path: 'profile', element: <StudentProfilePage /> },
      { path: 'result', element: <StudentResultPage /> },
      { index: true, element: <Navigate to="profile" replace /> },
    ],
  },
];
