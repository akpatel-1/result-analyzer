import { loader as studentAuthLoader } from '../loader/student.auth.loader';
import StudentDashboardPage from '../pages/student/StudentDashboardPage';
import StudentLoginPage from '../pages/student/StudentLoginPage';

export const studentRoutes = [
  {
    path: '/student/login',
    element: <StudentLoginPage />,
    loader: studentAuthLoader.publicRoute,
  },
  {
    path: '/student/dashboard',
    element: <StudentDashboardPage />,
    loader: studentAuthLoader.protectedRoute,
  },
];
