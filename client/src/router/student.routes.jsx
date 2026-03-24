import StudentDashboardPage from '../pages/student/StudentDashboardPage';
import StudentLoginPage from '../pages/student/StudentLoginPage';

export const studentRoutes = [
  {
    path: '/student/login',
    element: <StudentLoginPage />,
  },
  {
    path: '/student/dashboard',
    element: <StudentDashboardPage />,
  },
];
